var newdb = "scopa.digitalmoka.com/giochipiu";
//var newdb = "www.scopapiu.it/giochipiu";
var collect = "scopa.scores";

var numGG = 120;
var endDate = ISODate();
var startDate = new Date(endDate);
startDate.setDate(startDate.getDate() - numGG);

var mydb = connect(newdb);
var match = {created: {$gt: startDate,$lt: endDate}};
var mycoll = mydb.getCollection(collect);
var header = "Data, Totali, Multiplayer, Platform";
print(header);
mycoll.aggregate({$project:{created:1,platf:1, multiplayer:{$cond:[{$eq:["$guidopp",null]},0,1]}}}, {$match: match  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"},platf:"$platf"}, tot:{$sum:1}, multi: { $sum : "$multiplayer" } } }, {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1} }).result.forEach(function(data) { print(data._id.giorno , "-", data._id.mese , "-", data._id.anno, ";",data._id.platf,";", data.tot, ";", data.multi); });


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
