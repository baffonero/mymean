'use strict';

angular.module('monitorFilters', []).filter('banned', function() {
  return function(input) {
    return input ? 'Disabilitato' : 'Abilitato';
  };
});