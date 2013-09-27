var ES = require('./email-settings'),
	nodemailer = require("nodemailer");

var EM= {};
module.exports = EM;

EM.smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: ES.user,
        pass: ES.password
    }
});


EM.sendEmail = function (params, callback) 
{    

  var mailOptions = {
      from: params.from, //"Sender Name ✔ <sender@example.com>", // sender address
      to: params.to, //"receiver1@example.com, receiver2@example.com", // list of receivers
      subject: params.subject,//"Hello", // Subject line
      text: params.text, //"Hello world ✔", // plaintext body
      html: params.htmlbody  // html body
  }

  EM.smtpTransport.sendMail(mailOptions, function(error){
      if (callback) {
      	if (error) {
      		callback(error,'009');
      	} else {
      		callback();
      	}
      }
  });    
 }

EM.dispatchResetPasswordLink = function(account, url, callback) {
  var link = url+'/resetpwd?n='+account.nick+'&p='+account.pwd;
  var html = "<html><body>";
    html += "<a href='http://www.digitalmoka.com'><img src='"+url+"/images/icon1.png' alt='Big Solitaire' height='100' width='180'></a>";
    html += "<br><br>Hi,<br><br>";
    html += "Use this username to log into the game : <b>"+account.nick+"</b><br><br>";
    html += "<a href='"+link+"'>Click here to reset your password</a><br><br>";
    html += "Regards,<br>";
    html += "<a href='http://www.digitalmoka.com'>Big Solitaire Team</a><br><br>";
    html += "</body></html>";

  var mailOptions = {
    from: 'Big Solitaire Support <info@big-solitaire.com>',
    to: account.email,
    htmlbody:html,
    subject: "Big Solitaire - Password Reset"
  }

  EM.sendEmail(mailOptions);

  callback(); 
}