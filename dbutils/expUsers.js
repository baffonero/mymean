//launch with:
//mongo --quiet expUsers.js > userlist.csv

//db.old.users.update({mailing:{$exists:true}},{$unset:{mailing:true}},{multi:true})

var desInvio = "Invio 40";

var db = connect("scopa.digitalmoka.com/giochipiu"); 
var campId = ObjectId("5220ad00a4a42ba456795a23");
var vcondit = {"created": {$lt:ISODate("2013-05-01T00: 00: 00.000Z")},$or:[{reg:false},{reg:{$exists:false}}],"mailing.0":{$exists:false},email:{$exists:true},$or:[{bounce:false},{bounce:{$exists:false}}]};
var vlimit = 2450;
var vsort = {_id:-1};

var cursCamp = db.campaigns.findOne({_id:campId});
if (cursCamp) {

var newId = ObjectId();
newMailing = {_id:newId, created: new Date(), des: desInvio};
db.campaigns.update({_id:cursCamp._id},{$addToSet:{mailing:newMailing}});
cursor = db.old.users.find(vcondit).sort(vsort).limit(vlimit);

cursor.forEach(
	function (u) {
		var nameArray = u.name.split(" ");
        var vnome = nameArray[0]||"";
        var vcognome = u.name.replace(vnome+" ","");
	  	print(u.email+","+vnome+","+vcognome);
      if (u.mailing) {
         u.mailing.push(newMailing);
      } else {
         u.mailing = [newMailing];
			}
      db.old.users.save(u);
  	}
);
}
