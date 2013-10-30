function GamesController($scope, $http) {
  $scope.users = [];
  $scope.scores = [];

  $scope.prefix = "";

  $scope.setGames = function(games) {
    $scope.games = games;
  };

  $scope.setPrefix = function(gamePrefix) {
    $scope.gamePrefix = gamePrefix;
    $scope.getPastData();
  };

  $scope.getGames = function() {
    $http({url:'/getobjs', method: "POST", data: JSON.stringify({coll:"games"})}).success(function(data) {    
      $scope.games = data.obj.objs;
    });
  }  
  $scope.getPastData = function() {
    $scope.getDatetime();
    $scope.getPastUsers($scope.gamePrefix); 
    $scope.getPastGames($scope.gamePrefix);
  }  

  $scope.getTodayUsers = function(gamePrefix) {
    var queryObj = {};
    queryObj["gamesdet."+gamePrefix] = {$exists:true};

    $http({url:'/gettodayobj', method: "POST", data: JSON.stringify({coll:"users", query: queryObj})}).success(function(data) {    
      $scope.todayUsers = data.obj.todayObj;
    });
       
  }  

  $scope.getPastUsers = function(gamePrefix) {
    var queryObj = {};
    queryObj["gamesdet."+gamePrefix] = {$exists:true};    
    $http({url:'/getpastobj', method: "POST", data: JSON.stringify({coll:"users", query:queryObj})}).success(function(data) {    
      $scope.lastDaysUsers = data.obj.lastDaysObj;
      $scope.lastMonthUsers = data.obj.lastMonthObj;
      $scope.overallUsers = data.obj.overallObj;
      $scope.getTodayUsers(gamePrefix);
    });
  };

  $scope.getTodayGames = function(gamePrefix) {
    var collObj = {};
    collObj.coll = gamePrefix+".scores"; 
    collObj.query = {$or:[{won:1}, {guidopp:null}]};      
    $http({url:'/gettodayobj', method: "POST", data: JSON.stringify(collObj)}).success(function(data) {
      $scope.todayGames = data.obj.todayObj;
  
    });    
  }  

  $scope.getDatetime = function() {
    var actDate = new Date();
    $scope.datetime = actDate.getHours()+":"+actDate.getMinutes();   
      
  }  

  $scope.getPastGames = function(gamePrefix) {
    var collObj = {};
    collObj.coll = gamePrefix+".scores";   
    collObj.query = {$or:[{won:1}, {guidopp:null}]};    
    $http({url:'/getpastobj', method: "POST", data: JSON.stringify(collObj)}).success(function(data) {
      $scope.lastDaysGames = data.obj.lastDaysObj;
      $scope.lastMonthGames = data.obj.lastMonthObj;
      $scope.overallGames = data.obj.overallObj;
      $scope.getTodayGames(gamePrefix);
    });
  };  

  var loadavg=[];

  $scope.getServerInfo = function() {
    var socket = io.connect();

    $(".btnConnect").on("click",function(){
      socket.socket.reconnect();
    });

    var prevcpus = [];

    setInterval(function(){

      socket.emit('getstats', {game:$scope.gamePrefix});
 
    },1000);

     socket.on("stats",function(data){
        var stat = data.stats; 

        //server stats
        if (stat.server.uptime) {
          $("#uptime").html(formatTimespan(stat.server.uptime*1000));
          loadavg.push(Math.round(stat.server.loadavg[0]*100));
          if(loadavg.length>160){
            loadavg.splice(0,1);
          }
          $("#loadavg").sparkline(loadavg,{type: 'line',normalRangeMin:0,normalRangeMax:300, barColor:"green",chartRangeMin:0,chartRangeMax:1000,width:"250px",height:"30px"});
          $("#memory").sparkline([stat.server.totalmem-stat.server.freemem,stat.server.freemem],{type: 'pie',sliceColors:['red','green'],width:"50px",height:"50px"});
        }

        //game stats
        $("#appversion").html(stat.stats.appversion);
        $("#boards").html(stat.stats.boards);
        $("#playersPlaying").html(stat.stats.playersPlaying);
        $("#randomPlayers").html(stat.stats.randomPlayers);
        $("#singlePlayers").html(stat.stats.singlePlayers);
        $("#onlinePlayersQ").html(stat.stats.onlinePlayersQ);
        $("#usersOnline").html(stat.stats.usersOnline);
        $("#gameuptime").html(formatTimespan(stat.uptime));
        $("#gamerestarts").html(stat.stats.restarts);
        $("#dayusers").html(stat.stats.dayusers);
        $("#daygames").html(stat.stats.daygames);
        $("#daychatmsgs").html(stat.stats.daychatmsgs);
        $("#daystarted").html(stat.stats.daystarted);
        $("#daymultigames").html(stat.stats.daymultigames);
        $("#daybrokegames").html(stat.stats.daybrokegames);
        $("#monthusers").html(stat.stats.monthusers);
        $("#monthgames").html(stat.stats.monthgames);
        $("#monthchatmsgs").html(stat.stats.monthchatmsgs);
        $("#monthstarted").html(stat.stats.monthstarted);
        $("#monthmultigames").html(stat.stats.monthmultigames);
        $("#monthbrokegames").html(stat.stats.monthbrokegames);
        $("#totusers").html(stat.stats.totusers);
        $("#totgames").html(stat.stats.totgames);
        $("#totchatmsgs").html(stat.stats.totchatmsgs);
        $("#totstarted").html(stat.stats.totstarted);
        $("#totmultigames").html(stat.stats.totmultigames);
        $("#totbrokegames").html(stat.stats.totbrokegames);

        var time = new Date(stat.time);
        $("#lastUpdate").text(time.getHours()+":"+time.getMinutes()+":"+time.getSeconds());

        $("#server").html(JSON.stringify(stat.server));

      });
  };


  var formatTimespan = function(t) {
      t = Math.floor( t/1000 );

      if (t < 60) return t + " sec";

      di = t % 60;
      ds = Math.floor(t / 60);
      if (ds < 60) return ds + " min " + di + " sec";

      di = ds % 60;
      ds = Math.floor(ds / 60);
      if (ds < 60) return ds + " hr " + di + " min";

      di = ds % 24;
      ds = Math.floor(ds / 24);
      return ds + " days " + di + " hr";

      return t;
  };
  $scope.$watch('searchText', function(val) {
    queryObj = {nick: {$regex: val, $options: 'i' } };
    queryObj["gamesdet."+$scope.gamePrefix] = {$exists:true};  
    $scope.queryusers(val); 
  }); 

  $scope.queryusers  = function(val) {
     if (val && val.length>2) {
      $http(
        {method: 'POST',
         url: '/getobjs',
         data: JSON.stringify({coll:"users", query: queryObj, limit: 10}),
        })
        .success(function(data) {
          $scope.users = data.obj;
          //console.log('search success!');

        }).error(function() {
          console.log('Search failed!');
        });      
    } else {
      $scope.users = [];
    }
  } 

  $scope.banUser= function(userGuid, mode) {
    var queryObj = {guid: userGuid};
    var updobj = {};
    if (mode == "disable") {
      updobj.$set = {banned:true};
    } else {
      updobj.$unset = {banned:""};
    }  
    $http(
      {method: 'POST',
       url: '/updobj',
       data: JSON.stringify({coll:"users", query: queryObj, updobj: updobj}),
      })
      .success(function(data) {
        $scope.queryusers($scope.searchText); 
 //       console.log('Update success!');

      }).error(function() {
        console.log('Update failed!');
      });        
  } 

     
}
