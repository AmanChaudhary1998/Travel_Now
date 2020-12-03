var nodemailer = require('nodemailer');

function sendPassword(emailid){

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
  html: '<h2>Welcome to SuFarNamaA</h2><p>Click the below link to change your password...</p><h3>Username'+emailid+'<h3><br>http://localhost:3000/reset?emailid='+emailid
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports=sendPassword