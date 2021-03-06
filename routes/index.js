var AuthHandler = require('./auth')
  , ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db, passport) {

    var authHandler = new AuthHandler();
    var contentHandler = new ContentHandler(db);
    // Middleware to see if a user is logged in
    
    app.get('/', authHandler.ensureAuthenticated, contentHandler.displayMainPage);

    app.get('/login', contentHandler.displayLoginPage);

    app.get('/sort-by', authHandler.ensureAuthenticated, contentHandler.displaySortBy);

    app.get('/usermod', authHandler.ensureAuthenticated, contentHandler.displayUserMod);    

    app.post('/getpastobj', authHandler.ensureAuthenticated, contentHandler.getPastObj);

    app.post('/getpaststats', authHandler.ensureAuthenticated, contentHandler.getPastStats);

    app.post('/gettodayobj', authHandler.ensureAuthenticated, contentHandler.getTodayObj);

    app.post('/getobjs', authHandler.ensureAuthenticated, contentHandler.getObjs);

    app.post('/updobj', authHandler.ensureAuthenticated, contentHandler.updObj);

    app.io.route('getstats', contentHandler.getStats);

//    app.io.route('getstats', function(data,fn) {
//    if(statsTimer) {
//        clearInterval(statsTimer);
//    }

    // Error handling middleware
    app.use(ErrorHandler);
}
