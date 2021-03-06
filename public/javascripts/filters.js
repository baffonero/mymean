'use strict';

var filters = angular.module('monitorFilters', []);

filters.filter('banned', function() {
	  return function(input) {
	    return input ? 'Disab.' : 'Abil.';
	  };
	});

filters.filter('datetime', function() {
	  return function(input) {
	  	var d = new Date(input);
	  	var day = d.getDate();
	  	var month = d.getMonth()+1;
	  	var year = d.getFullYear();
	  	var hours = d.getHours();
	  	var minutes = d.getMinutes();
	    return day+"/"+month+"/"+year+" "+hours+":"+minutes;
	  };
	});

filters.filter('onlydate', function() {
	  return function(input) {
	  	var d = new Date(input);
	  	var day = d.getDate();
	  	var month = d.getMonth()+1;
	  	var year = d.getFullYear();
	    return day+"/"+month+"/"+year;
	  };
	});

filters.filter('arraylength', function() {
	  return function(input) {
	    return input ?input.length:0;
	  };
	});


