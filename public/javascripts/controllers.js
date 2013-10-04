function UserController($scope, $http) {
  $scope.users = [];
  $scope.scores = [];
  var actDate = new Date();
  $scope.datetime = actDate.getHours()+":"+actDate.getMinutes();

  $scope.getTodayUsers = function() {
    $http.get('/gettodayusers').success(function(data) {
      $scope.todayUsers = data.users.todayUsers;
    });    
  }  

  $scope.getPastUsers = function() {
    $http.get('/getpastusers').success(function(data) {
      $scope.lastDaysUsers = data.users.lastDaysUsers;
      $scope.lastMonthUsers = data.users.lastMonthUsers;
      $scope.overallUsers = data.users.overallUsers;
      $scope.getTodayUsers();
    });
  };

  $scope.getTodayGames = function() {
    $http.get('/gettodaygames').success(function(data) {
      $scope.todayGames = data.games.todayGames;
    });    
  }  
  $scope.getPastGames = function() {
    $http.get('/getpastgames').success(function(data) {
      $scope.lastDaysGames = data.games.lastDaysGames;
      $scope.lastMonthGames = data.games.lastMonthGames;
      $scope.overallGames = data.games.overallGames;
      $scope.getTodayGames();
    });
  
    setInterval(function() {
      $scope.getTodayGames();
      $scope.getTodayUsers();
    }, 5 * 1000); // update every 5 seconds;
  };  
}