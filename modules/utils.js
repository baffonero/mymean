fs    = require('fs'),
time  = require('time'),
DS = require('./db-settings'),
DM = require('./db-manager'),
ASS = require('./asset-settings'),
logger = require('./log-manager'),
exec = require('child_process').exec,
url = require('url'),
_ = require('underscore')._;

var UT= {};
var FILE_ENCODING = 'utf-8';

module.exports = UT;

UT.appPrefix = DS.appPrefix;

UT.getCurDate =function  () {

  var curDate = {};
  var vtoday= new time.Date();
  vtoday.setTimezone("Europe/Rome");
  var tomorrow = new Date(vtoday);
  tomorrow.setDate(tomorrow.getDate()+1);

  curDate.month = vtoday.getMonth();
  curDate.year = vtoday.getFullYear();
  curDate.dayofmonth = vtoday.getDate();
  curDate.today = vtoday;
  curDate.tomorrow = tomorrow;
  curDate.monthStart = new time.Date(curDate.year, curDate.month, 1, "Europe/Rome");

  return curDate;
}

UT.getAddMMYY = function  (curMMYY, offset) {
  
  var vMMYY = {};

  _.extend(vMMYY, curMMYY);

  var moffset = Math.abs(offset)%12;
  var yoffset = Math.floor(Math.abs(offset)/12);
  if (offset < 0) {
    moffset = moffset*(-1);
    yoffset = yoffset*(-1);
  }  

  if ((vMMYY.month + moffset) < 0 || (vMMYY.month + moffset) > 11) {

    vMMYY.month = vMMYY.month + moffset;
    if (offset > 0) {
      vMMYY.month -= 12;
      yoffset += 1;
    } else {
      vMMYY.month += 12;
      yoffset -= 1;
    }
  } else {
    vMMYY.month += moffset;    
  }

  vMMYY.year += yoffset;

  vMMYY.monthStart = new time.Date(vMMYY.year, vMMYY.month, 1, "Europe/Rome");

  vMMYY.month += 1;

  return vMMYY;
}

UT.handleRedisHash = function (params, callback) { 

  if(!params) return callback("input params missing.");

  var resObj = {};
  var errMsg;

  if (params.action) {

    if (params.action === "add") {
      DM.redisCli.hset(params.hashname, params.objId, params.objString, function (err, reply) {
          if (err) {
            callback(err, reply,'008');               
          } else {
            callback(errMsg, reply);
          }    
      });                
    } else if (params.action === "remove") {
      DM.redisCli.hdel(params.hashname, params.objId, function (err, reply) {
          if (err) {
            callback(err, reply, '008');             
          } else {
            callback(errMsg, reply);
          }    
      });    
    } else if (params.action === "removeAll") {
      if (_.size(params.objIdColl) ||0 > 0) {
        var multi = DM.redisCli.multi();

        _.each(params.objIdColl, function(objId){   
          multi.hdel(params.hashname, objId);
        });
        multi.exec(function (err, replies) {
          if (err) {
            callback(err, reply,'008');            
          } else {
            callback(errMsg, replies);
          }
          callback(errMsg, replies);      
        });      
      } else {
        callback(errMsg);
      }           
    } else if (params.action === "get") {
      DM.redisCli.hget(params.hashname, params.objId, function (err, reply) {
          if (err) {
            callback(err, reply, '008');                
          } else {
            resObj[params.objId] = reply;
            allback(errMsg, reply); 
          }    
      });                
    } else if (params.action === "getall") {
      DM.redisCli.hgetall(params.hashname, function (err, reply) {
          if (err) { 
            callback(err, reply,'008');               
          } else {
            resObj[params.objId] = reply;
            callback(errMsg, reply);
          }    
      });                
    } else if (params.action === "count") {
      DM.redisCli.hlen(params.hashname, function (err, reply) {
          if (err) { 
            callback(err, reply,'008');           
          } else {
            resObj.count = reply;
            callback(errMsg, reply);
          }
      });                
    }
  } else {
    callback(errMsg, resObj,'007');
  }           
}

function concatFiles (options, callback) {
  var EOL = '\n';
  _.each(options, function(opts){   
    var fileList = opts.src;
    var path = opts.path;
    var distUrl = opts.dest;
    var distPath = opts.path+opts.dest;
    var destPh = opts.destPh;
    var out = fileList.map(function(filePath){
            return fs.readFileSync(path+filePath, FILE_ENCODING);
        });
    fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
    logger.info(' '+ distPath +' built.');
    uglifyFile(distPath, distPath, function () {
      logger.info(' '+ distPath +' uglified.');
      editHtml(distUrl, destPh, FILE_ENCODING, function () {
        logger.info(destPh + ' placeholder modified in index.html');
      });
    });
  });  

  callback();
}

function editHtml (distPath, destPh, FILE_ENCODING, callback) {

  var indexContent = fs.readFileSync('./client/game_prod.html',FILE_ENCODING);

  var indexContent = indexContent.replace(destPh,distPath);

  fs.writeFile('./client/game.html', indexContent, FILE_ENCODING, function (err) {
    if (err) throw err;
    callback();
  });
}

function uglifyFile (srcPath, distPath, callback) {

  var uglyfyJS = require('uglify-js'),
  jsp = uglyfyJS.parser,
  pro = uglyfyJS.uglify,
  ast = jsp.parse( fs.readFileSync(srcPath, FILE_ENCODING) );

  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);

  fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
  callback();
}

UT.saveClientFiles = function (version) {
  var opts = [];
  //var filesNum = ASS.clientFiles.length;
  _.each(ASS.clientFiles, function(clienFile){
    var optsObj = {};
    optsObj.path = 'client/';
    optsObj.dest = clienFile.destFile+'_'+version+'.js';  
    optsObj.src = [];
    optsObj.destPh = clienFile.destPh;
    optsObj.src = clienFile.filesList;
    //_.each(clienFile.gameFolders, function(gameFolder){
    //  var fileList = fs.readdirSync(optsObj.path+'/'+gameFolder);
    //  _.each(fileList, function(fileUrl){
    //    if (fileUrl.indexOf('.js') !== -1) {
    //      optsObj.src.push(gameFolder+'/'+fileUrl);
    //    }
    //  });  
    //}); 
    opts.push(optsObj);
  });   
  console.log(opts);
  concatFiles(opts, function () {
    logger.info("Client Files Generated");
  }); 
}

UT.getCurrentVersion = function (masterServer, callback) {
  var currentVersion;
  var child = exec('git describe --tags --abbrev=0', function (error, stdout, stderr) {
      stdout = stdout.replace(/\r?\n|\r/g, "");
      currentVersion = stdout;
      if (masterServer) {
        DM.redisCli.set(DS.appPrefix+"app.version",stdout, function (error) {
          callback(currentVersion,error);      
        });
      } else {
        DM.redisCli.get(DS.appPrefix+"app.version", function (err, masterVersion) {
          if (masterVersion === ""||masterVersion!=currentVersion) {
            callback(currentVersion,"This server is running version "+currentVersion+". Version on masterServer: "+masterVersion);  
          } else {
            callback(currentVersion);
          }
        });
      }

  });  
}

UT.setupRestart = function (restartTime) {
  var atCommand = "at -f ./app_restart.sh "+restartTime;
  var child = exec(atCommand, function (error, stdout, stderr) {
      
      logger.error("Server restart scheduled: "+restartTime);
  });  
}
