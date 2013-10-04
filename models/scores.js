var bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

/* The UsersDAO must be constructed with a connected database object */
function ScoresDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ScoresDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new ScoresDAO(db);
    }

    var mSchema = mongoose.Schema;
    var mModel =  mongoose.model;

    var ObjectId = function (stringId, callback) { 
      var objId = mongoose.Types.ObjectId();
      return objId;
    }

    var ScoresS = new mSchema({
        guid     :  { type:String}, 
        created  :  { type: Date, default: Date.now },
    },
        { strict: false });


    var scores = db.model("scopa.scores", ScoresS);

   this.getTodayGames = function(callback) {
        "use strict";
        var startDate = new Date();//.toISOString();
        startDate.setHours(0,0,0,0);

        var match = {created: {$gte: startDate}};

        var resObj = {}; 
        var that = this;
        scores.count(match,function(err, results){
            resObj.todayGames = results;
            return callback(err, resObj);
        });                
    } 

   this.getPastGames = function(query, callback) {
        "use strict";

        var numlastDays = 7;
        var numlastMonth = 30;

        var resObj = {}; 
        var that = this;
        that.getLastDaysGames(numlastDays,function(err, results){
            resObj.lastDaysGames = results;
            that.getAverageGames(numlastMonth,function(err, results){
                resObj.lastMonthGames = results;
                that.getAverageGames(null,function(err, results){
                    resObj.overallGames = results;
                    return callback(err, resObj);
                });                
            });
        });

    }
    this.getAverageGames = function(numDay, callback) {
        "use strict";
        var oneDay = 24*60*60*1000; 
        var numGG = numDay;
        var endDate = new Date();//.toISOString();
        var endMinute = (endDate.getHours()*60) + endDate.getMinutes();
        
        
        if (numDay) {
            var startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - numGG);
            startDate.setHours(0,0,0,0);
        } else {
          var startDate = new Date("2013-09-23"); 
          numGG = Math.round(Math.abs((endDate.getTime() - startDate.getTime())/(oneDay))); 
        }

        var match = {created: {$gt: startDate,$lt: endDate}};

        scores.aggregate(
            {$project:
                {gamesdet:1,
                 created:1,                 
                 instant: {$cond:[{$lte: [{ $add: [{ $multiply: [ { $hour: '$created' }, 60 ] }, { $minute: '$created' } ] }, endMinute]},1,0]}
                }
            },
            {$match: match  }, 
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

   this.getLastDaysGames = function(numDay, callback) {
        "use strict";

        var numGG = numDay;
        var endDate = new Date();//.toISOString();
        var startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - numGG);
        startDate.setHours(0,0,0,0);
        var match = {created: {$gt: startDate,$lt: endDate}};
        var endMinute = (endDate.getHours()*60) + endDate.getMinutes();

        scores.aggregate(
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
                console.log(JSON.stringify(results));
                return callback(null, results);
            }

            return callback(err, null);
        });
    }


}

module.exports.ScoresDAO = ScoresDAO;

