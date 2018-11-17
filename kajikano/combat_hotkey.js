(function(){

	function setStyle(){$('<style>.wg_lightup{position:absolute;top:0px;left:0px;z-index:1;width:44px;height:44px;background:#FFF;opacity:0.4;transition:opacity 0.5s ease-out}</style>').appendTo(document.body)}

	function commandToFight(type,cmd1,cmd2,cmd3,cmd4){
		if(type=='attack'){
			$('.btn-attack-start.display-on').trigger(tapEvent);
			$('.btn-result:visible').trigger(tapEvent);
			$('.btn-command-forward:not(.disable)').trigger(tapEvent)
		}else if(type=='ability'){
			//if($('.prt-command .prt-member .invisible').size()==0){return}
			//var chara = ~~$('.prt-command .prt-member .invisible').attr('pos')+1;
			//$('.prt-command .prt-command-chara[pos='+chara+'] .prt-ability-list div:nth-child('+cmd1+').btn-ability-available').trigger('tap');
			$('.prt-command .prt-command-chara:visible .prt-ability-list div:nth-child('+cmd1+').btn-ability-available').trigger(tapEvent);
			var wg_lightUP = $('<div class="wg_lightup"></div>').appendTo('.prt-command .prt-command-chara:visible .prt-ability-list div:nth-child('+cmd1+').btn-ability-available');
			setTimeout(function(){wg_lightUP.css('opacity','0')},50);
			setTimeout(function(){wg_lightUP.remove()},550);
		}else if(type=='summon'){
			$('.btn-command-summon').trigger(tapEvent).nextAll('.btn-summon-available[pos='+cmd1+']').trigger(tapEvent);
			$('.btn-summon-use:visible').trigger(tapEvent);
		}else if(type=='switch'){
			if($('.prt-slide-icon').is('.show-icon')){
				$('.prt-slide-icon .'+cmd1).trigger(tapEvent);
			}else{
				$('.prt-member .btn-command-character:nth-child('+cmd2+')').trigger(tapEvent);
			}
		}else if(type=='next'){
			$('.btn-result').trigger(tapEvent);
		}else if(type=='ougi'){
			$('.btn-lock').trigger(tapEvent);
		}
	}

	function getPressedCharCode(e){
		if(e.altKey || e.ctrlKey || e.shiftKey || e.metaKey){
			return;
		}
		var targetTag = e.target.tagName.toLowerCase();
		if(targetTag == 'textarea' || targetTag == 'input'){
			return;
		}
		var cmdChar = String.fromCharCode(e.charCode).toLowerCase();
		//console.info(cmdChar);
		switch(cmdChar){
			case 'a':
			case '工':
			case 'ち':
				commandToFight('attack');
				break;
			case 'f':
			case 'は':
			case '土':
			case 'd':
			case 'し':
			case '大':
				var cmd1 = {f:'ico-next',d:'ico-pre',は:'ico-next',し:'ico-pre',土:'ico-next',大:'ico-pre'},
					cmd2 = {f:1,d:4,は:1,し:4,土:1,大:4};
				commandToFight('switch',cmd1[cmdChar],cmd2[cmdChar]);
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
				commandToFight('summon',cmdChar);
				break;
			case 'q':
			case 'w':
			case 'e':
			case 'r':
			case '金':
			case '人':
			case '月':
			case '白':
			case 'た':
			case 'て':
			case 'い':
			case 'す':
				var cmd = {q:1,w:2,e:3,r:4,金:1,人:2,月:3,白:4,た:1,て:2,い:3,す:4};
				commandToFight('ability',cmd[cmdChar]);
				break;
			/*case 'o':
				commandToFight('ougi',cmdChar);
				break;
			case 'n':
				commandToFight('next',cmdChar);
				break;*/
		}
	}

	document.addEventListener('keypress',getPressedCharCode,false);
	setStyle();
	console.info('热键已开启！');

	registerRouteChangeDestroyer(function(callback){
		document.removeEventListener('keypress',getPressedCharCode,false);
		callback();
	});

})();