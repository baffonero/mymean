var loadavg=[];
$(function(){
	var socket = io.connect();

	$(".btnConnect").on("click",function(){
		socket.socket.reconnect();
	});

	var prevcpus = [];
	//socket.on("stat",function(stat){
setInterval(function(){
	console.log("EMIT");

	socket.emit('getstats');

	socket.on("stats",function(data){
		var stat = data.stats; 

		console.log("RES",stat);
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
		/*var cpus = [];
		$.each(stat.server.cpus,function(index,cpu){
			if(prevcpus[index]) {
				//debugger;

				//var delta = (stat.server.cpus[index].times.sys+stat.server.cpus[index].times.user+stat.server.cpus[index].times.idle)-(prevcpus[index].times.sys+prevcpus[index].times.user+prevcpus[index].times.idle);
				var delta = (stat.server.cpus[index].times.sys+stat.server.cpus[index].times.user)-(prevcpus[index].times.sys+prevcpus[index].times.user);
				//var percentage = (delta * 10000) / 100;
				//console.log(delta);
				//delta = 5000;
				//cpus.push([delta,10000-delta]);
				cpus.push(delta);
			}
		});

		prevcpus = stat.server.cpus;
		

		$("#cpusload").sparkline(cpus,{type: 'bar',barColor:"#f00",chartRangeMin:0,chartRangeMax:10000,barWidth:"20px",barSpacing:"10px",height:"50px"});
		*/
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
		$("#monthusers").html(stat.stats.monthusers);
		$("#monthgames").html(stat.stats.monthgames);
		$("#totusers").html(stat.stats.totusers);
		$("#totgames").html(stat.stats.totgames);

		var time = new Date(stat.time);
		$("#lastUpdate").text(time.getHours()+":"+time.getMinutes()+":"+time.getSeconds());

		$("#server").html(JSON.stringify(stat.server));

	});
},1000);

});


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
