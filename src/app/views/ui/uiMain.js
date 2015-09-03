
var uiMain = Class("uiMain",ViewBase)

uiMain.prototype.initOption = function(){
	this.setOption('resourceType','json');
	this.setOption('isHideOther',false);
	this.setOption('touchMode',ViewOption.TOUCH_NONE);
}

uiMain.prototype.onCreate = function(  ){
	// body
	// cc.log('uiMain onCreate')
	// var btn = this.getChildByName('Button_3')
	// btn.onTouch(function(event){
	// 	cc.log(event.name)
	// })
	// cc.log(tolua.type(btn))
}

uiMain.prototype.fresh = function(  ){
	// body
	cc.log('uiMain fresh')

}

uiMain.prototype.onShown = function(  ){
	cc.log('uiMain onShown')

}

uiMain.prototype.onClosed = function(  ){
	// body
	// 
}

uiMain.prototype.onRemoved = function(  ){
	// body
}

uiMain.prototype.onButtonClick = function( sender ){
	var btnName = sender.getName();
	if(btnName == 'Button_start'){
		// this.close();
		// this.getFacade().addView('uiGame');
		this.trigger('ShowWindow',['uiGame']);
	}else if(btnName = 'Button_customHead'){
		// this.close();
		// this.app.addView('uiCustomFace');
		// this.trigger('ShowWindow',['uiCustomFace']);	
	}
}

uiMain.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}
uiMain.prototype.onTouchBegan = function(x,y){
    // cc.log("onTouchBegan. ", x,y)
	return true
}
uiMain.prototype.onTouchMoved = function(x,y){
    // cc.log("onTouchMoved. ",x,y)
}
uiMain.prototype.onTouchEnded = function(x,y){
    // cc.log("onTouchEnded. ",x,y)
}
