var newdb = "dmokamongo.cloudapp.net/giochipiu";

var collect = "users";

var mydb = connect(newdb);
var mycoll = mydb.getCollection(collect);
var header = "Email, Doppioni";
var match = {};
print(header);

//mycoll.aggregate({$project: {email:{$toLower:"$email"}}},{$group : { _id : "$email", doppioni:{$sum:1}}},{$match : {"doppioni":{$gt:1}} },{$sort : {"doppioni":-1} }).result.forEach(function(data) {print(data._id,",",data.doppioni)});

mycoll.aggregate({$project: {email:{$toLower:"$email"}}},{$group : { _id : "$email", doppioni:{$sum:1}}},{$match : {"doppioni":{$gt:1}} },{$sort : {"doppioni":-1} });


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
