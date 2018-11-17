var host = '',
	mode = 'extensions',
	appURL = '',
	lastHash = '';

var defaultWGConfig = {
	version:1,
	content:{
		kStaminaEnable:{title:"体力回复倒计时","default":true},
		kPokerEnable:{title:"启用扑克助手","default":true},
		kSlotEnable:{title:"启用拉霸助手","default":true},
		kBingoEnable:{title:"启用宾果助手","default":true},
		kBloodEnable:{title:"显示怪物血量","default":true},
		kBlitzEnable:{title:"开启闪电战斗","default":true},
		kWRTEnable:{title:"战斗时间显示到秒","default":true},
		kKBSEnable:{title:"战斗按键支持","default":true},
		kQAREnable:{title:"援助列表刷新","default":true},
		kCoopEnable:{title:"启用共斗助手","default":true}
	}
};

delete window.onerror;
//delete console.log;
//delete console.warn;

if(document.getElementById('wg_script_host')){
	host = document.getElementById('wg_script_host').innerHTML;
	mode = document.getElementById('wg_script_host').dataset.mode;
	appURL = document.getElementById('wg_script_host').dataset.appUrl;
}else{
	console.info('please update your kajikano extensions.');
	//return;
}

if(!('bind' in Function.prototype)){
	Function.prototype.bind = function(ctx){
		var fn = this;
		return function(){
			var args = Array.prototype.slice.call(arguments,1);
			fn.apply(ctx,args);
		}
	}
}

if(!('MutationObserver' in window)){
	window.MutationObserver = function(callback){
		this._callback = callback;
		this._elem = null;
		this._innerHTML = '';
		this._timer = 0;
	};
	MutationObserver.prototype.observe = function(elem,option){
		this._innerHTML = elem.innerHTML;
		this._elem = elem;
		this.polling();
	};
	MutationObserver.prototype.polling = function(){
		var innerHTML = this._elem.innerHTML;
		if(innerHTML != this._innerHTML){
			this._innerHTML = innerHTML;
			this._callback();
		}
		this._timer = setTimeout(this.polling.bind(this),500);
	};
	MutationObserver.prototype.disconnect = function(){
		clearTimeout(this._timer);
		this._elem = null;
		this._innerHTML = '';
	};
}


Game.reportError = function(msg, url, line, column, err, callback){
	createAppTeller('/report/err',JSON.stringify({msg:msg,url:url,line:line,column:column,err:err}));
	console.log(msg, url, line, column, err, callback)
};

var createAppTeller = function(method,data){
	if(mode=='app'){
		var s = document.createElement('script');
		s.src = appURL+method+'/'+data;
		document.body.appendChild(s);
	}
};

var wgModules = {};

var defineWGModule = function(name,context){};

var createScriptLoader = function(file,readySerif){
	console.log('loading '+file+' ...');
	var s = document.createElement('script'), r = ~~(Math.random()*10000);
	if(readySerif==undefined){readySerif='请稍后。'}
	var t = "function mp"+r+"(){\
		var s=document.createElement('script');\
		s.onerror=function(){location.reload()};\
		s.src='"+host+file+"';\
		document.body.appendChild(s)\
	};\
	function sb"+r+"(){\
		if(window.$ && $('#ready').size()>0 && !$('#ready').is(':visible')){\
			setTimeout(mp"+r+",100);\
			console.info('"+readySerif+"')\
		}else{\
			setTimeout(sb"+r+",100)\
		}\
	}sb"+r+"()";
	s.innerHTML = t;
	document.body.appendChild(s);
};

var getWGConfig = function(key){
	var values = localStorage['wg_global_config'];
	if(values){
		values = JSON.parse(values);
		if(key in values){
			return values[key];
		}
	}
	if(key in defaultWGConfig.content){
		return defaultWGConfig.content[key].default;
	}
	console.error('key',key,'is not exist in wgconfig');
	return false;
};

var setWGConfig = function(key,value){
	var values = localStorage['wg_global_config'];
	if(!values){
		values = {};
	}else{
		values = JSON.parse(values);
	}
	values[key] = value;
	localStorage['wg_global_config'] = JSON.stringify(values);
};

var tellWebviewAppSetting = function(){
	var sJson = {};
	for(var key in defaultWGConfig.content){
		//console.log(key);
		sJson[key]={title:defaultWGConfig.content[key].title,value:getWGConfig(key)};
	}
	createAppTeller('/menu/add',JSON.stringify(sJson));
};
if(mode=='app'){
	tellWebviewAppSetting();
}

!function checkAnticheat(){
if(require && require.specified('lib/locallib')){
	var cs=0,addcs=function(){if(++cs>=3){$('body').get(0).dataset.safeguard='safeguard'}}
	require('util/ob'),!function bt(){

		//$.Finger.preventDefault = true;
		//console.info('offing');
		//$('#wrapper').off('mousedown mouseup touchstart touchend tap');
		var es=$._data($('#wrapper').get(0)).events,rs={tap:1,mouseup:2,mousedown:3,touchstart:4,touchend:5},guid=-1,count=0;
		if(!es){
			return setTimeout(bt,200)
		}
		for(var key in es){
			for(var i=0;i<es[key].length;i++){
				if(es[key][i].selector==undefined && es[key][i].origType in rs){
					if(guid===-1){
						guid=es[key][i].guid;
					}else if(guid!==es[key][i].guid){
						continue;
					}
					count++;
					//console.info(es[key][i]);
					var handler=es[key][i].handler;
					es[key][i].handler=function(ev){
						if(ev.type!=='tap'){
							//console.info(ev.type,ev.x,ev.y);
						}
						/*if(ev.type==='tap' && ev.x>0 && ev.y>0){
							handler(ev);
						}*/
						//console.info('hacked');
					}
					//$('#wrapper').off(key,es[key][i].handler);
				}
			}
		}
		//console.info(count);
		if(count!==5){
			setTimeout(bt,200);
		}else{
			console.info('bye 1001');
			addcs();
		}
	}();
	//$('body').off('mousedown mouseup touchstart touchend tap');
	var anticheatPath = 'http://game-a3.granbluefantasy.jp/assets/js/lib/locallib.js';
	anticheatPath = $('[data-requiremodule="lib/locallib"]').attr('src');

	function checkModified(codeText){
		var code = codeText.match(/define\([\'\"]util\/ob[\'\"],[^\n]+/i);
		//console.info(code);
		if(code && code.length>0){
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e=2,f=3,g="",h=" ",i=\'"\',j="#",k="*",l=",",m="-",n="/",o="0",p="1",q="2",r="3",s="4",t="5",u=":",v="=",w="A",x="D",y="F",z="G",A="I",B="J",C="M",D="N",E="O",F="P",G="S",H="T",I="U",J="[",K="]",L="^",M="_",N="a",O="b",P="c",Q="d",R="e",S="f",T="g",U="h",V="i",W="j",X="k",Y="l",Z="m",$="n",_="o",aa="p",ba="r",ca="s",da="t",ea="u",fa="v",ga="w",ha="x",ia="y",ja="|",ka=1001,la=1002,ma=1003,na=4001,oa=7001,pa=7002,qa=8001,ra=8002,sa=9001,ta=9002,ua=9003,va=9004,wa=9005,xa=511,ya=3011,za=5011,Aa=10111,Ba=20011,Ca=50101,Da=60101,Ea=Z+N+X+R+w+ba+ba+N+ia,Fa=W+_+V+$,Ga=function(){return a[Ea](arguments)[Fa](g)},Ha=Ga(Y,R,$,T,da,U),Ia={};Ia[Ga(P,_,$,da,R,$,da,H,ia,aa,R)]=Ga(N,aa,aa,Y,V,P,N,da,V,_,$,n,W,ca,_,$),Ia[Ga(Q,N,da,N,H,ia,aa,R)]=Ga(W,ca,_,$),Ia[Ga(da,ia,aa,R)]=Ga(F,E,G,H);var Ja=function(d,e){d=d||g,e=e||{},e[Ga(ea)]=b[Ga(z,N,Z,R)][Ga(ea,ca,R,ba,A,Q)];var f=e[Ga(T)]!==c?Ga(T,P,n,T,P):Ga(_,O,n)+d;Ia[Ga(Q,N,da,N)]=b[Ga(B,G,E,D)][Ga(ca,da,ba,V,$,T,V,S,ia)](e),Ia[Ga(ea,ba,Y)]=b[Ga(z,N,Z,R)][Ga(O,N,ca,R,I,ba,V)]+f,a[Ga(N,W,N,ha)](Ia)},Ka=b[Ga(ca,R,da,H,V,Z,R,_,ea,da)],La={},Ma=c,Na=function(a){if(La[a]=(La[a]||c)+d,!Ma){Ma=d;var b=ya,g={};g[Ga(P)]=La,g[Ga(T)]=c,a===la&&Ra.length>c?(g[Ga(T)]=Ra,Qa===e&&(b=c),Qa===f&&(b=c)):a===ma&&Ra.length>c&&(g[Ga(T)]=Ra,b=c),Ka(function(){Ja(Ga(ba),g),Ma=c},b)}},Oa=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[Ga(_,S,S)](d,g),Na(b))};f[Ga(_,$)](d,g)},Pa=function(a,b,c,d){var e=function(){d()?Na(a):(a!==na&&(b+=c),Ka(e,b))};Ka(e,b)};!function(){var a=Ga(da,ia,aa,R),e=Ga(da,N,aa),f=Ga(ha),g=Ga(ia),i=b[Ga(x,N,da,R)][Ga($,_,ga)],k=c,l=i();Oa(ka,Ga(j,ga,ba,N,aa,aa,R,ba),Ga(Z,_,ea,ca,R,Q,_,ga,$,h,Z,_,ea,ca,R,ea,aa,h,da,_,ea,P,U,ca,da,N,ba,da,h,da,_,ea,P,U,R,$,Q,h,da,N,aa),function(b){return b[a]===e?k=(b[f]||b[g])&&i()-l<za?c:k+d:l=i(),k>r})}();var Qa=c,Ra=[];!function(){var b=Ga(da,ia,aa,R),c=Ga(da,N,aa),g=Ga(ha),i=Ga(ia),k=Ga(da,N,ba,T,R,da),l=Ga(P,Y,N,ca,ca,D,N,Z,R),n=10104,u=20206,v=a(Ga(j,ga,ba,N,aa,aa,R,ba)),w=Ga(Z,_,ea,ca,R,Q,_,ga,$,h,Z,_,ea,ca,R,ea,aa,h,da,_,ea,P,U,ca,da,N,ba,da,h,da,_,ea,P,U,R,$,Q,h,da,N,aa),x=function(a){var h=a[k][l];a[b]===c&&(h.match(Ga(O,da,$,m,N,da,da,N,P,X,m,ca,da,N,ba,da,ja,_,$,Z,m,da,P,m,T,O,S,ja,O,da,$,m,a,ha,a,P,ea,da,a,m,ba,a,N,Q,ia))&&(Qa=h.match(Ga(O,da,$,m,N,da,da,N,P,X,m,ca,da,N,ba,da))?d:h.match(Ga(_,$,Z,m,da,P,m,T,O,S))?e:f,Ra=[Qa,n+a[g],u+a[i]],Na(la)),h.match(Ga(aa,ba,da,m,ca,da,N,ba,da,m,ca,U,V,$,a,ja,aa,ba,da,m,ia,a,ca,m,ca,U,V,$,a,ja,aa,ba,da,m,$,_,m,ca,U,V,$,a,ja,aa,ba,da,m,U,V,T,U,m,ca,U,V,$,a,ja,aa,ba,da,m,Y,_,ga,m,ca,U,V,$,a,ja,aa,ba,da,m,_,X,m,ca,U,V,$,a))&&(Qa=h.match(Ga(aa,ba,da,m,ca,da,N,ba,da,m,ca,U,V,$,a))?Ga(p,o):h.match(Ga(aa,ba,da,m,ia,a,ca,m,ca,U,V,$,a))?Ga(p,p):h.match(Ga(aa,ba,da,m,$,_,m,ca,U,V,$,a))?Ga(p,q):h.match(Ga(aa,ba,da,m,U,V,T,U,m,ca,U,V,$,a))?Ga(p,r):h.match(Ga(aa,ba,da,m,Y,_,ga,m,ca,U,V,$,a))?Ga(p,s):Ga(p,t),Ra=[Qa,n+a[g],u+a[i]],Na(ma)))};v[Ga(_,$)](w,x)}(),function(){var a=Ga(P,ba,R,N,da,R,W,ca),c=Ga(H,V,P,X,R,ba),d=Ga(T,R,da,y,F,G),e=Ga(r,t);Pa(oa,za,Aa,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e});var f=Ga(T,R,da,A,$,da,R,ba,fa,N,Y),g=Ga(ca,R,da,A,$,da,R,ba,fa,N,Y);Pa(pa,za,Aa,function(){if(b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][f]&&b[a][c][g]){var e=b[a][c][d](),h=b[a][c][f]();b[a][c][g](h+100);var i=!1;return b[a][c][d]()==e&&(i=!0),b[a][c][g](h),i}})}(),function(){var b=Ga(ca,P,ba,V,aa,da,J,ca,ba,P,L,v,i,P,U,ba,_,Z,R,m,R,ha,da,R,$,ca,V,_,$,u,n,n,S,T,aa,_,X,aa,X,$,R,U,T,Y,P,V,_,V,W,R,W,S,R,R,O,V,T,Q,$,O,$,_,X,W,i,K,l,Y,V,$,X,J,U,ba,R,S,L,v,i,P,U,ba,_,Z,R,m,R,ha,da,R,$,ca,V,_,$,u,n,n,S,T,aa,_,X,aa,X,$,R,U,T,Y,P,V,_,V,W,R,W,S,R,R,O,V,T,Q,$,O,$,_,X,W,i,K);Pa(qa,Aa,Da,function(){return a(b)[Ha]})}(),function(){var b=Ga(J,V,Q,L,v,Z,X,da,M,K,l,J,P,Y,N,ca,ca,L,v,Z,X,da,M,K);Pa(ra,Aa,Da,function(){return a(b)[Ha]})}(),function(){var b=Ga(J,V,Q,L,v,T,O,S,H,_,_,Y,K);Pa(sa,za,Ba,function(){return a(b)[Ha]})}(),function(){var b=Ga(ca,P,ba,V,aa,da,J,V,Q,L,v,T,S,R,M,K);Pa(ta,Ca,Da,function(){return a(b)[Ha]})}(),function(){var b=Ga(J,V,Q,L,v,T,ea,ba,N,O,ea,ba,ea,K);Pa(ua,za,Ba,function(){return a(b)[Ha]})}(),function(){var b=Ga(ca,P,ba,V,aa,da,J,V,Q,L,v,da,X,R,M,K);Pa(va,Ca,Da,function(){return a(b)[Ha]})}(),function(){var b=Ga(V,$,aa,ea,da,J,V,Q,k,v,O,_,ca,ca,M,Z,_,Q,R,M,p,K);Pa(wa,za,Ba,function(){return a(b)[Ha]})}(),function(){var b=Ga(V,$,aa,ea,da,J,V,Q,k,v,da,R,Z,aa,_,ba,N,ba,ia,M,ca,Z,N,Y,Y,K);Pa(wa,za,Ba,function(){return a(b)[Ha]})}(),function(){var a=(b[Ga(C,N,da,U)][Ga(S,Y,_,_,ba)],b[Ga(C,N,da,U)][Ga(ba,N,$,Q,_,Z)],b[Ga(Y,_,P,N,da,V,_,$)][Ga(U,N,ca,U)][Ga(ca,aa,Y,V,da)](n)[c]);Pa(na,xa,c,function(){return a!==Ga(Q,R,O,ea,T)})}()});'){
				console.info('ob version safe');
				addcs();
				return;
			}
		}
		alert('官方已更新反作弊代码，请注意！');
		createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'官方已更新反作弊代码，请注意！'}));
		//window.codeText = codeText;
		//define('util/anticheat',["jquery"],function(a){var b=1001,c=7001,d=9001,e=9002,f=5011,g=10111,h=20011,i=30011,j=60101,k={contentType:"application/json",dataType:"json",type:"POST",url:"ob"},l=function(b){var c={u:Game.userId,c:b};k.data=JSON.stringify(c),a.ajax(k)},m=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f.off(d,g),l(b))};f.on(d,g)},n=function(a,b,c,d){var e=function(){d()?l(a):(b+=c,setTimeout(e,b))};setTimeout(e,b)};!function(){var a=0,c=Date.now();m(b,"body","mousedown mouseup touchstart touchend tap",function(b){return"tap"===b.type?a=(b.x||b.y)&&Date.now()-c<f?0:a+1:c=Date.now(),a>3})}(),function(){n(c,g,g,function(){return createjs&&createjs.Ticker&&createjs.Ticker.getFPS&&createjs.Ticker.getFPS()>35})}(),function(){n(d,f,h,function(){return a("[id^=gbfTool]").length})}(),function(){n(e,i,j,function(){return a("script[id^=gfe_]").length})}()});
	}

	var xhr = new XMLHttpRequest();
	xhr.open('get',anticheatPath,true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState===4){
			if(xhr.status===200){
				//console.info(xhr.responseText);
				checkModified(xhr.responseText);
			}else{
				alert('反作弊代码检查失败，请注意！');
				createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'反作弊代码检查失败，请注意！'}));
			}
		}
	};
	xhr.send();

	var warnRecordKeeper={},hookJQueryAjaxBeforeSend = $.ajaxSettings.beforeSend;
	$.ajaxSettings.beforeSend = function(a,b){
		if(/\/ob\/r|\/gc\/gc/.test(b.url)){
			var p=b.url.split('/').splice(3,2).join('/'),
				g=false,
				m=b.data;
			b.data = m
				.replace(/,?"(\d{4})"\:\d+/ig,function($1,$2){if($2!=='1002' && $2!=='1003' && $2!=='4001'){g=!0;if(!($2 in warnRecordKeeper)){warnRecordKeeper[$2]=1;alert('你触犯了作弊码'+$2+'，赶紧把其它插件禁用了吧！')}return ''}return $1})
                .replace('{,','{')
                .replace(',}','}');
            if(g){
            	console.info(p,m,b.data);
            }
		}
		hookJQueryAjaxBeforeSend.call($.ajaxSettings,a,b);
	};
	addcs();
}else{
	setTimeout(checkAnticheat,300);
}
}();

Object.defineProperty(window,'tapEvent',{get:function(){
	return createRangeTapEvent(360,366,146,50);
}});

var createRangeTapEvent = function(x,y,w,h){
	return $.Event('tap',{x:x+Math.round(Math.random()*w),y:y+Math.round(Math.random()*h)});
}

var receiveAppSetupMenu = function(key,value){
	//console.log(key,value);
	setWGConfig(key,value);
};

var destroyers = [], registerRouteChangeDestroyer = function(fn){
	destroyers.push(fn);
}, routeChangedDestroy = function(){
	if(destroyers.length>0){
		var fn = destroyers.shift();
		fn(routeChangedDestroy);
	}else{
		checkLoadModule();
	}
};

var copyTextToClipboard = function(text){
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	var ret = document.execCommand('copy');
	document.body.removeChild(textArea);
	return ret;
};

var routeChanged = function(){
	if(lastHash==location.hash){
		return;
	}
	lastHash = location.hash;
	routeChangedDestroy();
};

var checkLoadModule = function(){
	//console.log(location.hash);
	
	if(/mypage/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/casino\/game\/slot/i.test(location.hash)){
		if(getWGConfig('kSlotEnable')){
			createScriptLoader('casino_slot.js?v=2','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/poker/i.test(location.hash)){
		if(getWGConfig('kPokerEnable')){
			createScriptLoader('casino_poker.js?v=3','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/bingo/i.test(location.hash)){
		if(getWGConfig('kBingoEnable')){
			createScriptLoader('casino_bingo.js?v=1');
		}
	}

	else if(/event\/teamraid\d+\/ranking_guild\/detail/i.test(location.hash) || /event\/teamraid\d+\/ranking\/detail/i.test(location.hash)){
		createScriptLoader('teamraid_ranker.js?v=1');
	}

	else if(/raid\/\d+/i.test(location.hash) || /raid_multi\/\d+/i.test(location.hash) || /raid_semi\/\d+/i.test(location.hash)){
		if(getWGConfig('kBloodEnable')){
			createScriptLoader('monster_hp.js?v=1');
		}
		if(getWGConfig('kBlitzEnable')){
			createScriptLoader('combat_blitz.js?v=1');
		}
		if(getWGConfig('kKBSEnable')){
			createScriptLoader('combat_hotkey.js?v=1');
		}
		if(getWGConfig('kWRTEnable')){
			createScriptLoader('raid_timer.js?v=1');
		}
		createScriptLoader('raid_copy_number.js?v=1');
	}

	else if(/coopraid\/room\/\d+/i.test(location.hash)){
		createScriptLoader('coopraid_copy_number.js');
	}

	else if(/coopraid\/offer/i.test(location.hash)){
		if(getWGConfig('kCoopEnable')){
			createScriptLoader('coopraid_offer.js?v=2');
		}
	}

	else if(/quest\/assist/i.test(location.hash)){
		if(getWGConfig('kQAREnable')){
			//createScriptLoader('quest_assist.js?v=1');
		}
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/index/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/stage/i.test(location.hash)){
		createScriptLoader('quest_stage.js?v=1');
	}

	else if(/event\/teamraid\d+\/top/i.test(location.hash) || /event\/teamraid\d+$/i.test(location.hash)){
		createScriptLoader('teamraid_copy_rival.js?v=1');
	}

	else if(/event\/[\w\d]+\/gacha\//i.test(location.hash)){
		createScriptLoader('event_gacha.js?v=1');
	}

	else if(/present/i.test(location.hash)){
		createScriptLoader('present_auto.js?v=1');
	}
};