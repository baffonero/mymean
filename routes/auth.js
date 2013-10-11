function AuthHandler () {
    "use strict";

    this.ensureAuthenticated = function(req, res, next) {
        "use strict";
          console.log("user",req.user);
          if (req.user) { return next(); }
          res.redirect('/login');
    } 

}

module.exports = AuthHandler;