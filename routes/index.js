var //SessionHandler = require('./session')
  ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db, passport) {

  //  var sessionHandler = new SessionHandler(db);
    var contentHandler = new ContentHandler(db, passport);
    // Middleware to see if a user is logged in
  //  app.use(sessionHandler.isLoggedInMiddleware);


    app.get('/', contentHandler.displayMainPage);

    app.get('/login', contentHandler.displayLoginPage);

    app.get('/users', contentHandler.displayUsersPage);

    app.get('/getusers', contentHandler.getUsers);
    app.get('/getpastusers', contentHandler.getPastUsers);
    app.get('/getpastgames', contentHandler.getPastGames);
    app.get('/gettodayusers', contentHandler.getTodayUsers);
    app.get('/gettodaygames', contentHandler.getTodayGames);    

    app.get('/auth/facebook', function(req, res,next) {
        passport.authenticate('facebook')(req, res, next);
    });

    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { failureRedirect: '/login' }), 
        function(req, res) {
           res.redirect('/');
    });

    // Error handling middleware
    app.use(ErrorHandler);
}
