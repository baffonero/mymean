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

    var UsersS = new mSchema({
        nick     :  { type:String, index: { unique: true}} ,
        authMode :  { type: String, default: 'FB' },
        pwd      :  String,
        created  :  { type: Date, default: Date.now },
    },
        { strict: false });


    var users = db.model("users", UsersS);

   this.getUsers = function(query, callback) {
        "use strict";

        var q = users.find(query).limit(3);

        q.exec(function(err, results) {
            "use strict";

            if (!err) {
                console.log("Retrieved users");
                return callback(null, results);
            }

            return callback(err, null);
        });
    }
   this.getTodayUsers = function(callback) {
        "use strict";
        var startDate = new Date();//.toISOString();
        startDate.setHours(0,0,0,0);

        var match = {"gamesdet.scopa": {$exists:true}, created: {$gte: startDate}};

        var resObj = {}; 
        var that = this;
        users.count(match,function(err, results){
            resObj.todayUsers = results;
            return callback(err, resObj);
        });                
    }    
   this.getPastUsers = function(query, callback) {
        "use strict";

        var numlastDays = 7;
        var numlastMonth = 30;

        var resObj = {}; 

        var that = this;
        that.getLastDaysUsers(numlastDays,function(err, results){
            resObj.lastDaysUsers = results;
            that.getAverageUsers(numlastMonth,function(err, results){
                resObj.lastMonthUsers = results;
                that.getAverageUsers(null,function(err, results){
                    resObj.overallUsers = results;
                    return callback(err, resObj);
                });                
            });
        });

    }

   this.getAverageUsers = function(numDay, callback) {
        "use strict";
        var oneDay = 24*60*60*1000; 
        var numGG = numDay;
        var endDate = new Date();//.toISOString();
        var endMinute = (endDate.getHours()*60) + endDate.getMinutes();
        endDate.setHours(0,0,0,0);
        
        if (numDay) {
            var startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - numGG);
            startDate.setHours(0,0,0,0);
        } else {
          var startDate = new Date("2013-09-23"); 
          startDate.setHours(0,0,0,0);
          numGG = Math.round(Math.abs((endDate.getTime() - startDate.getTime())/(oneDay))); 
        }

        var match = {"gamesdet.scopa": {$exists:true}, created: {$gt: startDate,$lt: endDate}};

        console.log("match",match);

        users.aggregate(
            {$match: match  }, 
            {$project:
                {created:1,                 
                 instant: {$cond:[{$lte: [{ $add: [{ $multiply: [ { $hour: '$created' }, 60 ] }, { $minute: '$created' } ] }, endMinute]},1,0]}
                }
            },
            { $group : 
                { _id : "AVERAGE", tot:{$sum:1}, instant:{$sum:"$instant"} 
                } 
            },
        function(err, results) {
            if (!err) {
                results[0].tot = Math.round(results[0].tot/numGG);
                results[0].instant = Math.round(results[0].instant/numGG);
                return callback(null, results);
            }

            return callback(err, null);
        });
    }

   this.getLastDaysUsers = function(numDay, callback) {
        "use strict";

        var numGG = numDay;
        var endDate = new Date();//.toISOString();
        var startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - numGG);
        startDate.setHours(0,0,0,0);
        var match = {"gamesdet.scopa": {$exists:true}, created: {$gt: startDate,$lt: endDate}};
        var endMinute = (endDate.getHours()*60) + endDate.getMinutes();
        endDate.setHours(0,0,0,0);
        console.log("endMinute", endMinute);


        console.log("match", match);

        users.aggregate(
            {$match: match  }, 
            {$project:
                {created:1,                 
                 instant: {$cond:[{$lte: [{ $add: [{ $multiply: [ { $hour: '$created' }, 60 ] }, { $minute: '$created' } ] }, endMinute]},1,0]}
                }
            },
            { $group : 
                { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}}, tot:{$sum:1}, instant:{$sum:"$instant"} 
                } 
            },             
            {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1} },
        function(err, results) {
            if (!err) {
                return callback(null, results);
            }

            return callback(err, null);
        });
    }

}

module.exports.UsersDAO = UsersDAO;

