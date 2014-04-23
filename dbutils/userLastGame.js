var newdb = "scopa.digitalmoka.com/giochipiu";
var mydb = connect(newdb);
var tot = 0;
var agg = 0;

function getLastGame(userObj, callback) {
	docs = mydb.scopa.scores.findOne({guid: userObj.guid });
	if (docs.created) {
		callback(docs.created);
    } else {    
	  	callback(null);
	}    
}

var curr = mydb.users.find({"gamesdet.scopa":{$exists:true}, "gamesdet.scopa.lg":{$exists:false}});

curr.forEach( function(user) {
    tot += 1;
	//print("NamePre:"+vName);
    var usrObj = {guid:user.guid};  
    getLastGame(usrObj, function (lastGame)  {
		print("Name:"+vName+" Nick:"+defNick);
		if (lastgame) {
		  user.gamesdet.scopa.lg = lastGame;
		  //mydb.users.save(user);	
		  agg += 1;
		}
	});
});

print("TOTALI: ", tot);
print("AGGIORNATI: ", agg);

