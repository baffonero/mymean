var newdb = "dmokamongo.cloudapp.net/giochipiu";
var mydb = connect(newdb);
var tot = 0;
var agg = 0;

function getLastGame(userObj, callback) {
	docs = mydb.scopa.scores.find({guid: userObj.guid }).sort({created:-1}).limit(1);
	if (docs[0]) {
		callback(docs[0].created);
    } else {    
	  	callback(null);
	}    
}

var curr = mydb.users.find({"gamesdet.scopa":{$exists:true}, "gamesdet.scopa.lg":{$exists:false}});

curr.forEach( function(user) {
    tot += 1;
    var usrObj = {guid:user.guid};  
    getLastGame(usrObj, function (lastGame)  {

		if (lastGame) {
		  user.gamesdet.scopa.lg = lastGame;
		  //print("user: ", JSON.stringify(user));
		  mydb.users.save(user);	
		  agg += 1;
		}
	});
});

print("TOTALI: ", tot);
print("AGGIORNATI: ", agg);

