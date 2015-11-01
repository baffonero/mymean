var newdb = "dmokamongo.cloudapp.net/giochipiu";
var collect = "users";
var collect2 = "scopa.badges";

var mydb = connect(newdb);
var match = {gamesdet: {$exists: true}};
var mycoll = mydb.getCollection(collect);
var mycoll2 = mydb.getCollection(collect2);
var header = "Badge, Totali";
print(header);
var calcBadges = mycoll.aggregate({$match: match },{$unwind:"$gamesdet.scopa.badge"},{ $group : { _id : {code: "$gamesdet.scopa.badge"}, tot:{$sum:1} } }).result;
calcBadges.forEach(function(data) {
	//print("*"+data._id.code+"*",",", data.tot); 
	mycoll2.find({"code":data._id.code}).forEach(function(badge) {
		print(data._id.code,",", badge.name,",", badge.meaning,",", data.tot); 
	});
});
