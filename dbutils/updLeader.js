var curLevels = db.levels.find({active:1});

var vToprankCache = db.params.findOne({param_cod:"TOPRANK_CACHE"}).param_value; 
print("vToprankCache "+vToprankCache);
db.leaderboards.remove({});
db.leaderboardsAll.remove({});

curLevels.forEach( function(recLevel) {
  print("recLevel.id "+ recLevel.id);
  var curPeriods = db.periods.find();	
  curPeriods.forEach( function(recPeriod) {
  print("recPeriod.period_id "+ recPeriod.period_id);	
	  //populate leaderboards
	  var counter = 0;
	  db.getCollection(recPeriod.collection).find({level_id: recLevel.id}).sort({score:-1,won:-1,user_id:1}).forEach( function(recScoresD) {
	     counter = counter + 1;
	     //print("recScoresD.user_id "+recScoresD.user_id);
	     var userDoc = db.users.findOne({user_id:recScoresD.user_id});
	     var vGuid,vFbid,vNome;
	     if (userDoc) {
	     	vGuid = userDoc.guid;
	     	vFbid = userDoc.fbid;
	     	vNome = userDoc.nome;	
	     } else {
	     	vGuid = "";
	     	vFbid = "";
	     	vNome = "";		
	     };
	     //print("userDoc "+userDoc); 
	     //print("userDoc.guid "+userDoc.guid);
	     var leaderDoc = {rank: counter, level_id:recLevel.id, period_id:recPeriod.period_id, user_guid:vGuid, user_id:recScoresD.user_id, fbid:vFbid, name:vNome, scoresum:recScoresD.score, wonmatches:recScoresD.won, nummatches:0, created:'', modified: ''};
	  	 db.leaderboardsAll.insert (leaderDoc);
	     if (counter < vToprankCache ) {
	     	db.leaderboards.insert (leaderDoc);
	     }
	  });
  });  
});



