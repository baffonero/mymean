print("UPDATE MAILING LIST");
var newdb = "scopa.digitalmoka.com/giochipiu";
var sourceColl = "new.users";
var destColl = "old.users";
var mydb = connect(newdb);
var tot = 0;
print("Updating Users game data");
mydb.getCollection(sourceColl).find().forEach(
  	function (old_u) {
  		tot += 1;
  		//print(JSON.stringify(old_u));	
	  	mydb.getCollection(destColl).insert(old_u);
	  	if (tot%1000 === 0) {
  			print("Elaborati "+tot);	
  		}
  	}
);
print("Elaborati: "+tot);
print("COMPLETE");

//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
