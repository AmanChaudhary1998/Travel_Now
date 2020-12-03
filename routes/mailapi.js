var nodemailer = require('nodemailer');

function sendMail(emailid,password){

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'learner.learn.official@gmail.com',
    pass: 'amaniseverywhere'
  }
});

var mailOptions = {
  from: 'learner.learn.official@gmail.com',
  to: emailid,
  subject: 'Verify your Email ',
  html: '<h2>Welcome to SuFarNamaA</h2><p>Click the below link for successfully register...</p><h3>Username'+emailid+'<h3></h3>Password'+password+'</h3><br>http://localhost:3000/verifyuser?emailid='+emailid
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports=sendMail