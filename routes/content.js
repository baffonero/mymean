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
        models.getObjs("games", {}, function(err, obj) {
          return res.render('index', {
              title: 'Monitor',
              games : obj
          });          
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
          if (err) {
            return {};
          }
          return res.json({ obj : obj });
        });

    }    

    this.getTodayObj= function(req, res, next) {

        models.getTodayObj(req.body.coll, req.body.query, function(err, obj) {
          if (err) {
            return {};
          }          
          return res.json({ obj : obj });
        });

    }  

    this.getObjs= function(req, res, next) {

        models.getObjs(req.body.coll, req.body.query, function(err, obj) {
          return res.json({ obj : obj });
        });

    }     

    this.getStats = function(req, res, next) {
        var game = req.data.game;

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
            .get(game+".totusers")
            .get(game+".totgames")
            .get(game+".totchatmsgs")
            .get(game+".monthusers")
            .get(game+".monthgames")
            .get(game+".monthchatmsgs")
            .get(game+".dayusers")
            .get(game+".daygames")
            .get(game+".daychatmsgs")
            .get(game+".app.version")
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
              lastStats.totchatmsgs = res[10];
              lastStats.monthusers = res[11];
              lastStats.monthgames = res[12];
              lastStats.monthchatmsgs = res[13];
              lastStats.dayusers = res[14];
              lastStats.daygames = res[15];
              lastStats.daychatmsgs = res[16];
              lastStats.appversion = res[17];
              serverStats.uptime = res[18];
              serverStats.loadavg = res[19];
              serverStats.totalmem = res[20];
              serverStats.freemem = res[21];
              serverStats.cpus = res[22];
              if(callback){
                callback(lastStats, serverStats);
              }
            });
        }
      
    }  
       

}

module.exports = ContentHandler;

