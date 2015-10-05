
var uiLog = Class("uiLog",ViewBase);

uiLog.prototype.initOption = function(){
	this.setOption('isHideOther',false);
	// this.setOption('showAction',null);
	this.setOption('resourceName','mainScene');
	// this.setOption('hideAction',null);
	// this.setOption('isClickClose',true);
	// this.setOption('bindModel','testData');
    // this.setOption('bindUI', 'uiMain');
	// var rootView = this.facade.getView('mainScene');
	// var root = rootView.mNodeRoomList;
	// this.setOption('parent',root);
};

uiLog.prototype.onCreate = function(){
	var label = cc.LabelTTF.create('Hello world!','Arial',64);
	this.addChild(label);
	label.x = cc.winSize.width/2;
	label.y = cc.winSize.height/2;
};

uiLog.prototype.fresh = function(){
	// body
	cc.log('uiLog fresh');
};

uiLog.prototype.onShown = function(){
	cc.log('uiLog onShown');	
};

uiLog.prototype.onClose = function(){
	// body

};

uiLog.prototype.onRemoved = function(){
	// body
};

uiLog.prototype.onButtonClick = function( sender ){
	cc.log(sender.tag);
};

uiLog.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event);
};

uiLog.prototype.editBoxEditingDidBegin = function (sender) {

};

uiLog.prototype.editBoxEditingDidEnd = function (sender) {
	this.phoneNumber = sender.getString();
	cc.log(sender.getString());
    this.trigger('log',sender.getString(),'error');
    this.trigger('log',sender.getString(),'warn');
};

uiLog.prototype.editBoxTextChanged = function (sender, text) {
	// this.phoneNumber = text;
};

uiLog.prototype.editBoxReturn = function (sender) {
	cc.log(sender.getString());	
};

ViewBase.prototype.handleNotification = function(notification){ 
	
};