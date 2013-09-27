var AcS = require('./achievement-settings'),
	_ = require('underscore')._,
  AM = require('./account-manager');

  require('./../game/src/classes/Enums.js');

var AcM = {};

module.exports = AcM;

var UsersM = AM.users;

AcM.storeAchiev = function  (guid, achievCode, notify, callback) {
  var resObj = {success: false, errCode: "000"};
  var errMsg;

  var incrObj = {};

  incrObj.$addToSet = {};
  incrObj.$addToSet['gamesdet.scopa.badge']  = achievCode;  

  if (notify) {
    incrObj.$addToSet['gamesdet.scopa.notify']  = achievCode;  
  }

  UsersM.findOneAndUpdate({guid:guid}, incrObj, 
    (function(err, newUserObj) {
        if (err){
          resObj.errCode = '012';
          errMsg = GT.Enums.ErrorCodes['012']+err; 
          resObj.errMsg = errMsg;
        } else {
          resObj.success = true;
          delete resObj.errCode;
        }  
        callback(errMsg, resObj, newUserObj);
    })
  ); 
 
}

AcM.checkAchiev = function  (checkObj, type, callback) {

  var vBadge;
  var vNewBadge = []; 
  var vCheckObj = checkObj; 
  var testFunc = function(chObj, formula){return eval(formula)};
  var notify;
  if (type==="ldbrds") {
    notify = true;
  } else {
    notify = false;
  }
  
  checkUser(checkObj, function (err, user) {
    if (user.gamesdet.scopa) {
      vBadge = user.gamesdet.scopa.badge||[];   
    } else {
      vBadge = [];
    }

    if (checkObj.score) {
      checkObj.score.ldbrd =
        _.invert(GT.Enums.Levels)[checkObj.score.lev];

    }

    vCheckObj.user = user;

    //console.log(vCheckObj);
    
    //Filtro solo gli achievement lato Server, del tipo evento specificato e non ancora conseguiti dall'utente
    vAchiev = _.filter(AcS.achievements, function(achiev){ 
      return achiev["cli-srv"] === "SRV" && achiev["when"] === type && _.contains(vBadge, achiev["code"]) === false;   
    });
    
    //ciclo su ogni Achievement testandone la formula
    var numAchiev = vAchiev.length;

    if (numAchiev > 0) { 
      _.each(vAchiev, function(achiev){

        var testValue;
        //console.log("achiev.code",achiev.code);
          testValue = testFunc(vCheckObj, achiev.formula||"1==2");
          //console.log("testValue",testValue);
          
          if (testValue) {
            AcM.storeAchiev(vCheckObj.user.guid, achiev.code, notify,  function (err, res) {
              vNewBadge.push(achiev.code);
              numAchiev -= 1;
              if (numAchiev === 0) {
                callback(err, vNewBadge);  
              }
            });          
          } else {
            numAchiev -= 1;
            if (numAchiev === 0) {
              callback(err);
            }    
          }
      });
    } else {
      callback(err);  
    } 
  });            
}

checkUser = function  (checkObj, callback) {
  if (checkObj.user) {
    callback(null, checkObj.user);  
  } else {
    UsersM.findOne({ guid: checkObj.guid }, function (err, user) {
      callback(err, user);
    });
  }
}