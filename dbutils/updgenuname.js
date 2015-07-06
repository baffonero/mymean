db.users.find({"gamesdet.briscola.avatar": {$exists:true}, "avatar": {$exists:false}}).forEach( function (doc){
  doc.avatar = doc.gamesdet.briscola.avatar; 
  db.users.save(doc); 
});
