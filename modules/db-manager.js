var DS = require('./db-settings'),
    config = require('./../config.js'),
    redis = require('redis'),
    mongoose = require('mongoose');


var mongoConnString = 'mongodb://'+config.mongoHost+'/'+DS.mongoDb;

var DB = {};

var options = {server: { autoReconnect: true, socketOptions:{ keepAlive: 1 }}};

  DB.mongo = mongoose.connection;  
  
  DB.mongo.on('connecting', function() {
    console.log('connecting to MongoDB...');
  });

  DB.mongo.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  DB.mongo.on('connected', function() {
    console.log('MongoDB connected!');
  });
  DB.mongo.once('open', function() {
    console.log('MongoDB connection opened!');
  });
  DB.mongo.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  DB.mongo.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(mongoConnString, options);
  });
  
  mongoose.connect(mongoConnString, options);



DB.redis = redis.createClient(6379,config.redisHost);

module.exports = DB;





