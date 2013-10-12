//var UsersDAO = require('../models/users').UsersDAO; // Helper to sanitize form input
//var ScoresDAO = require('../models/scores').ScoresDAO;
var ModelsDAO = require('../models/models').ModelsDAO; // Helper to sanitize form input


/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    //var users = new UsersDAO(db);
    //var scores = new ScoresDAO(db);
    var models = new ModelsDAO(db.mongo);

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

    this.getPastObj= function(req, res, next) {
        models.getPastObj(req.body.coll, req.body.query, function(err, obj) {
          //console.log("1", req.body.coll, obj);
          return res.json({ obj : obj });
        });

    }    

    this.getTodayObj= function(req, res, next) {

        models.getTodayObj(req.body.coll, req.body.query, function(err, obj) {
          //console.log("2", req.body.coll, obj);
          return res.json({ obj : obj });
        });

    }  

    this.getStats = function(req, res, next) {

        updateStats(function(lastStats, serverStats) {
            var time = (new Date()).getTime();
            var startTime = lastStats.lastStartTime;      
            var statObj = {
                time: time,
                uptime: time - startTime,
                stats: lastStats,
                server: serverStats
            };      

            req.io.emit('stats', {
                stats: statObj
            })
        });


        function updateStats(callback){
          var lastStats = {};
          var serverStats = {};
          db.redis.multi()
            .get("stats.last-start-time")
            .get("counters.boards")
            .get("counters.playersPlaying")
            .get("counters.randomPlayers")
            .get("counters.singlePlayers")
            .get("counters.onlinePlayersQ")
            .get("counters.usersOnline")
            .get("counters.restarts")
            .get("scopa.totusers")
            .get("scopa.totgames")
            .get("scopa.monthusers")
            .get("scopa.monthgames")
            .get("scopa.dayusers")
            .get("scopa.daygames")
            .get("scopa.app.version")
            .get("server.uptime")
            .get("server.loadavg")
            .get("server.totalmem")
            .get("server.freemem")
            .get("server.cpus")
            .exec(function(err,res){
              lastStats.lastStartTime = res[0];
              lastStats.boards = res[1];
              lastStats.playersPlaying = res[2];
              lastStats.randomPlayers = res[3];
              lastStats.singlePlayers = res[4];
              lastStats.onlinePlayersQ = res[5];
              lastStats.usersOnline = res[6];
              lastStats.restarts = res[7];
              lastStats.totusers = res[8];
              lastStats.totgames = res[9];
              lastStats.monthusers = res[10];
              lastStats.monthgames = res[11];
              lastStats.dayusers = res[12];
              lastStats.daygames = res[13];
              lastStats.appversion = res[14];
              serverStats.uptime = res[15];
              serverStats.loadavg = res[16];
              serverStats.totalmem = res[17];
              serverStats.freemem = res[18];
              serverStats.cpus = res[19];
              if(callback){
                callback(lastStats, serverStats);
              }
            });
        }
      
    }  
       

}

module.exports = ContentHandler;

