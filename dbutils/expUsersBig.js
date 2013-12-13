//launch with:
//mongo --quiet expUsers.js > userlist.csv

//db.old.users.update({mailing:{$exists:true}},{$unset:{mailing:true}},{multi:true})

var desInvio = "Invio 38";

var db = connect("scopa.digitalmoka.com/giochipiu"); 
var vcondit = {"created": {$lt:ISODate("2013-05-01T00: 00: 00.000Z")},$or:[{reg:false},{reg:{$exists:false}}],email:{$exists:true},$or:[{bounce:false},{bounce:{$exists:false}}]};
var vlimit = 1000000;
var vsort = {_id:-1};

cursor = db.old.users.find(vcondit).sort(vsort).limit(vlimit);
print("EMAIL");
cursor.forEach(
	function (u) {
	  	print(u.email);
  	}
);
