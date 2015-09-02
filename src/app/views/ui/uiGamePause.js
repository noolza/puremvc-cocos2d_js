
var uiGamePause = Class("uiGamePause",ViewBase)

uiGamePause.prototype.initOption = function(){
	this.setOption('isHideOther',false);
	this.setOption('mode',ViewBase.MODE_MODEL);
}

uiGamePause.prototype.onCreate = function(  ){

}

uiGamePause.prototype.fresh = function(  ){
	// body
	cc.log('uiGamePause fresh')

}

uiGamePause.prototype.onShown = function(  ){
	cc.log('uiGamePause onShown')

}

uiGamePause.prototype.onClose = function(  ){
	// body

}

uiGamePause.prototype.onRemoved = function(  ){
	// body
}

uiGamePause.prototype.onButtonClick = function( sender ){
	if(sender.getName() == 'Button_play'){
		this.close();
		this.app.getView('uiGame').play();
	} else if(sender.getName() == 'Button_return'){
		this.close();
		this.app.addView('uiMain')
	}
}

uiGamePause.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}

