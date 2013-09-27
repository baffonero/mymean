var LS = require('./leaderboards-settings'),
	DM = require('./db-manager'),
  DS = require('./db-settings'),
  AM = require('./account-manager'),
  UT = require('./utils'),
  logger = require('./log-manager'),
  _ = require('underscore')._,
  cronJob = require('cron').CronJob;


var LM = {};
module.exports = LM;

LM.dailyScoresStats = _.filter(LS.scoresStats, function(stat){ return stat.expire === "DAILY";});
LM.monthlyScoresStats = _.filter(LS.scoresStats, function(stat){ return stat.expire === "MONTHLY";});
LM.dailyScoresStats = _.map(LM.dailyScoresStats, function(stat){
    return (DS.appPrefix+stat.id);  
});
LM.monthlyScoresStats = _.map(LM.monthlyScoresStats, function(stat){
    return (DS.appPrefix+stat.id);  
});
LeaderboardTypes = {};

_.each(LS.LeaderboardTypes, function(ldbrdId, prop){
  LeaderboardTypes[prop] = DS.appPrefix+ldbrdId;
}); 

var ldbrds = _.values(LeaderboardTypes);
var ldbrdsProps = _.keys(LeaderboardTypes); 

var levelsAll = LS.Levels;
var levels = _.values(levelsAll);

var sumLevel = _.filter(levels, function(level){return level == 0; })[0]; 

var levelsProps = _.keys(levelsAll);

var allLdbrdsKeys = getLdbrdsKeys(ldbrds, levels);


function mapLdbrds (ldbrds, lev) {
  var tmpLdbrds = _.map(ldbrds, function(ldbrd){
                    return tmpString = ldbrd+lev;
                  });
  return tmpLdbrds;              
}

function getLdbrdsKeys (ldbs, levs) {
  var allLdbrds = [];
  _.each(levs, function(level){ 
    var tmpldbrdKeys = mapLdbrds(ldbs,level);
    allLdbrds = _.union(allLdbrds,tmpldbrdKeys);
  });    
  return allLdbrds;
}  

function getUserRank (userGuid, ldbrdId, callback) {
  if(!userGuid || !ldbrdId) return callback("input params missing.");
  var userRankObj = {};
  var offsetRankRes;

  var multi = DM.redisCli.multi();

  multi.zrevrank(ldbrdId, userGuid);
  multi.zscore(ldbrdId, userGuid);

  multi.exec(function (err, replies) {
    if (!err) {
      if (replies[0] || replies[0] === 0) {
        offsetRankRes = replies[0] + 1;
      }
      userRankObj = {rank:offsetRankRes, score: replies[1]};
      callback(err, userRankObj);
    } else {  
      callback(err, userRankObj);
    }              
  }); 
}

function getFriends (inParams, callback) { 

    if(!inParams) return callback("input params missing.");

    var ldbrdId = inParams.ldbrdId;

    if (typeof(inParams.fbids) =='object' && (inParams.fbids instanceof Array)) {
      var vFbids = inParams.fbids;
    } else {
      var vFbids = inParams.fbids.split(",");
    }

    var vFriends = [];

    AM.users.find({ fbid : { $in : vFbids } },{nick:1, guid:1, fbid:1},function(err, users ) {
      if (err) {
        callback(err, vFriends);
      } else {        
        var friendsCount = users.length;  
        if (friendsCount > 0 ) {
          users.forEach( function(user) {
            var friendObj = {};
            friendObj.nick =  user.nick;
            friendObj.fbid =  user.fbid;
            friendObj.guid =  user.guid;

            getUserRank(friendObj.guid, ldbrdId, function (err, userRank) { 
              if (err) {
                callback(err, vFriends);
              } else {
                if (userRank.rank) {
                  friendObj['rank'] = userRank['rank'];
                  friendObj['score'] = userRank['score'];
                  vFriends.push(friendObj);
                } 
                friendsCount -= 1;

                if (friendsCount === 0) {
                  vFriends = _.sortBy(vFriends, function(friend){ return friend.rank; });
                  callback(err,vFriends);
                }
              }                  
            });
          });
        } else {
          callback(err,vFriends);
        }  
      }    
    });
}  

function getInvites (fbid, callback) { 

    if(!fbid) return callback("input params missing.");

    DM.redisCli.smembers(fbid, function (err, friends) {

        var resArray = [];
        var errMsg; 

        if (err) {
          errMsg =  'Error getting ' + fbid + ' invites'; 
          callback(errMsg, resArray);
        } 
        else {
          var friendsSize = friends.length;

          if (friendsSize>0) {
            _.each(friends, function(friendFbid){
              //debugger;  
              var resObj = {};
              AM.getUser(friendFbid, 'fbid', {nick:1, guid:1, fbid:1}, function (doc) {
                if (doc) {
                  resObj.fbid = friendFbid;
                  resObj.nick = doc.nick;
                  resObj.guid = doc.guid;
                  resArray.push(resObj);
                }
                friendsSize -= 1;

                if (friendsSize === 0) {
                  callback(errMsg, resArray);  
                }
              });  
            });
          } else {
            callback(errMsg, resArray);  
          }
        }
    });         
}

function calcLeaders (params, callback) {
  var o = {};
  o.map = function () {
      if (this.won === 1) {
          emit({guid: this.guid, lev: this.lev}, (this.score - this.scoreopp));
        } 
    };
  o.reduce = function (key, values) {
      var result = 0;
        values.forEach(function(value) {
          result += value;
        });
        return result;
    }
  o.query = {won: 1, created: {"$gt": params.from, "$lt": params.to}};  
  o.out = { replace: DS.appPrefix+'calcMonthLeaders' };
  LM.scores.mapReduce(o, function (err, model) {
        callback(err, model);
  });
}

function saveMLeaders (params, callback) {
  var mLeader = {};
  var tmpLdbrd; 

  mLeader.year = params.year;

  mLeader.month = params.month;

  if (params.tmpMode === 1) {
    tmpLdbrd = LS.tmpLdbrdPrefix;
  }  
  else {  
    tmpLdbrd = "";  
  }      

  logger.info('Generating Hall of Fame for '+ mLeader.month + '/' + mLeader.year);

  var levelCount = levelsProps.length;

  _.each(levelsProps, function(levelProp){ 
    var lev = levelsAll[levelProp];
    var ldbrdId = tmpLdbrd+LeaderboardTypes.MONTHLY+lev;

    logger.info('Retrieving Leaderboard: '+ ldbrdId);

    LM.getLeaderboards (ldbrdId, 1, LS.leadersLength, function(err, leaders) {
      if (err) {
        logger.log('error', 'Error getting Leaderboards for Monthly Leaders :'+err);  
      }
      else {

	      mLeader[levelProp] = leaders;
	        
	        DM.redisCli.del(ldbrdId, function(err) {
	          if (err) {
	            return logger.log('error',"error removing month leaders from Redis:",err);
	          }

	          levelCount -= 1;

	          if (levelCount === 0) {
	            newLeader = new LM.monthleaders(mLeader);
	  
	            newLeader.save(function(err) {
	              callback(err);
	            });
	          } 
	        }); 
      }         
    }); 
  });           
}

LM.scoresStats = _.map(LS.scoresStats, function(stat){
    return (DS.appPrefix+stat.id);  
});

LM.getAllLeaders = function  (ldrs, callback) {
  if(!ldrs) return callback("input params missing.");
  var resObj = {};
  var errMsg;
  var ldbrdId = DS.appPrefix+ldrs.ldbrdId;
  getUserRank(ldrs.guid, ldbrdId, function (err, userRank) {  
	  resObj.ME = userRank;
	  getFriends({fbids:ldrs.friends, ldbrdId:ldbrdId}, function (err, friends) {
	      resObj.FRIENDS = friends;   

	      LM.getLeaderboards(ldbrdId, ldrs.lstart, ldrs.lstop, function (err, ranks) {
	          resObj.ALL = ranks;  
	          callback(err, resObj);
	      });
	  });    
  });  
}

LM.getLeaderboards = function  (ldbrdId, lstart, lstop, callback) {
  var start = lstart - 1;
  var stop  = lstop - 1;

  if(!ldbrdId || !lstart || !lstop) return callback("input params missing.");

  DM.redisCli.zrevrange(ldbrdId, start, stop, 'WITHSCORES', function (err, reply) {
      var normalizedRanks = [];

      if (err) {
        callback(err, normalizedRanks);
      }
      else {  
        
        var guidArray = [];
        redisResultArray = reply;

        var rankIndex = lstart;

        for (var i=0; i<redisResultArray.length; i+=2) {
            normalizedRanks.push({
                rank:rankIndex++,
                guid:redisResultArray[i],
                score:redisResultArray[i+1]
            });

            guidArray.push(redisResultArray[i]);
        }

        
        AM.users.find( { guid : { $in : guidArray } },{nick:1, guid:1, fbid:1, country:1} , function (err, docs) {

          if (!err) {

            _.each(normalizedRanks, function(vRank){   
              var matchedUser = _.find(docs, function(recUser){ return recUser.guid === vRank.guid; });
              if (matchedUser) {   
                vRank.nick = matchedUser.nick;
                vRank.fbid = matchedUser.fbid;
                vRank.country = matchedUser.country;
              }
              else
              {
                vRank.nick = "NULL";
                logger.info("Can't find user with guid "+vRank.guid);
              }  
            }); 
          }

          callback(err, normalizedRanks);
          
        });  
      }
  });
}

LM.dbCheck = function  (callback) {
  var currentDate = UT.getCurDate();
  var nextMonth = UT.getAddMMYY(currentDate,1);
  var prevMonth = UT.getAddMMYY(currentDate,-1);
  var prevMonthStart = prevMonth.monthStart;

  logger.info("today:" + currentDate.today.toString() + 
              " tomorrow:" + currentDate.tomorrow.toString() + 
              " monthstart:" + currentDate.monthStart.toString());

	DM.redisCli.get(DS.appPrefix+"totgames", function (err, redisCount) {
	  LM.scores.count(function (err, mongoCount){
	    LM.monthleaders.count({year:prevMonth.year, month:prevMonth.month},function (err, prevMonthCount){
	      logger.info('Mongo Total Scores:'+mongoCount+ ' Redis Total Scores:'+redisCount+' Previous Month HOF:'+prevMonthCount);
	      
	      if ((mongoCount != redisCount || prevMonthCount ===0) && mongoCount > 0) {
	        //Flush Redis DB
	        var vLdbrds = [];

	        vLdbrds = _.union(vLdbrds,ldbrds); 
	        
	        if (prevMonthCount === 0) {
	          vLdbrds.push(LS.tmpLdbrdPrefix+LeaderboardTypes.MONTHLY);  
	        }
	    
	        logger.info('Flushing Redis DB');
	        DM.redisCli.del(allLdbrdsKeys, function () {
	          logger.info('Redis DB Flushed');
	          logger.info('Getting users scores from Mongo...'); 

	          var countLdbrds = 0; 
	          var leadersArray = [];
	          _.each(vLdbrds,function(ldbrdId){      
	            var vParams;
              
	            if (ldbrdId===LeaderboardTypes.MONTHLY) {
	              vParams = {from:currentDate.monthStart, to:nextMonth.monthStart, hofOnly:0};
	            } else if (ldbrdId === LeaderboardTypes.DAILY){
	              vParams = {from:currentDate.today, to:currentDate.tomorrow, hofOnly:0};
	            } else if (ldbrdId === LS.tmpLdbrdPrefix+LeaderboardTypes.MONTHLY){
	              vParams = {from:prevMonthStart, to:currentDate.monthStart, hofOnly:1};
	            }

	            calcLeaders(vParams, function(err, model) {

	              model.find().exec(function (err, leaders) {                         

	                var tmpLeadersArray = _.map(leaders, function(leader){
	                  var lead = ["zincrby", ldbrdId+leader._id.lev, leader.value, leader._id.guid];
	                  return lead; 
	                });
	                leadersArray = _.union(leadersArray, tmpLeadersArray);
	                countLdbrds += 1;
	                if (vLdbrds.length === countLdbrds) {
	                  leadersArray.push(["set",DS.appPrefix+"totgames", mongoCount]);
	                  DM.redisCli.multi(leadersArray).exec(function (err, replies) {
	                    if (err) {
	                      callback('Error Updating Redis monthLeaders');
	                    } else {
	                      if (prevMonthCount === 0) {
	                        saveMLeaders ({year: prevMonth.year, month: prevMonth.month, tmpMode:1}, function(err) {
	                          if (err) {
	                            return logger.log('error',"error posting month leaders to Mongo:",err);
	                          }
	                          else {
	                                logger.info('Monthly Leaderboards for '+ prevMonth.year+'/'+ prevMonth.month +' saved!');  
	                          }  
	                        });                                       
	                      }  
	                      callback('DONE! Redis Leaderboards ready');
	                    }
	                  }); 
	                }
	              });
	            });
	          });    
	        });
	      }  
	      else
	      {
	        callback('Redis and Mongo already up-to-date');
	      }    
	    });
	  });
	});

}

LM.startSchedJobs = function () {

  resetDailyLeader : new cronJob({
    cronTime: '00 01 00 * * *',
    onTick: function() {
      // Ogni notte alle 00:01
      var tmpRedisStrings = _.map(levels, function(lev){
                    var redisString = LeaderboardTypes.DAILY + lev;
                    return redisString; 
                  });

      tmpRedisStrings = _.union(tmpRedisStrings,LM.dailyScoresStats);
      tmpRedisStrings = _.union(tmpRedisStrings,AM.dailyUsersStats); 

      DM.updStats(tmpRedisStrings, {mode:"del"});
             
    },
    onComplete: function () {
      logger.info('Daily Leaderboards Reset Stopped');
    }, 
    start: true,
    timezone: "Europe/Rome"
  });    

  resetMonthlyLeader : new cronJob({
    cronTime: '00 02 00 1 * *',
    onTick: function() {
      // Ogni primo del mese alle 00:02
      var currentDate = UT.getCurDate();
      var prevMonth = UT.getAddMMYY(currentDate,-1);

      saveMLeaders ({year: prevMonth.year, month: prevMonth.month}, function(err) {
        if (err) {
          return logger.log('error',"error posting month leaders to Mongo:",err);
        }
        else {
              var tmpRedisStrings = [];
              tmpRedisStrings = _.union(tmpRedisStrings,LM.monthlyScoresStats);
              tmpRedisStrings = _.union(tmpRedisStrings,AM.monthlyUsersStats);               
              DM.updStats(tmpRedisStrings, {mode:"del"});
        }  
      });           
    },
    onComplete: function () {
      logger.info('Monthly Leaderboards Reset Stopped');
    },  
    start: true,
    timezone: "Europe/Rome"
  });  
}

LM.postScore = function (data, callback) {
    
    if(!data) return callback("input params missing.");

    var errors = 0;
    var dataLen = data.length;

    _.each(data,function(item){ 

        if (isNaN(parseInt(item.score)) || (item.scoreopp && isNaN(parseInt(item.scoreopp)))) {
          callback("ERROR: Invalid Score! data.score "+item.score+" data.scoreopp "+item.scoreopp);  
        }  
        else
        {
          AM.isBanned(item.guid, function(isBanned) {  
            var scoreStr = {
              guid      : item.guid,
              lev       : item.lev,
              guidopp   : item.guidopp,
              platf     : item.platform,
              score     : item.score,
              scoreopp  : item.scoreopp,
              won       : item.won,
              created   : new Date()
            };

            var score;

            if (isBanned === true) {
              score = new LM.bannedscores(scoreStr);
            } else {
              score = new LM.scores(scoreStr);
            }

            score.save(function(err) {
              if (isBanned === false) {
                DM.updStats(LM.scoresStats, {mode:"incr"} );
                postCreateIncrLeader(score);
              }  
              dataLen -= 1;
              if (dataLen === 0) {
                callback(err);
              }
            });
          });
        } 
    });    
}

LM.getMonthLeaders = function (inParams, callback) { 
    var resObj = {};
    if(!inParams) return callback("input params missing.");
    var query = {};
    if (inParams.year) {
        query.year  = inParams.year;
        query.month = inParams.month;
    } else {
        var vOffset = (inParams.offset*(-1)) - 1;
        var currentDate = UT.getCurDate();
        var prevMonth = UT.getAddMMYY(currentDate,vOffset);
        query.year  = prevMonth.year;
        query.month = prevMonth.month;
    }
    LM.monthleaders.find(query,function(err, monthLeaders ) {
        var errMsg; 
        if (err) {
          errMsg = 'Error getting Leaderboard: ' + err;
        } 
        else {
          resObj = monthLeaders[0];
        }
        callback(errMsg, resObj);
    });         
}

LM.getUserData = function (userGuid, callback) {
  if(!userGuid) return callback("input params missing.");
  var errMsg;
  var userStatsObj = {};
  AM.users.find({guid:userGuid},function(err, resObj) {
    if (err) {
      callback(err, userStatsObj, '005');  
    } else {
      if (resObj.length > 0) { 
          var userObj = resObj[0].toObject();
          userStatsObj.guid     = userObj.guid;
          userStatsObj.fbid     = userObj.fbid;
          userStatsObj.country  = userObj.country;
          userStatsObj.totgames = userObj.games;


          var levelCount = levelsProps.length;

          _.each(levelsProps, function(levelProp){ 
            var lev = levelsAll[levelProp];
            var ldbrdId = LeaderboardTypes.MONTHLY+lev;                  
            getUserRank (userObj.guid, ldbrdId, function (err,rankObj) {
              if (err) {
                errMsg = err;
              }
              userStatsObj[levelProp] = rankObj;  
              levelCount -= 1;
              if (levelCount === 0) {
                getInvites(userStatsObj.fbid, function (err, invites) {
                  userStatsObj.invites = invites;                 
                  callback(err, userStatsObj);   
                });                           

              }      
            });
          });
      } else {
        callback(errMsg, userStatsObj, '002');  
      }
    }  
  });              
}


var ScoresS = new DM.Schema({
    guid     :  String,
    lev      :  Number, 
    guidopp  :  String, 
    platf    :  Number,
    score    :  Number,
    scoreopp :  Number,
    won      :  Number,
    created  :  { type: Date, default: Date.now }
});


LM.scores = DM.mongoCli.model(DS.appPrefix+"scores", ScoresS);
LM.bannedscores = DM.mongoCli.model(DS.appPrefix+"bannedscores", ScoresS);

var MonthLeadersS = new DM.Schema({ 
        year     :  Number,
        month    :  Number
    },
    { strict: false } );

LM.monthleaders = DM.mongoCli.model(DS.appPrefix+"monthleaders", MonthLeadersS);

function postCreateIncrLeader (score) {
//  schema.pre('save', function (next) {
    if (score.won ===1) { 
        var levs = [];
        levs.push(score.lev);
        if (sumLevel == 0) {
           levs.push(sumLevel);   
        }
        var ldbrdKeys = getLdbrdsKeys(ldbrds,levs);   

        var calcScore;
        calcScore = score.score - (score.scoreopp||0);     
        DM.updStats(ldbrdKeys, {mode:"zincrby",value:calcScore, member:score.guid});
    }
    var incrObj = {};
    incrObj.$inc = {};
    incrObj.$inc['games'] = 1;
    incrObj.$inc['gamesdet.'+DS.appName]  = 1;
    AM.users.update({guid:score.guid}, incrObj, function (err) {
      if (err) {
        logger.log("error",err);  
      }      
    });
//  })
}

