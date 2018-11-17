
//共斗开任务，第一个参数为难度，第二个参数为大关卡，第三个参数为小关卡
//难度1为Normal，2为Hard，3为Extra
//如要开启H2-1，则参数应填(2,2,1)
coopraidOpenMission(3,1,3);

function coopraidOpenMission(b,m,s){
	//选择Normal, Hard, Extra
	function selectDifficult(difficult){
		$('.prt-stage-toggle div[data-difficulty='+difficult+']').trigger(tapEvent);
	}

	//检查任务列表是否打开
	var moPrtStageArea = new MutationObserver(function(ms){
		openStage(m);
	});
	moPrtStageArea.observe($('.prt-stage-list').get(0),{childList:true});

	//选择大关卡，如果该关卡不在列表，就点下一页
	function openStage(stage){
		var btnStage = $('.btn-stage-detail[data-stage-id='+stage+']');
		if(btnStage.size()>0){
			btnStage.trigger(tapEvent);
		}else{
			$('.btn-forward').trigger(tapEvent);
		}
	}

	//检查是否有弹出窗口，若弹出窗口为选择小关卡，则点击小关卡
	var moPop = new MutationObserver(function(ms){
		if($('.pop-stage-detail').size()>0){
			$('.prt-stage-quest>div:nth-child('+s+') .btn-set-quest').trigger(tapEvent);
		}
	});
	moPop.observe($('#pop').get(0),{childList:true});

	//检查是否有确认设置任务窗口，若有则点确定
	var moPopSecond = new MutationObserver(function(ms){
		if($('.pop-quest-detail').size()>0){
			$('.pop-quest-detail .btn-usual-ok').trigger(tapEvent);
			disconnectAll();
		}
	});
	moPopSecond.observe($('#pop-second').get(0),{childList:true});

	//任务完成后注销掉节点的监听
	function disconnectAll(){
		moPrtStageArea.disconnect();
		moPop.disconnect();
		moPopSecond.disconnect();
	}

	//正式开始
	selectDifficult(b);
}