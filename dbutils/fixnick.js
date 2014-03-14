var newdb = "scopa.digitalmoka.com/giochipiu";
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
       if (arra[i].nick === obj) {return true};
	   i += 1;
     }
	 return false;
}
function assignNick(userObj, callback) {

  //name, guid, nick
  if (userObj.nick) {
    callback(userObj.nick); 
  } else if (userObj.name) {
    var nick;
    var nameArray = userObj.name.split(/[\.\s]/);
    tmpNick = nameArray[0];  
    if (nameArray[1]) {
      tmpNick += " "+nameArray[1].substring(0, 1)+'.'; 
    }
    docs = mydb.users.find({nick: new RegExp("^"+tmpNick)},{nick:1});
	  if (docs[0]) {
		var suffix = 0;
		do
		  {
			suffix += 1;
			var candNick = tmpNick+suffix.toString();
			var checkNick = esiste(docs,candNick);
			//print(candNick+" "+checkNick);
		  }
		while (checkNick);  
		nick = candNick;              
	  } else {
		nick = tmpNick;  
	  }         
	  callback(nick);  
      
  } else {
    callback(userObj.guid);
  }
}


var curr = mydb.users.find({nick: { $regex: '[A-Z0-9]{2,}[.][A-Z0-9]{2,}', $options: 'i' },authMode: "FB",$where: "this.nick===this.name" });

curr.forEach( function(user) {
    tot += 1;
	var vName = user.name.replace("."," ").capitalize();
	//print("NamePre:"+vName);
    var nickObj = {name:vName};  
    assignNick(nickObj,function (defNick, nickInUse)  {
		print("Name:"+vName+" Nick:"+defNick);
		mydb.users.update({_id: user._id},{$set:{nick:defNick}});
		var updcount = mydb.getLastErrorObj();

		if (updcount) {
			agg += updcount.n||0;
		};
	});
});

print("TOTALI: ", tot);
print("AGGIORNATI: ", agg);


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
