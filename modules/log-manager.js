var LoS = require('./log-settings'),
	DbS = require('./db-settings'),
	EM = require('./email-manager'),
	WMongoDB = require('winston-mongodb').MongoDB,
	winston = require('winston');

var productionMode = (process.env.NODE_ENV || '').toLowerCase() === 'production';

var errLevel;
if (productionMode) {
  errLevel = 'error';
} else {
  errLevel = '';
}  

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: LoS.filename , "level":errLevel}), 
    new (winston.transports.Console)({"level":errLevel}) 
  ]
});

if (productionMode) {
  var Mail = require('winston-nodemail').Mail;

  logger.add(WMongoDB, {
          "db": DbS.mongoDb,
          "collection": DbS.appPrefix+"log",
          "level": errLevel
          });

  logger.add(Mail, {
        "level": errLevel,
        "to": LoS.mailto,
        "handleExceptions": false,
        "nodemailer": EM.smtpTransport
  });
} 

module.exports = logger;
