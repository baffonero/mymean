var AuthHandler = require('./auth')
  , ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db, passport) {

    var authHandler = new AuthHandler();
    var contentHandler = new ContentHandler(db);
    // Middleware to see if a user is logged in
    
    app.get('/', authHandler.ensureAuthenticated, contentHandler.displayUsersPage);

    app.get('/login', contentHandler.displayLoginPage);

    app.post('/getpastobj', contentHandler.getPastObj);
    app.post('/gettodayobj', contentHandler.getTodayObj);

//    app.get('/getpastobj', authHandler.ensureAuthenticated, contentHandler.getPastObj);
//    app.get('/gettodayobj', authHandler.ensureAuthenticated, contentHandler.getTodayObj);
    
    // Error handling middleware
    app.use(ErrorHandler);
}
