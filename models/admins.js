var bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

/* The UsersDAO must be constructed with a connected database object */
function AdminsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof AdminsDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new AdminsDAO(db);
    }

    // MODELS DEFINITION
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


    var admins = db.model("admins", AdminsS);

    this.findOrCreate = function(user, callback) {
        "use strict";

        admins.find({fbid: user.id},function (err, result) {
            "use strict";

            if (!err && result[0]) {
                console.log("found user");
                return callback(null, result[0]);
            }

            return callback(err, null);
        });
    }

}

module.exports.AdminsDAO = AdminsDAO;
