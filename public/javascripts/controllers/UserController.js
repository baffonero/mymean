function UserController($scope) {

  $scope.setUser = function(user) {
    $scope.user = user;
    console.log(user);
  };

}
