
var uiGameOver = Class("uiGameOver",ViewBase)

uiGameOver.prototype.initOption = function(){
	// this.setOption('showAction','fadeIn');
	// this.setOption('hideAction','fadeOut');
	this.setOption('resourceType','json')
	
}

uiGameOver.prototype.onCreate = function(score){
	score = score == undefined ? 0 :score;
	this.maxScore = parseInt(cc.sys.localStorage.getItem("score")) || 0;
	this.score = score;
	if(score > this.maxScore){
		this.maxScore = score;
		cc.sys.localStorage.setItem("score",score);
	}
	this.getChildByName('Panel_root/Text_score').setString(this.maxScore);

	var tips = [
		{'title':'太弱了','tip':'火星人的种子不适合在地球'},
		{'title':'好强大','tip':'好傻好天真成就了你的天真'},
		{'title':'真汉子','tip':'你在生物链里的名称叫真汉子'},
		{'title':'真变态','tip':'地球上竟然有如此变态的生物'},
		{'title':'凹凸曼','tip':'恭喜你征服了所有的地球生物'},
	]

	var tip = tips[0];
	var step = parseInt(this.score/10);
	for(var i=0;i<tips.length;i++){
		if(step <= i){
			tip = tips[i];
			break;
		}
	}
	this.getChildByName('Panel_root/Text_title').setString(tip.title);
	this.getChildByName('Panel_root/Text_tip').setString(tip.tip);
}

uiGameOver.prototype.fresh = function(  ){
	// body
	cc.log('uiGameOver fresh')

}

uiGameOver.prototype.onShown = function(  ){
	cc.log('uiGameOver onShown')

}

uiGameOver.prototype.onClose = function(  ){
	// body

}

uiGameOver.prototype.onRemoved = function(  ){
	// body
}

uiGameOver.prototype.onButtonClick = function( sender ){
	if(sender.getName() == 'Button_replay'){
		this.app.addView('uiGame');
	} else if(sender.getName() == 'Button_return'){
		this.app.addView('uiMain')
	}
}

uiGameOver.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}

