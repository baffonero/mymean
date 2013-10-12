var DS = require('./db-settings'),
    config = require('./../config.js'),
    redis = require('redis'),
    mongoose = require('mongoose');


var mongoConnString = 'mongodb://'+config.mongoHost+'/'+DS.mongoDb;

var DB = {};

DB.mongo = mongoose.connect(mongoConnString);
DB.redis = redis.createClient(6379,config.redisHost);

module.exports = DB;





