function UserController($scope, $http) {
  $scope.users = [];

  $scope.getUsers = function() {
    $http.get('/getusers').success(function(data) {
      console.log('updateList', data);
      $scope.users = data.users;
    });

    //setInterval(function() {
    //  $scope.updateList();
    //  $scope.$apply();
    //}, 30 * 60 * 1000); // update every 30 minutes;
  };
}