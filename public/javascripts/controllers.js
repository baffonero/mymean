function UserController($scope, $http) {
  $scope.users = [];
  $scope.scores = [];
  var actDate = new Date();
  $scope.datetime = actDate.getHours()+":"+actDate.getMinutes();

  $scope.getTodayUsers = function() {
    $http({url:'/gettodayobj', method: "POST", data: {coll:"users", query:{"gamesdet.scopa": {$exists:true}}}}).success(function(data) {    
      $scope.todayUsers = data.obj.todayObj;
    });    
  }  

  $scope.getPastUsers = function() {
    $http({url:'/getpastobj', method: "POST", data: {coll:"users", query:{"gamesdet.scopa": {$exists:true}}}}).success(function(data) {    
      $scope.lastDaysUsers = data.obj.lastDaysObj;
      $scope.lastMonthUsers = data.obj.lastMonthObj;
      $scope.overallUsers = data.obj.overallObj;
      $scope.getTodayUsers();
    });
  };

  $scope.getTodayGames = function() {
    $http({url:'/gettodayobj', method: "POST", data: {coll:"scopa.scores"}}).success(function(data) {
      $scope.todayGames = data.obj.todayObj;
    });    
  }  
  $scope.getPastGames = function() {
    $http({url:'/getpastobj', method: "POST", data: {coll:"scopa.scores"}}).success(function(data) {
      $scope.lastDaysGames = data.obj.lastDaysObj;
      $scope.lastMonthGames = data.obj.lastMonthObj;
      $scope.overallGames = data.obj.overallObj;
      $scope.getTodayGames();
    });
  
    setInterval(function() {
      $scope.getTodayGames();
      $scope.getTodayUsers();
    }, 5 * 1000); // update every 5 seconds;
  };  
}