var newdb = "scopa.digitalmoka.com/giochipiu";
var numGG = 14;
var collect = "users";
var newEndDate = ISODate();
var newStartDate = new Date(newEndDate);
newStartDate.setDate(newStartDate.getDate() - numGG);

var newEndMinute = (newStartDate.getHours()*60) + newStartDate.getMinutes();

var header = "Data, Utenti";

var mydb = connect(newdb);
var newMatch = {created: {$gte: newStartDate,$lte: newEndDate} };
var newColl = mydb.getCollection(collect);

//print("newMatch", JSON.stringify(newMatch));
print( "Nuovi Utenti dell'ultima settimana alle: ", newStartDate.toTimeString());

print(header);

var pipeline = [
{$match: newMatch},
{$project:{created:1, minutes: { $add: [{ $multiply: [ { $hour: '$created' }, 60 ] }, { $minute: '$created' } ] } }},
{$match:{'minutes' : {$lte : newEndMinute } } },
{$group:{ _id : {giorno: {$dayOfMonth:"$created"}, mese: {$month:"$created"}, anno: {$year:"$created"}},  utenti: { $sum : 1 } } },
{$sort: {"_id.anno":1,"_id.mese":1,"_id.giorno":1} }
];

newColl.aggregate(pipeline).result.forEach(function(data) { print(data._id.giorno , "-", data._id.mese , "-", data._id.anno, ";", data.utenti); });




