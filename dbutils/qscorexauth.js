var newdb = "dmokamongo.cloudapp.net/giochipiu";
var collect = "users";
var collect2 = "scopa.scores";

var mydb = connect(newdb);
var intdate = {$gt:ISODate("2015-03-13"), $lt:ISODate("2015-04-13") };
var match = {created: intdate};
var mycoll1 = mydb.getCollection(collect);
var mycoll2 = mydb.getCollection(collect2);
var matchIos = {created: intdate, platf:1};
var matchFB = {created: intdate, platf:3};
var totGames = mycoll2.count(match);

var totFb = mycoll2.count(matchFB);

var matchIosDocs = mycoll2.find(matchIos,{guid:1});
//print(JSON.stringify(matchIosDocs[0]));
var guids = matchIosDocs.map(function(obj){return obj.guid});
var totIos = guids.length;
var IosUsers = mycoll1.find({guid:{$in:guids},authMode:"FB"},{guid:1});
var guidsFilt=IosUsers.map(function(obj){return obj.guid});
var totIosFbAuth = mycoll2.count({created: intdate, platf:1, guid:{$in:guidsFilt}});

print("totGames", totGames);
print("totFb", totFb);
print("totIos", totIos);
print("totIosFbAuth", totIosFbAuth);
