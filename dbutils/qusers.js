print("UPDATE MAILING LIST");
//var newdb = "scopa.digitalmoka.com/giochipiu";
var newdb = "www.scopapiu.it/giochipiu";
var collect = "users";
var startDate = ISODate("2013-07-01");
var endDate = ISODate("2013-11-23");
var mydb = connect(newdb);
var match = {created: {$gt: startDate,$lt: endDate}};
var mycoll = mydb.getCollection(collect);

var totdocs = mycoll.count();
print("totdocs: "+totdocs);
mycoll.aggregate( {$match: match  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}},  utenti: { $sum : 1 } } }, {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1} }).result.forEach(function(data) { print(data._id.giorno , "-", data._id.mese , "-", data._id.anno, ";", data.utenti); });

//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
