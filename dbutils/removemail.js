//mongoimport --db users --collection contacts --type csv --file /opt/backups/contacts.csv

curr = db.invmails.find();
emails=curr.map(function(obj){return obj.email});
db.old.users.update({email:{$in:emails}},{$set:{bounce:true}},{multi:true});
