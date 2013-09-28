var DS = require('./db-settings'),
    config = require('./../config.js'),
    mongoose = require('mongoose');


var mongoConnString = 'mongodb://'+config.mongoHost+'/'+DS.mongoDb;

module.exports = mongoose.connect(mongoConnString);








