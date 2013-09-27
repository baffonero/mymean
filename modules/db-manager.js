var DS = require('./db-settings'),
    AS = require('./account-settings'),
    config = require('./../config.js'),
	  mongoose = require('mongoose'),
    redis = require('redis'),
    _ = require('underscore')._;

var mongoConnString = 'mongodb://'+config.mongoHost+'/'+DS.mongoDb;

var DM = {};
module.exports = DM;

DM.mongoCli = mongoose.connect(mongoConnString);

if (config.redisHost) {

  DM.redisCli = redis.createClient(6379,config.redisHost);

  DM.redisCli.select(DS.redisDb);

  DM.updStats = function (statsArray, incrObj, callback) {
    var tmpStatsArray = _.map(statsArray, function(stat){
                                var lead = [incrObj.mode, stat];
                                if (incrObj.value) {lead.push(incrObj.value)}
                                if (incrObj.member) {lead.push(incrObj.member)}
                                return lead; 
                              });
    DM.redisCli.multi(tmpStatsArray).exec(function (err, replies) {
      if (callback) {
        callback(err);
      }
    });                    
  }

  DM.getRedisString = function (stringId, callback) { 

      DM.redisCli.get(stringId, function (err, stringValue) {

          var resObj = {};
          var errMsg; 

          if (err) {
            errMsg =  'Error getting' + stringId + err; 
          } 
          else {
            resObj[stringId] = stringValue;
          }

          callback(errMsg, resObj);
          
      });         
  }

}

DM.Schema = mongoose.Schema;
DM.Model =  mongoose.model;

DM.ObjectId = function (stringId, callback) { 
  var objId = mongoose.Types.ObjectId();
  return objId;
}

DM.postCreateStats = function (schema, stats) {  
  schema.pre('save', function (next) {
    DM.updStats(stats, {mode:"incr"} );
    next();
  })
}



