print("UPDATE MAILING LIST");
var newdb = "localhost/final7";
var collect = "albums";
var collect2 = "images"; 
var mydb = connect(newdb);

var mycoll = mydb.getCollection(collect);
var mycoll2 = mydb.getCollection(collect2);

var totdocs = mycoll.count();
print("totdocs: "+totdocs);
var imgres = mycoll.aggregate({$unwind: "$images"}, {
     $group : {_id: "TUTTE", images: { $addToSet: "$images" }
   } }
).result;

var imglist = imgres[0].images;


print("Tot "+collect2+": "+imglist.length);

var countbefore = mycoll2.count();
print(imglist[0],imglist[1],imglist[2]); 
var conta = mydb.images.count({"_id" : {$nin: imglist}});
print("Da Cancellare", conta);
mydb.images.remove({"_id" : {$nin: imglist}});
var countafter = mycoll2.count();

print("Prima - Tot "+collect2+": "+countbefore);
print("Dopo - Tot "+collect2+": "+countafter);
//mycoll.aggregate( {$match: match  }, { $group : { _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}},  utenti: { $sum : 1 } } }, {$sort: {"_id.anno":-1,"_id.mese":-1,"_id.giorno":-1} }).result.forEach(
//function(data) { print(data._id.giorno , "-", data._id.mese , "-", data._id.anno, ";", data.utenti); }
//);

//db.runCommand{ cloneCollection: "scopapiu.users", from: "scopatest.digitalmoka.com", copyIndexes: true }

//db.old.friends.find().forEach(function(d){ db.getSiblingDB('giochipiu')['old.friends'].insert(d); });

//mongo scopapiu --eval "db.dropDatabase()"
