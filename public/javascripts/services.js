'use strict';

/* Services */
angular.module('MonitorModule').directive('sortBy', function () {
  return {
    templateUrl: 'sort-by',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      sortdir: '=',
      sortedby: '=',
      sortvalue: '@',
      onsort: '='
    },
    link: function (scope, element, attrs) {
      scope.sort = function () {
        if (scope.sortedby == scope.sortvalue)
          scope.sortdir = scope.sortdir == 1 ? -1 : 1;
        else {
          scope.sortedby = scope.sortvalue;
          scope.sortdir = 1;
        }
        scope.onsort(scope.sortedby, scope.sortdir);
      }
    }
  };
});