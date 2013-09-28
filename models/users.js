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

        var q = users.find(query).limit(50);

        q.exec(function(err, results) {
            "use strict";

            if (!err) {
                console.log("Retrieved users");
                return callback(null, results);
            }

            return callback(err, null);
        });
    }


}

module.exports.UsersDAO = UsersDAO;

