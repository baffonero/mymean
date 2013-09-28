function AuthHandler (passport) {
    "use strict";

    //var posts = new PostsDAO(db);

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

}

module.exports = ContentHandler;
