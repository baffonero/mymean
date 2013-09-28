var express = require('express')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , http = require('http')
  , db = require('./modules/db-manager')
  , routes = require('./routes')
  , passport = require('passport');

var app = express();

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  passport.use(new FacebookStrategy({
      clientID: '197775320242143',
      clientSecret: 'dcb00458932d915acd34ca5a23f843ed',
      callbackURL: "http://www.malatodiroma.com:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        
        // To keep the example simple, the user's Facebook profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Facebook account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }    
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
  ));

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Application routes
routes(app, db, passport);



// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
