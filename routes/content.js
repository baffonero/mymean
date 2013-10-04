var UsersDAO = require('../models/users').UsersDAO; // Helper to sanitize form input
var ScoresDAO = require('../models/scores').ScoresDAO; // Helper to sanitize form input


/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var users = new UsersDAO(db);
    var scores = new ScoresDAO(db);

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

    this.getUsers= function(req, res, next) {
        "use strict";
        users.getUsers({}, function(err, users) {
          return res.json({ users : users });
        });

    }    

    this.getPastUsers= function(req, res, next) {
        "use strict";
        users.getPastUsers({}, function(err, users) {
          return res.json({ users : users });
        });

    }    

    this.getPastGames= function(req, res, next) {
        "use strict";
        scores.getPastGames({}, function(err, games) {
          return res.json({ games : games });
        });

    }  

    this.getTodayUsers= function(req, res, next) {
        "use strict";
        users.getTodayUsers(function(err, users) {
          return res.json({ users : users });
        });

    }    

    this.getTodayGames= function(req, res, next) {
        "use strict";
        scores.getTodayGames(function(err, games) {
          return res.json({ games : games });
        });

    }          

}

module.exports = ContentHandler;

