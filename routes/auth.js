function AuthHandler (db) {
    "use strict";

    //var posts = new PostsDAO(db);

    this.authUser = function(req, res, next) {
        "use strict";

        /*function(accessToken, refreshToken, profile, done) {
          console.log('ECCOCI2');
          AM.findOrCreateUser(profile._json, function(err, user) {
              if (errd) {
                return done(err, null); 
              } else {
                return done(null, user); 
              }
          });
        }*/

        return res.render('index', {
            title: 'Profilo',
            user : req.user
        });

    } 

}

module.exports = AuthHandler;
