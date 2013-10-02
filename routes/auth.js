function AuthHandler (db) {
    "use strict";

    //var posts = new PostsDAO(db);

    this.ensureAuthenticated = function(req, res, next) {
        "use strict";
          if (req.isAuthenticated()) { return next(); }
          res.redirect('/login');
    } 

}

module.exports = AuthHandler;
