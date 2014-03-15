//db.users.find({un:{$exists:false}}).forEach(function(doc) {
//  doc.un = doc.nick.toLowerCase();
//  db.users.save(doc);
//});


var newdb = "scopa.digitalmoka.com/giochipiu";
//var newdb = "scopalocal.digitalmoka.com/giochipiu";
var mydb = connect(newdb);
var tot = 0;
var agg = 0;

	String.prototype.capitalize = function() {
		return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};

function esiste(arra, obj) {
    //print("eccolo"+obj+arra);
	//print("primo:"+arra[0].nick);
	var i=0;
	while (arra[i])
	 {
	   //print ("utente "+arra[i].nick+" "+obj);
       if (arra[i].un === obj) {return true};
	   i += 1;
     }
	 return false;
}
function assignNick(userObj, callback) {

  //name, guid, nick
  if (userObj.nick) {
    tmpNick = userObj.nick; 
  } else if (userObj.name) {
    var nick;
    var nameArray = userObj.name.split(/[\.\s]/);
    tmpNick = nameArray[0];  
    if (nameArray[1]) {
      tmpNick += " "+nameArray[1].substring(0, 1)+'.'; 
    }
  }
    docs = mydb.users.find({un: new RegExp("^"+tmpNick.toLowerCase())},{nick:1, un: 1});
	  if (docs[0]) {
		var suffix = 0;
		do
		  {
			suffix += 1;
			var candNick = tmpNick+suffix.toString();
			var checkNick = esiste(docs,candNick.toLowerCase());
			//print(candNick+" "+checkNick);
		  }
		while (checkNick);  
		nick = candNick;              
	  } else {
		nick = tmpNick;  
	  }         
	  callback(nick);  
      

}


//var curr = mydb.users.find({nick: { $regex: '[A-Z0-9]{2,}[.][A-Z0-9]{2,}', $options: 'i' },authMode: "FB",$where: "this.nick===this.name" });

var curr = mydb.users.aggregate( 
 {$project: {username:{$toLower:"$nick"}}},
 {$group : { _id : "$username", doppioni:{$sum:1}}},
 {$match : {"doppioni":{$gt:1}} },
 {$sort : {"doppioni":-1} }
).result;

curr.forEach( function(doppio) {
    var vregex = "^"+doppio._id+"$";
	tot += 1;
	var vdoppi = 0;
	mydb.users.find({nick: {$regex: vregex,$options:'i'}}).sort({authMode:-1, _id: 1}).forEach(function(user) {
	    vdoppi += 1;
        if (vdoppi > 1) {		
			var nickObj = {nick:user.nick};  
			assignNick(nickObj,function (defNick, nickInUse)  {
				print("OldNick:"+user.nick+" Nick:"+defNick+" Auth "+user.authMode);
				mydb.users.update({_id: user._id},{$set:{nick:defNick, un:defNick.toLowerCase()}});
				var updcount = mydb.getLastErrorObj();

				if (updcount) {
					agg += updcount.n||0;
				};
			});
		}
	});
});

print("TOTALI: ", tot);
print("AGGIORNATI: ", agg);


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
