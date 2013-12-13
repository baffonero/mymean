print("COMPARAZIONE UTENTI");
var newdb = "scopa.digitalmoka.com/giochipiu";
var numGG = 180;
var collect = "users";
var oldcollect = "old.users"
var newStartDate = ISODate("2013-08-23");
var oldStartDate = ISODate("2012-10-08");
var newEndDate = new Date(newStartDate);
newEndDate.setDate(newEndDate.getDate() + numGG); 
var oldEndDate = new Date(oldStartDate);
oldEndDate.setDate(oldEndDate.getDate() + numGG); 
var header = "DataSDN, UtentiSDN, DataSP, UtentiSP";

var mydb = connect(newdb);
var newMatch = {created: {$gt: newStartDate,$lt: newEndDate}};
var oldMatch = {created: {$gt: oldStartDate,$lt: oldEndDate}};
var newColl = mydb.getCollection(collect);
var oldColl = mydb.getCollection(oldcollect);

//print("newMatch", JSON.stringify(newMatch));
//print("oldMatch", JSON.stringify(oldMatch));

var curNewUsers = newColl.aggregate( {$match: newMatch  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}},  utenti: { $sum : 1 } } }, {$sort: {"_id.anno":1,"_id.mese":1,"_id.giorno":1} }).result;
var curOldUsers = oldColl.aggregate( {$match: oldMatch  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}},  utenti: { $sum : 1 } } }, {$sort: {"_id.anno":1,"_id.mese":1,"_id.giorno":1} }).result;

print(header);

var numRighe = Math.max(curNewUsers.length,curOldUsers.length);

for (var i=0;i<numRighe;i++)
{ 
	newRec = "";
	if (curNewUsers[i]) {
	    newRec += curNewUsers[i]._id.giorno+"/"+curNewUsers[i]._id.mese+"/"+curNewUsers[i]._id.anno+","+curNewUsers[i].utenti+",";
	} else {
		newRec += ",,";
	}
	if (curOldUsers[i]) {
		if (newRec && newRec.length > 0) {
			newRec += curOldUsers[i]._id.giorno+"/"+curOldUsers[i]._id.mese+"/"+curOldUsers[i]._id.anno+","+curOldUsers[i].utenti;
		} else {
		  newRec += ",";  
		}	
	}
	print(newRec);
}
//curNewUsers.forEach(function(data) { print(data._id.giorno , ";", data._id.mese , ";", data._id.anno, ";", data.utenti); });

//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
