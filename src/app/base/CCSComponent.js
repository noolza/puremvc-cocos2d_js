var CCSComponent = Component.extend({
    // ctor: function(delegate) {
    //     this._super(delegate);
    // }
})

CCSComponent.prototype.onTouchBegan = function(touch, event) {
    cc.log('touchMoved ' + this._resourceFilename)
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchBegan && this._delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
}

CCSComponent.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this._resourceFilename + delta.x + ',' + delta.y)

    return this._delegate.onTouchEvent(delta, 'moved', target)
}

CCSComponent.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this._resourceFilename)

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEvent(locationInNode, 'ended', target)
}

// CCSComponent.prototype.buttonEvent = function(sender,event) {
//     this._delegate.buttonClick(sender,event);
// }
// CCSComponent.prototype.textInputEvent = function( sender,event ){
// 	cc.log(sender.name + event)
// }
// CCSComponent.prototype.valueChangedEvent = function( sender,event ){
// 	cc.log(sender.name + event)
// }
// CCSComponent.prototype.checkBoxEvent = function( sender,event ){
// 	cc.log(sender.name + event)
// }
// CCSComponent.prototype.scrollEvent = function( sender,event ){
// 	cc.log(sender.name + event)
// }
// CCSComponent.prototype.onPageEvent = function( sender,event ){
// 	cc.log(sender.name + event)
// }
