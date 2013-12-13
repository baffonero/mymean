var newdb = "scopa.digitalmoka.com/giochipiu";
var mydb = connect(newdb);
var tot = 0;

var curr = mydb.users.find({fbid:{$exists:true},"gamesdet.scopa":{$exists:true}});
var fbids=curr.map(function(obj){return obj.fbid});

mydb.old.users.update({fbid:{$in:fbids},$or:[{reg:false},{reg:{$exists:false}}]},{$set: {reg: true, regdate:new Date()}},{multi:true});

var updcount = mydb.getLastErrorObj();

if (updcount) {
tot = updcount.n||0;
};

print("TROVATI: ", tot);


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
