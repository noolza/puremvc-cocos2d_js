
var uiLog = Class("UILog",ViewBase);

uiLog.prototype.initOption = function(){
	this.setOption('isHideOther',false);
	this.setOption('showAction',null);
	this.setOption('resourceName','uiTest.json');
	this.setOption('touchMode',ViewOption.TOUCH_WINDOW);
	this.setOption('isClickClose',true);
    // this.setOption('bindUI', 'WindowNormal');
	// var rootView = this.facade.getView('mainScene');
	// var root = rootView.mNodeRoomList;
	// this.setOption('parent',root);
};

uiLog.prototype.onCreate = function() {
	// var label = cc.LabelTTF.create('Hello world!','Arial',64);
	// this.addChild(label);
	// var node = this.testNode;
	// for(var i=0;i<10;i++){
	// 	var node = this.loadFile('theme.json',this,this.root);
	// 	node.x = i*node.width/2;
	// }
};

uiLog.prototype.fresh = function(){
	// body
	cc.log('uiLog fresh');
};

uiLog.prototype.onShown = function(){
	cc.log('uiLog onShown');
	this.playAnimation('rot');
		
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