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

    this.getLastWeekGames = function(query, callback) {
        "use strict";

        var numGG = 14;
        var endDate = new Date();//.toISOString();
        var startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - numGG);
        var match = {created: {$gt: startDate,$lt: endDate}};

        console.log("match", match);

        scores.aggregate({$match: match  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}}, tot:{$sum:1}, multi: { $sum : "$multiplayer" } } }, {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1} },
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

