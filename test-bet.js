//test-bet

var betfair = require('betfair');
var async = require('async');

var bflogin = 'baffonero';
var bfpassword = 'FabDel0!';

var betfair = require('betfair');
var session = betfair.newSession('EugQc20Rk1RTWsrJ');


function login(callback) {
    console.log('login to Betfair');
    
	session.login(bflogin,bfpassword, function(err) {
	    console.log(err ? "Login failed: "+err : "Login OK");
	});
}


function listEventTypes(data, cb) {
    if (!cb)
        cb = data;
    console.log("ECCOCI");
    session.listEventTypes({}, function (err, res) {
    	console.log("ERRORE",err);
        console.log("listEventTypes err=%s duration=%s", err, res.duration / 1000);
        console.log("Request:%s\n", JSON.stringify(res.request, null, 2))
        console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err, res);
    });
}


function logout(callback) {
    console.log('logout');
	session.logout(function(err) {
	    console.log(err ? "Logout OK" : "Logout failed");
	});
}


async.series([login, logout], function (err, res) {
    console.log("Done, err =", err);
    process.exit(0);
});