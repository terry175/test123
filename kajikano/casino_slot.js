(function(){

var moBet = new MutationObserver(betCheck), iBet = 0, tWait = 0, nReward = 0, nTotal = 0, nWins = 0, elOut, nextStopTime = ~~localStorage['wg_slot_next_stop_time'];

function betCheck(ms){
	var nBet = tz('.prt-bet');
	if(nBet==0){
		//game end;
		var nWon = tz('.prt-won');
		nReward += nWon - iBet;
		nTotal++;
		if(nWon>0){
			nWins++;
		}
		showOut();
		doNext();
	}else if(iBet==0){
		iBet = nBet;
	}
}

function showOut(){
	if(!elOut){
		elOut = $('<div></div>').appendTo('.prt-controller').css({position:'absolute',top:'100%',left:'0',color:'white'});
	}
	elOut.html('累计：'+nTotal+'次，命中：'+nWins+'次，成绩：'+nReward);
	localStorage['wg_slot_record']=JSON.stringify({l:nTotal,a:nReward,c:nWins});
}

function doNext(){
	clearTimeout(tWait);
	if(new Date().getTime()>=nextStopTime){
		sleep(1000*60*30);
		return;
	}
	tp('.prt-bet-max');
	tWait = setTimeout(reload,1000*20);
}

function reload(){
	location.reload();
}

function sleep(x){
	setTimeout(function(){
		nextStopTime = new Date().getTime()+1000*60*60*2;
		localStorage['wg_slot_next_stop_time'] = nextStopTime;
		doNext();
	},x);
}

function tp(s){
	if($('#pop-captcha').children().size()==0){
		$(s).trigger(tapEvent)
	}
};

function tz(s){
	var _=$('div',s),__=_.size()-1,___=0;
	_.each(function(i,____){
		___+=~~____.className.split('_')[1]*Math.pow(10,__-i)
	});
	return ___
}

function init(){
	var commandPad = $('<div class="wg"><style>.wg{position:absolute;z-index:100000;top:0}.wg button{width:64px;height:22px;padding:0;margin-right:4px}</style></div>').appendTo(document.body),
		cmd1 = $('<button>重置</button>').appendTo(commandPad),
		et = 'ontouchstart' in window ? 'touchstart' : 'mousedown';

	cmd1.on(et,function(){
		nReward = 0, nTotal = 0, nWins = 0;
	});

	var tmp1 = localStorage['wg_slot_record'];
	if(tmp1){
		tmp1 = JSON.parse(tmp1);
		nTotal = tmp1.l, nReward = tmp1.a, nWins = tmp1.c;
	}

	//createjs.Ticker.setFPS(300);

	moBet.observe(document.querySelector('.prt-bet'),{childList:true});

	registerRouteChangeDestroyer(function(callback){
		moBet.disconnect();
		callback();
	});

	if(new Date().getTime()>nextStopTime){
		sleep(0);
	}else{
		doNext();
	}
}

setTimeout(init,1000*5);

})();