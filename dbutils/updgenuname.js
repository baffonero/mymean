db.users.find({username:{$exists:false}}).forEach( function (doc){
  doc.username = doc.nick.toLowerCase(); 
  db.users.save(doc); 
});
