var newdb = "scopa.digitalmoka.com/giochipiu";
var collect = "users";

var mydb = connect(newdb);
var match = {"gamesdet.scopa.games":{$gt:0}, "gamesdet.scopa.deck":{$exists:true}};
var mycoll = mydb.getCollection(collect);
var header = "Data, Totali";
print(header);
mycoll.aggregate(
	{$match: match }, 
	{ $group : 
		{ _id : "$gamesdet.scopa.deck",
		  values:{$sum:1},
	    } 
	}, 
	{
		$project: {values:1, text:"$_id", _id: 0}
	},
	{$sort: {"values":-1} }).result.forEach(function(data) { print(JSON.stringify(data))});
//.result.forEach(function(data) { 
//		print(data._id.mazzo , ";", data.tot); 
//	});


//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
