//launch with:
//mongo --quiet expUsers.js > userlist.csv

var db = connect("dmokamongo.cloudapp.net/giochipiu"); 
var vcondit = {"email":{$exists:true, $ne:""}, "fbid":{$exists:true, $ne:""}};
var vlimit = 1000000;
var vsort = {};

cursor = db.old.users.find(vcondit).sort(vsort).limit(vlimit);

cursor.forEach(
	function (u) {
	  	print(u.email);
  	}
);

