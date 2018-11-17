!function(){

	var tmp = $('<div class="btn-usual-ok"></div>').appendTo('body');
	$('#prt-present-limit .prt-get-all .btn-get-all').css({
		'background-position': tmp.css('background-position'),
		'width': tmp.css('width')
	});
	tmp.remove();

	var btn = $('<button>疯狂一括</button>').appendTo('#prt-present-limit .prt-get-all'), k=true, taco=0, taokp=0;
	btn.on('tap',toggleAutoTapGetAll);

	function oneKeyPickup(){$('#prt-present-limit .btn-get-all:visible').trigger(tapEvent)}
	function safeCheck(){
		if(!$('#prt-present-limit .prt-get-all .btn-get-all').is(':visible')){
			focusCloseAutoTapGetAll()
		}
	}
	function confirmOk(){
		$('#pop .pop-confirm .btn-usual-ok').trigger(tapEvent);
		$('#pop .pop-confirm-none .btn-usual-ok').trigger(tapEvent);
	}
	function aco(){ confirmOk(); taco=setTimeout(aco,1000); }
	function aokp(){ safeCheck(); oneKeyPickup(); taokp=setTimeout(aokp, 10000) }

	function toggleAutoTapGetAll(){
		if(k){
			aco();
			aokp();
			btn.text('我想静静');
		}else{
			clearTimeout(taco);
			clearTimeout(taokp);
			btn.text('疯狂一括');
		}
		k=!k;
	}

	function focusCloseAutoTapGetAll(){
		k=false;
		toggleAutoTapGetAll();
	}

	registerRouteChangeDestroyer(function(callback){
		clearTimeout(taco);
		clearTimeout(taokp);
		btn.off('tap',toggleAutoTapGetAll);
		callback();
	});

}();