var bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

/* The IndexDAO must be constructed with a connected database object */
function ModelsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ModelsDAO)) {
        console.log('Warning: IndexDAO constructor called without "new" operator');
        return new ModelsDAO(db);
    }

    var mSchema = mongoose.Schema;

    var CollS = new mSchema();

    

    function cmodel (coll) {
        var collModel = db.model(coll, CollS);
        return collModel;            
    }
    var off = new Date().getTimezoneOffset();
    off = Math.abs(off)*60*1000;
    
   this.getObjs = function(coll, query, callback) {
        "use strict";

        var match = query||{};
        var resObj = {}; 
        cmodel(coll).find(match,function(err, results){
            resObj = results;
            return callback(err, resObj);
        });                
    }   

   this.getTodayObj = function(coll, query, callback) {
        "use strict";
        var startDate = new Date();//.toISOString();
        startDate.setHours(0,0,0,0);

        var match = query||{};
        match.created = {$gte: startDate};
        //console.log("match",match);
        var resObj = {}; 
        var that = this;
        cmodel(coll).count(match,function(err, results){
            resObj.todayObj = results;
            return callback(err, resObj);
        });                
    }    
   this.getPastObj = function(coll, query, callback) {
        "use strict";

        var numlastDays = 7;
        var numlastMonth = 30;

        var resObj = {}; 

        var that = this;
        that.getLastDaysObj(coll, numlastDays,query, function(err, results){

            resObj.lastDaysObj = results||{};
            that.getAverageObj(coll, numlastMonth,query, function(err, results){
                if (err) {
                    return callback(err, null);
                }
                resObj.lastMonthObj = results||{};
                that.getAverageObj(coll, null,query, function(err, results){
                    if (err) {
                        return callback(err, null);
                    }                    
                    resObj.overallObj = results||{};
                    return callback(err, resObj);
                });                
            });
        });

    }

   this.getAverageObj = function(coll, numDay, query, callback) {
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
          var startDate = new Date("2013-08-23"); 
          startDate.setHours(0,0,0,0);
          numGG = Math.round(Math.abs((endDate.getTime() - startDate.getTime())/(oneDay))); 
        }

        var match = query||{};
        match.created = {$gt: startDate,$lt: endDate};

        cmodel(coll).aggregate(
            {$match: match  },
        {$project:
        {created:{$add:["$created",off]}}}, 
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
                if (results[0]) {
                    results[0].tot = Math.round(results[0].tot/numGG);
                    results[0].instant = Math.round(results[0].instant/numGG);
                    return callback(null, results);
                } else {
                    return callback(null, null);
                }
                
            } else {return callback(null, null);}
        });

    }

   this.getLastDaysObj = function(coll, numDay, query, callback) {
        "use strict";

        var numGG = numDay;
        var endDate = new Date();//.toISOString();
        var startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - numGG);
        startDate.setHours(0,0,0,0);

        var match = query||{};
        match.created = {$gt: startDate,$lt: endDate};

        var endMinute = (endDate.getHours()*60) + endDate.getMinutes();
        endDate.setHours(0,0,0,0);
        //console.log("endMinute", endMinute);


        //console.log("match", match);

        cmodel(coll).aggregate(
            {$match: match  },
            {$project:
        {created:{$add:["$created",off]}}},  
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

module.exports.ModelsDAO = ModelsDAO;

