var express = require('express');
var url = require('url')
var router = express.Router();
var indexModel=require("../models/indexmodels")
const sendMail = require('./mailapi')
const sendPassword = require('./forgetmailapi')
const sendSMS = require('./smsapi')

/* Middleware for the authentication */
router.use((req,res,next)=>{
  if(req.session.sunm!=undefined){
    req.session.destroy()
  }
  next()
})

/* Middleware to set the cookie  */

router.use('/member',(req,res,next)=>{
  cunm=''
  cpass=''
  if(req.cookies.cunm!=undefined){
    cunm=req.cookies.cunm
    cpass=req.cookies.cpass
  }
  next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
  indexModel.fetchAll('category').then((result)=>{
    res.render('index',{"clist":result})
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/about',(req,res,next)=>{

  res.render('about')
})

router.get('/register', function(req, res, next) {
  res.render('register',{"msg":""});
});

router.post('/register', function(req, res, next) {
  indexModel.register(req.body).then((result)=>{
    sendMail(req.body.email,req.body.password)
    sendSMS(req.body.mobile)
    res.render('register',result)
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/verifyuser', function(req, res, next) {
  var emailid = url.parse(req.url,true).query.emailid
  indexModel.verifyuser(emailid).then((result)=>{
    res.redirect('../member')
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/service', function(req, res, next) {
  res.render('service');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/member', function(req, res, next) {
  res.render('member',{"msg":""});
});

router.post('/member',(req,res,next)=>{
  indexModel.login(req.body).then((result)=>{
    if(result.length==0){
      res.render('member',{"msg":"Invalid username or password please try again",'cunm':cunm,'cpass':cpass})
    }
    else{

      if(result[0].status==0){
        res.render('member',{'msg':'Sorry you are blocked by the admin','cunm':cunm,'cpass':cpass})
      }
      else{

        req.session.sunm = result[0].email
        req.session.srole = result[0].role

      if(req.body.chk!=undefined){
        res.cookie('cunm',result[0].email,{'expires':new Date(Date.now()+900000)})
        res.cookie('cpass',result[0].password,{'expires':new Date(Date.now()+900000)})
      }

        if(result[0].role=='admin'){
          res.redirect('/admin')
          }
          else{
            res.redirect('/users')
          }
      }
    }
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/viewsubcategory',(req,res,next)=>{
  var catnm = url.parse(req.url,true).query.catnm
  indexModel.viewsubcategory(catnm).then((result)=>{
    res.render('viewsubcategory',{'catnm':catnm,'sclist':result,'srole':req.session.srole,'sunm':req.session.sunm})
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/logout',(req,res,next)=>{
  res.redirect('/member')
})

router.get('/forgetpassword',(req,res,next)=>{
  res.render('forgetpassword')
})
router.post('/forgetpassword',(req,res,next)=>{
  indexModel.resetpassword(req.body).then((result)=>{
    if(result){
      sendPassword(req.body.email)
      res.setHeader('Content-Type','text/html')
      res.write('<html><body><h2>Reset password Link is send to your Email address</h2></body></html>')
      res.end()
    }
    else{
      res.redirect('/forgetpassword',{'msg':'Invalid email id...please try with valid email id'})
    }
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/reset',(req,res,next)=>{
  var emailid=url.parse(req.url,true).query.emailid
  res.render('reset.ejs',{'email':emailid,'msg':''})
})

router.post('/reset',(req,res,next)=>{
  indexModel.reset(req.body).then((result)=>{
    if(result){
      res.redirect('../member')
    }
    else{
      res.redirect({'msg':'Invalid Credentials please try again...'},'../member')
    }
  }).catch((err)=>{
    console.log(err)
  })
})

module.exports = router;
