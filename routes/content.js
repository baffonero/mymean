//var UsersDAO = require('../models/users').UsersDAO; // Helper to sanitize form input
//var ScoresDAO = require('../models/scores').ScoresDAO;
var ModelsDAO = require('../models/models').ModelsDAO; // Helper to sanitize form input


/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    //var users = new UsersDAO(db);
    //var scores = new ScoresDAO(db);
    var models = new ModelsDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";

        return res.render('index', {
            title: 'Profilo',
            user : req.user
        });

    }

    this.displayLoginPage = function(req, res, next) {
        "use strict";

        return res.render('login', {
            title: 'Login'
        });
    }   

    this.displayUsersPage = function(req, res, next) {
        "use strict";

        return res.render('users', {
            title: 'Users'
        });

    }

    this.getPastObj= function(req, res, next) {
        models.getPastObj(req.body.coll, req.body.query, function(err, obj) {
          //console.log("1", req.body.coll, obj);
          return res.json({ obj : obj });
        });

    }    

    this.getTodayObj= function(req, res, next) {

        models.getTodayObj(req.body.coll, req.body.query, function(err, obj) {
          //console.log("2", req.body.coll, obj);
          return res.json({ obj : obj });
        });

    }    
       

}

module.exports = ContentHandler;

