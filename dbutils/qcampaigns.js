print("UPDATE MAILING LIST");
var newdb = "scopa.digitalmoka.com/giochipiu";
var collect = "old.users";
var mydb = connect(newdb);
//var match = {mailing:{$exists:true},reg:true};
var match = {reg:true};
var mycoll = mydb.getCollection(collect);
print("Query:", JSON.stringify(match));
var totdocs = mycoll.count(match);
print("totdocs: "+totdocs);
mycoll.aggregate( {$match: match  }, { $group : { _id : {giorno: {$dayOfMonth:"$regdate"}, mese: {$month:"$regdate"}, anno: {$year:"$regdate"},campagna:"$mailing.des"},  utenti: { $sum : 1 } } }, {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1, "_id.campagna":1} }).result.forEach(function(data) { print(data._id.giorno , ";", data._id.mese , ";", data._id.anno, ";", data._id.campagna, ";", data.utenti); });

//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
