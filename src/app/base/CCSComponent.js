var CCSComponent = Component.extend({
    // ctor: function(delegate) {
    //     this._super(delegate);
    // }
})

CCSComponent.prototype.onTouchBegan = function(touch, event) {
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var rootRect = this._root.getBoundingBox();

    var delegate = this.getDelegate();
    var option = delegate.getOption();

    if (option.canDrag) {
        var titleRect = cc.rect(rootRect.x, rootRect.y + rootRect.height - 40, rootRect.width, 40);
        if (cc.rectContainsPoint(titleRect, locationInNode)) {
            cc.log('dragBegan:' + this.NAME);
            return true;
        }
    }
    var pointIn = cc.rectContainsPoint(rootRect, locationInNode);
    if (option.isClickClose && !pointIn) {
        cc.log('clickOutClose:' + this.NAME);
        delegate.close();
        return true;
    }

    var touchMode = option.touchMode;
    if(touchMode == ViewOption.TOUCH_WINDOW ){
        if(pointIn){
            delegate.onTouchBegan && delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
            return true;
        } else return false;
    } else if(touchMode == ViewOption.TOUCH_SCREEN){
        delegate.onTouchBegan && delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
        return true;
    } else {
        return false;
    }

    return false;
}

CCSComponent.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this.NAME + ' x:' + delta.x + ',y:' + delta.y)
    if (this.viewOption.canDrag) {
        this.x += delta.x;
        this.y += delta.y;
    }
    return this._delegate.onTouchMoved && this._delegate.onTouchMoved(delta, target);
}

CCSComponent.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this.NAME)

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEnded && this._delegate.onTouchEnded(locationInNode.x, locationInNode.y, target)
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
