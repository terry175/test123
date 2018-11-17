(function(){

var ttj,tasj,trl,tar,tabtn;

function _tapJoin(){$('.btn-usual-join:visible').trigger(tapEvent);$('.btn-usual-ok:visible').trigger(tapEvent);_autoTapJoin()}
function _autoTapJoin(){ttj=setTimeout(_tapJoin,50)}
_autoTapJoin();
//$('.prt-wanted-list').on('tap',autoTapJoin);
console.info('单击参加已启用。')

var _keyword = /サジ|匙|ex3\-3|ex3/i,_joinPandemo=false;
function _findAndTapSaji(){_autoSaji();$('.prt-wanted-room').each(function(i,el){
	var t=$('.txt-room-comment',el).text();
	if($(el).is('[data-taped]')){return}
	if(_joinPandemo && $('.prt-invite-type-4',el).size()>0 && $('.prt-member-image',el).children().size()<3){
		$(el).trigger(tapEvent);console.log(t);
		$(el).attr('data-taped','1');
	}
	if(_keyword.test(t) && $('.prt-member-image',el).children().size()<3 && $('.prt-invite-type-2,.prt-invite-type-3',el).size()==0){
		$(el).trigger(tapEvent);console.log(t);
		$(el).attr('data-taped','1');
	}
})}
function _autoSaji(){tasj=setTimeout(_findAndTapSaji,50)}
function autoFindRoom(comment,joinPandemo){
	_joinPandemo = !!joinPandemo;
	_keyword = new RegExp(comment,'i');
	_autoSaji();
	_autoRenew();
	//return '输入 stop 来停止。'
}

var _waitSec = 3;
function _renewList(){if($('#loading').is(':visible')){trl=setTimeout(_renewList,100)}else{_autoRenew();$('.btn-refresh-list').trigger(tapEvent)}}
function _autoRenew(){tar=setTimeout(_renewList,1000*_waitSec)}

function appendBtn(){
	if($ && $('.frm-room-key').size()>0){
		$('.frm-room-key').removeAttr('maxlength');
		var cc = $('<div class="wg"><style>.wg{position:absolute;z-index:2;top:120px;left:40px}.wg button{width:76px;height:22px;margin-right:4px}.wg label{color:white}</style></div>').appendTo('.prt-input-form'),
			cmd1 = $('<button>自动找房间</button>').appendTo(cc),
			chk1 = $('<label><input type="checkbox" value="1" />パンデモニウム</label>').appendTo(cc),
			et = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
		cmd1.on(et,function(){
			var key = $('.frm-room-key').val(),
				pandemo = chk1.find('input').is(':checked');
			if(key.length>0){
				autoFindRoom(key,pandemo);
				cmd1.hide();
				chk1.hide();
			}
		});
	}else{
		tabtn=setTimeout(appendBtn,1000);
	}
}

appendBtn();

registerRouteChangeDestroyer(function(callback){
	clearTimeout(ttj);
	clearTimeout(tasj);
	clearTimeout(trl);
	clearTimeout(tar);
	clearTimeout(tabtn);
	callback();
});

})();