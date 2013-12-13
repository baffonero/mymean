//db.users.remove({"created": {$lt:ISODate("2013-04-13T00: 00: 00.000Z")}});

curr = db.old.friends.find();
fbids=curr.map(function(obj){return obj.fbid});
db.new.users.remove({fbid:{$in:fbids}});
