var bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

/* The UsersDAO must be constructed with a connected database object */
function UsersDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(db);
    }

    var mSchema = mongoose.Schema;
    var mModel =  mongoose.model;

    var ObjectId = function (stringId, callback) { 
      var objId = mongoose.Types.ObjectId();
      return objId;
    }

    var AdminsS = new mSchema({
        nick     :  { type:String, index: { unique: true}} ,
        authMode :  { type: String, default: 'FB' },
        pwd      :  String,
        created  :  { type: Date, default: Date.now },
    },
        { strict: false });


    admins = db.model("admins", AdminsS);

    var users = db.collection("users");

    this.addUser = function(username, password, email, callback) {
        "use strict";

        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {'_id': username, 'password': password_hash};

        // Add email if set
        if (email != "") {
            user['email'] = email;
        }

        users.insert(user, function (err, result) {
            "use strict";

            if (!err) {
                console.log("Inserted new user");
                return callback(null, result[0]);
            }

            return callback(err, null);
        });
    }

    this.validateLogin = function(username, password, callback) {
        "use strict";

        // Callback to pass to MongoDB that validates a user document
        function validateUserDoc(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                }
                else {
                    var invalid_password_error = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalid_password_error.invalid_password = true;
                    callback(invalid_password_error, null);
                }
            }
            else {
                var no_such_user_error = new Error("User: " + user + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                no_such_user_error.no_such_user = true;
                callback(no_such_user_error, null);
            }
        }

        users.findOne({ '_id' : username }, validateUserDoc);
    }
}

module.exports.UsersDAO = UsersDAO;

/*
var AS = require('./account-settings'),
  DM = require('./db-manager'),
  DS = require('./db-settings'),
  bcrypt = require('bcrypt'),
  _ = require('underscore')._;

var AM = {};
module.exports = AM;

AM.dailyUsersStats = _.filter(AS.usersStats, function(stat){ return stat.expire === "DAILY";});
AM.monthlyUsersStats = _.filter(AS.usersStats, function(stat){ return stat.expire === "MONTHLY";});
AM.dailyUsersStats = _.map(AM.dailyUsersStats, function(stat){
    return (DS.appPrefix+stat.id);  
});
AM.monthlyUsersStats = _.map(AM.monthlyUsersStats, function(stat){
    return (DS.appPrefix+stat.id);  
});

function saltAndHash(pass, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
      callback(hash);
    });
  });
} 

function renderUserObj (userObj) {
  if (typeof(userObj) =='object') {
    var newUserObj = userObj;
  } else {
    var newUserObj = userObj.toObject();   
  }
  delete newUserObj.email;
  delete newUserObj.pwd; 
  return newUserObj;
}

function assignNick(userObj, callback) {
  //name, nick
  if (userObj.nick) {
    callback(userObj.nick); 
  } else if (userObj.name) {
    var nick;
    var nameArray = userObj.name.split(" ");
    tmpNick = nameArray[0];  
    if (nameArray[1]) {
      tmpNick += " "+nameArray[1].substring(0, 1)+'.'; 
    }
    AM.users.find({nick: new RegExp("^"+tmpNick)},{nick:1} , function (err, docs) {
      if (docs.length > 0) {
        var suffix = 0;
        do
          {
            suffix += 1;
            var candNick = tmpNick+suffix.toString();
            var checkNick = _.find(docs, function(vDoc){ return vDoc.nick === candNick});
          }
        while (checkNick);  
        nick = candNick;              
      } else {
        nick = tmpNick;  
      }         
      callback(nick);  
    }); 
      
  } else {
    callback(null);
  }
}

AM.usersStats = _.map(AS.usersStats, function(stat){
    return (DS.appPrefix+stat.id);  
});

AM.findOrCreateUser = function (user, callback) {
    if(!user) return callback("input params missing.");

    var query = {};
    var errMsg;
    var userObj = {};
    var fbidCond = {};
    var nickCond = {};
    var mailCond = {};
    var orCond = [];
    var authMode;

    if (user.id || (user.nick && user.pwd)) {
        if (user.pwd) {
          authMode = 'PR';
          nickCond = {nick: user.nick, authMode: 'PR'};
          orCond.push(nickCond);
          mailCond = {email: user.email, authMode: 'PR'};
          orCond.push(mailCond);
        } else {
          if (user.id) {
            authMode = 'FB';
            fbidCond = {fbid: user.id, authMode: 'FB'};
            orCond.push(fbidCond);
          }          
        }
        
        query.$or = orCond; 

        AM.admins.find(query,function(err, resObj) {


          if (err) {
            errMsg = err;
            callback(errMsg, userObj);  
            return;
          }  

          (function(callback) {
            if (resObj.length > 0) { 
                var userRes = resObj[0];
                callback(errMsg, userRes);
            } else {
              callback("Access Forbidden", userRes);  
            }
          })(function (err, userResponse) {
            if (!err) {
             userObj.user = renderUserObj(userResponse);
            }
            callback(err, userObj);                     
          });
        });                  
         
    } else {
      callback(errMsg, userObj);  
    }
}

AM.getUser = function  (vValue, vAttr, outAttr, callback) {
  var query = {};
  query[vAttr] = vValue; 
  
  AM.users.find(query, outAttr , function (err, docs) {
    callback(err, docs[0]);  
  });    
}

AM.getUserByEmail = function  (email, callback) {
  AM.users.findOne({email:email, authMode:'PR'}, function (err, user) {
    callback(err, user);  
  });    
}

AM.authenticate = function (nick, pwd, crypt, callback) {
  var userObj = {};
  if (!nick || !pwd) 
    {callback("input params missing.");}
  else {
    AM.users.find({nick:nick, authMode: 'PR'},function(err, resObj) {
      if (resObj.length > 0) { 
        if (resObj[0].banned === true) {
          callback(err, userObj, "010");
        }
          else { 
          if (!crypt) {
            bcrypt.compare(pwd, resObj[0].pwd||pwd, function(err, res) {
              if (res){
                userObj.user = renderUserObj(resObj[0]);
                callback(err, userObj);  
              } else{
                callback(err, userObj, "001");   
              }
            });
          } else {
            if (resObj[0].pwd === pwd){
              userObj.user = renderUserObj(resObj[0]);
              callback(err, userObj);  
            } else{
              callback(err, userObj, "001");   
            }
          }  
        }
      } else {
        callback(err, userObj,"002"); 
      }
        
    });
  }              
}

AM.updateNick = function (userPostObj, callback) {
  if(!userPostObj) return callback("input params missing.");
  var userObj = {};
  var errMsg;
  AM.users.find({guid:userPostObj.guid},function(err, resObj) {
    if (err) {
      callback(err, userObj);  
      return;
    }  

    if (resObj.length > 0) { 
      var userRes = resObj[0];
      userRes.nick = userPostObj.nick;
      userRes.save(function (err) {
        if (err) {
          if (err.code === 11001) {
            callback('', userObj,'003');  
          } else {
            callback(err, userObj);   
          }
        } else {
          userObj.user = renderUserObj(userRes);
          callback(errMsg, userObj);  
        } 
      });
    } else {
      callback(errMsg, userObj, '002');            
    }
  });                
}

AM.connectFB = function (userPostObj, callback) {
  if(!userPostObj) return callback("input params missing.");
  var userObj = {};
  var errMsg;
  AM.users.find({guid:userPostObj.guid,authMode:"PR"},function(err, resObj) {
    if (err) {
      callback(err, userObj);  
      return;
    }  

    if (resObj.length > 0) { 
      var userRes = resObj[0];
      userRes.fbid = userPostObj.fbid;
      userRes.save(function (err) {
        if (err) {
            callback(err, userObj);   
        } else {
          userObj.user = renderUserObj(userRes);
          callback(errMsg, userObj);  
        } 
      });
    } else {
      callback(errMsg, userObj, '002');            
    }
  });                
}

AM.updatePwd = function (userPostObj, callback) {
  if(!userPostObj) return callback("input params missing.");
  AM.users.findOne({guid:userPostObj.guid},function(err, resObj) {
    if (err) {
      callback(err, userObj);  
      return;
    }  
    if (resObj) { 
      saltAndHash(userPostObj.pwd, function(hash) {                      
        resObj.pwd = hash; 
        resObj.save(function (err) {
          callback(err);  
        });                             
      });              
    } else {  
      callback(errMsg, userObj,'002');            
    }
  });
}


var UsersS = new DM.Schema({
    nick     :  { type:String, index: { unique: true}} ,
    authMode :  { type: String, default: 'FB' },
    pwd      :  String,
    created  :  { type: Date, default: Date.now },
},
    { strict: false });


AM.users = DM.mongoCli.model("users", UsersS);



/*