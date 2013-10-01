function UserController($scope, $http) {
  $scope.users = [];
  $scope.scores = [];

  $scope.getUsers = function() {
    $http.get('/getlastweekusers').success(function(data) {
      console.log(data);
      $scope.users = data.users;
    });

    //setInterval(function() {
    //  $scope.updateList();
    //  $scope.$apply();
    //}, 30 * 60 * 1000); // update every 30 minutes;
  };

  $scope.getGames = function() {
    $http.get('/getlastweekgames').success(function(data) {
      console.log(data);
      $scope.games = data.games;
    });

    //setInterval(function() {
    //  $scope.updateList();
    //  $scope.$apply();
    //}, 30 * 60 * 1000); // update every 30 minutes;
  };  
}