var unirest = require("unirest");

function sendSMS(mobile){
var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

req.query({
  "authorization": "54loYnkW3OGPBFTM0qQaHvpL1ZyXeEIJ72mr8uScRChD9idxAtvMJjd1SP2u7b6QxrhO0F8mcozUHYls",
  "sender_id": "FSTSMS",
  "message": "Successfully register to SuFarNamaA",
  "language": "english",
  "route": "p",
  "numbers": mobile,
});

req.headers({
  "cache-control": "no-cache"
});


req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});
}

module.exports=sendSMS