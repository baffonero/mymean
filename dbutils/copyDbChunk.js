db.runCommand({ cloneCollection: "giochipiu.users", from: "localhost:27000"})

db.runCommand({ cloneCollection: "giochipiu.scopa.scores", {query:{created:{$gt:ISODate("2013-09-25")}}}, from: "localhost:27000"})