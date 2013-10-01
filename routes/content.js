var UsersDAO = require('../models/users').UsersDAO; // Helper to sanitize form input


/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var users = new UsersDAO(db);

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

}

module.exports = ContentHandler;

