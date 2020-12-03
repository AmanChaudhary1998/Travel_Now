var express = require('express');
var router = express.Router();
var url=require('url')
var adminModel=require('../models/adminmodels')
var randomstring = require('randomstring')
var path = require('path');
const indexModel = require('../models/indexmodels');
const userModel = require('../models/usermodels');

/* Middleware to check the admin authentication */
router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!='admin'){
    req.session.destroy()
    res.redirect('/logout')
  }
  next()
})

/* MIDDLEWARE  */
var clist
router.use('/managesubcategory',(req,res,next)=>{
  indexModel.fetchAll('category').then((result)=>{
    clist = result
    next()
  }).catch((err)=>{
    console.log(err)
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin',{'srole':req.session.srole,'sunm':req.session.sunm})
});
router.get('/manageuser',(req,res,next)=>{
  adminModel.fetchUser().then((result)=>{
    res.render('manageuser',{'result':result,'srole':req.session.srole,'sunm':req.session.sunm})
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/manageuserstatus',(req,res,next)=>{
  var statusdetail=url.parse(req.url,true).query
  adminModel.manageuserstatus(statusdetail).then((result)=>{
    res.redirect('/admin/manageuser')
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/managecategory',(req,res,next)=>{
  res.render('managecategory',{"msg":" ",'srole':req.session.srole,'sunm':req.session.sunm})
})
router.post('/managecategory',(req,res,next)=>{
  var catnm = req.body.catnm
  var caticon = req.files.caticon
  var caticon_nm  = randomstring.generate()+Date.now()+"-"+caticon.name
  var caticonpath = path.join(__dirname,'../public/uploads/categoryicon',caticon_nm)
  adminModel.managecategory(catnm,caticon_nm).then((result)=>{
    if(result){
      caticon.mv(caticonpath);
      res.render('managecategory',{'msg':'Category Inserted successfully...','srole':req.session.srole,'sunm':req.session.sunm})
    }
    else{
      res.render('managecategory',{'msg':'Category alredy exists...','srole':req.session.srole,'sunm':req.session.sunm})
    }
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/managesubcategory',(req,res,next)=>{
  res.render('managesubcategory',{'msg':'','clist':clist,'srole':req.session.srole,'sunm':req.session.sunm})
})
router.post('/managesubcategory',(req,res,next)=>{
  var catnm = req.body.catnm
  var subcatnm = req.body.subcatnm
  var subcaticon = req.files.subcaticon
  var subcaticon_nm = randomstring.generate()+Date.now()+'-'+subcaticon.name
  var subcaticonpath = path.join(__dirname,'../public/uploads/subcategoryicon',subcaticon_nm)
  adminModel.managesubcategory(catnm,subcatnm,subcaticon_nm).then((result)=>{
    if(result){
      subcaticon.mv(subcaticonpath)
      res.render('managesubcategory',{'msg':'Sub Category Inserted Successfully...','clist':clist,'srole':req.session.srole,'sunm':req.session.sunm})
    }
    else{
      res.render('managesubcategory',{'msg':'Sub Category already exists..','clist':clist,'srole':req.session.srole,'sunm':req.session.sunm})
    }
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/adminsettings',(req,res,next)=>{
  res.render('adminsettings',{'srole':req.session.srole,'sunm':req.session.sunm})
})

router.get('/changepassword',(req,res,next)=>{
  res.render('changepassword',{'msg': '','srole':req.session.srole,'sunm':req.session.sunm})
})

router.post('/changepassword',(req,res,next)=>{
  adminModel.verify(req.session.sunm,req.body).then((result)=>{
    if(result){
      res.render('changepassword',{'msg':'Password reset successfully...','srole':req.session.srole,'sunm':req.session.sunm})
    }
    else{
      res.render('changepassword',{'msg':'Current password is invalid please try again','srole':req.session.srole,'sunm':req.session.sunm})
    }
  }).catch((err)=>{
    console.log(err)
  })
})


module.exports = router;
