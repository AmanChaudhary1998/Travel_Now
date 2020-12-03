var express = require('express');
const indexModel = require('../models/indexmodels');
var url = require('url')
var router = express.Router();
var userModel = require('../models/usermodels')
var state_city_list = require('./state-city-list')
var randomstring = require('randomstring')
var path = require('path')

/* Middleware to check the user authentication */

router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!='user')
  {
    req.session.destroy()
    res.redirect('/logout')
  }
  next()
})

/*Middleware to fetch the category */
var clist
router.use('/addlocation',(req,res,next)=>{
  indexModel.fetchAll('category').then((result)=>{
    clist=result
    next()
  }).catch((err)=>{
    console.log(err)
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user',{'srole':req.session.srole,'sunm':req.session.sunm});
});

router.get('/addlocation',(req,res,next)=>{
  var state_list = state_city_list.fetchStateList()
  var city_list = state_city_list.fetchCityList()
  res.render('addlocation',{'clist':clist,'srole':req.session.srole,'sunm':req.session.sunm,'state_list':state_list,'city_list':city_list,'msg':''})
})

router.post('/addlocation',(req,res,next)=>{
  var state_list = state_city_list.fetchStateList()
  var city_list = state_city_list.fetchCityList()

  locationDetails = req.body

  var img1 = req.files.file1
  var imgDetails1 = randomstring.generate()+Date.now()+"-"+img1.name
  var imgpath1 = path.join(__dirname,'../public/uploads/locationicon',imgDetails1)
  img1.mv(imgpath1)

  var img2 = req.files.file2
  if(img2!=undefined){
    var imgDetails2=randomstring.generate()+Date.now()+"-"+img2.name
    var imgpath2 = path.join(__dirname,'../public/uploads/locationicon',imgDetails2)
    img2.mv(imgpath2)
  }
  else{
    var imgDetails2="default.png"
  }
  var img3 = req.files.file3
  if(img3!=undefined){
    var imgDetails3=randomstring.generate()+Date.now()+"-"+img3.name
    var imgpath3 = path.join(__dirname,'../public/uploads/locationicon',imgDetails3)
    img3.mv(imgpath3)
  }
  else{
    var imgDetails3="default.png"
  }
  var img4 = req.files.file4
  if(img4!=undefined){
    var imgDetails4=randomstring.generate()+Date.now()+"-"+img4.name
    var imgpath4 = path.join(__dirname,'../public/uploads/locationicon',imgDetails4)
    img4.mv(imgpath4)
  }
  else{
    var imgDetails4="default.png"
  }
  userModel.addlocation(locationDetails,imgDetails1,imgDetails2,imgDetails3,imgDetails4).then((result)=>{
    if(result){
      res.render('addlocation',{'msg':'Location Added Successfully','clist':clist,'srole':req.session.srole,'sunm':req.session.sunm,'state_list':state_list,'city_list':city_list})
    }
    else{
      res.render('addlocation',{'msg':'Something Went Wrong Please try again','clist':clist,'srole':req.session.srole,'sunm':req.session.sunm,'state_list':state_list,'city_list':city_list})
    }
  }).catch((err)=>{

  })
})

router.get('/fetchsubcat',(req,res,next)=>{
  var catnm = url.parse(req.url,true).query.catnm
  userModel.fetchsubcat(catnm).then((result)=>{
    res.send(result)
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/fetchcity',(req,res,next)=>{
  var s = url.parse(req.url,true).query.s
  var city_list = state_city_list.fetchCityList(s)
  res.send(city_list)
})

router.get('/fetchlocality',(req,res,next)=>{
  var c = url.parse(req.url,true).query.c
  userModel.fetchlocality(c).then((result)=>{
    res.send(result)
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/managelocation',(req,res,next)=>{
  userModel.fetchAll('addlocation').then((result)=>{
    PAYPAL_URL="https://www.sandbox.paypal.com/cgi-bin/webscr"
  	PAYPAL_ID="sb-6w4b472741371@business.example.com"
    res.render('managelocation',{'result':result,'PAYPAL_URL':PAYPAL_URL,'PAYPAL_ID':PAYPAL_ID,'srole':req.session.srole,'sunm':req.session.sunm})
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/payment',(req,res,next)=>{
  urlData=url.parse(req.url,true).query
  userModel.pay(urlData).then((result)=>{
    res.redirect('/users/managelocation')
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/cancel',(req,res,next)=>{
  res.redirect('/users/managelocation')
})



module.exports = router;
