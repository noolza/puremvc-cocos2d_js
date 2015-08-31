
var uiLog = Class("uiLog",ViewBase)

uiLog.prototype.initOptions = function(){
	this.setOption('isHideOther',false);
	this.setOption('mode',ViewBase.MODE_TRANSPARENTS);
	this.setOption('showAction',null);
	this.setOption('hideAction',null);
	this.setOption('canDrag',true);

	var rootView = this.app.getView('mainScene');
	var root = rootView.mNodeRoomList;
	this.setOption('parent',root);
}

uiLog.prototype.onCreate = function(){
	var scaleSprite = cc.Scale9Sprite.createWithSpriteFrameName('btn_ad_normal.png');
    var editBox = cc.EditBox.create(cc.size(200,40), scaleSprite);
    editBox.x+= 100;
    editBox.y+= 20;
    editBox.setDelegate(this);
	this.toolRoot.addChild(editBox);
	this.listen('log');
	this.logs = [];

	this.lblRoot = cc.Node.create();
	this.mScroll.addChild(this.lblRoot);
	this.posY = 0;
}

uiLog.prototype.fresh = function(){
	// body
	cc.log('uiLog fresh')

}

uiLog.prototype.onShown = function(){
	cc.log('uiLog onShown')
    this.trigger('log','test','log');	
}

uiLog.prototype.onClose = function(){
	// body

}

uiLog.prototype.onRemoved = function(){
	// body
}

uiLog.prototype.onButtonClick = function( sender ){
	cc.log(sender.tag)
}

uiLog.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}

uiLog.prototype.editBoxEditingDidBegin = function (sender) {

}

uiLog.prototype.editBoxEditingDidEnd = function (sender) {
	this.phoneNumber = sender.getString();
	cc.log(sender.getString());
    this.trigger('log',sender.getString(),'error');
    this.trigger('log',sender.getString(),'warn');
}

uiLog.prototype.editBoxTextChanged = function (sender, text) {
	// this.phoneNumber = text;
}

uiLog.prototype.editBoxReturn = function (sender) {
	cc.log(sender.getString());
	
}

ViewBase.prototype.handleNotification = function(notification){ 
	var type = notification.getType();
	var color = cc.color.WHITE;
	if(type == 'warn'){
		color = cc.color.ORANGE;
	}
	if(type == 'error'){
		color = cc.color.RED;
	}
	this.logs.push(notification.getBody());
	var lbl = cc.LabelTTF.create(notification.getBody(),'Arial',18);
	lbl.setAnchorPoint(cc.p(0,1));
	lbl.setColor(color);
	this.lblRoot.addChild(lbl);
	lbl.y = this.posY;
	this.posY -= lbl.height;
	this.lblRoot.y = -this.posY;
	// this.lblRoot.height = -this.posY;
	this.mScroll.setContentSize(cc.size(this.mScroll.width,-this.posY))
}