function UserController($scope, $http) {
  $scope.users = [];
  $scope.scores = [];
  

  $scope.getTodayUsers = function() {
    $http({url:'/gettodayobj', method: "POST", data: JSON.stringify({coll:"users", query:{"gamesdet.scopa": {$exists:true}}})}).success(function(data) {    
      $scope.todayUsers = data.obj.todayObj;
    });
//      setInterval(function() {
//        $scope.getTodayUsers();
//      }, 5 * 1000); // update every 5 seconds;         
  }  

  $scope.getPastUsers = function() {
    $http({url:'/getpastobj', method: "POST", data: JSON.stringify({coll:"users", query:{"gamesdet.scopa": {$exists:true}}})}).success(function(data) {    
      $scope.lastDaysUsers = data.obj.lastDaysObj;
      $scope.lastMonthUsers = data.obj.lastMonthObj;
      $scope.overallUsers = data.obj.overallObj;
      $scope.getDatetime();
      $scope.getTodayUsers();
    });
  };

  $scope.getTodayGames = function() {
    $http({url:'/gettodayobj', method: "POST", data: JSON.stringify({coll:"scopa.scores"})}).success(function(data) {
      $scope.todayGames = data.obj.todayObj;
  
    });    
//      setInterval(function() {
//        $scope.getTodayGames();
//      }, 5 * 1000); // update every 5 seconds;      
  }  

  $scope.getDatetime = function() {
    var actDate = new Date();
    $scope.datetime = actDate.getHours()+":"+actDate.getMinutes();   
      
  }  

  $scope.getPastGames = function() {
    $http({url:'/getpastobj', method: "POST", data: JSON.stringify({coll:"scopa.scores"})}).success(function(data) {
      $scope.lastDaysGames = data.obj.lastDaysObj;
      $scope.lastMonthGames = data.obj.lastMonthObj;
      $scope.overallGames = data.obj.overallObj;
      $scope.getDatetime();
      $scope.getTodayGames();
    });
  };  

  setInterval(function() {
    $scope.getDatetime();
    $scope.getTodayGames();
    $scope.getTodayUsers();
  }, 5 * 1000); // update every 5 seconds;    
}