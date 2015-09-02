var CCBComponent = Component.extend({
    ctor: function(delegate) {
        this._super(delegate);
    }
})

CCBComponent.prototype.onTouchBegan = function(touch, event) {
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var rootRect = this._root.getBoundingBox();

    var delegate = this.getDelegate();
    var opts = delegate.getOption();

    if (opts.canDrag) {
        var titleRect = cc.rect(rootRect.x, rootRect.y + rootRect.height - 40, rootRect.width, 40);
        if (cc.rectContainsPoint(titleRect, locationInNode)) {
            cc.log('dragBegan:' + this.NAME);
            return true;
        }
    }

    var pointIn = cc.rectContainsPoint(rootRect, locationInNode);
    if (opts.isClickClose && !pointIn) {
        cc.log('clickOutClose:' + this.NAME);
        delegate.close();
        return true;
    }

    if (opts.mode == ViewBase.MODE_NORMAL || opts.mode == ViewBase.MODE_MODEL) {
        if (delegate.onTouchBegan) {
            cc.log('normalTouchBegan:' + this.NAME);
            return delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
        }
        return true;
    }
    return false;
}

CCBComponent.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this.NAME + ' x:' + delta.x + ',y:' + delta.y)
    if (this._delegate.getOption('canDrag')) {
        this.x += delta.x;
        this.y += delta.y;
    }
    return this._delegate.onTouchMoved && this._delegate.onTouchMoved(delta, target)
}

CCBComponent.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this.NAME)

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEnded && this._delegate.onTouchEnded(locationInNode.x, locationInNode.y, target)
}

// Component.prototype.buttonEvent = function(sender, event) {
//     this._delegate.buttonClick(sender, event);
// }
// Component.prototype.textInputEvent = function(sender, event) {
//     cc.log(sender.name + event)
// }
// Component.prototype.valueChangedEvent = function(sender, event) {
//     cc.log(sender.name + event)
// }
// Component.prototype.checkBoxEvent = function(sender, event) {
//     cc.log(sender.name + event)
// }
// Component.prototype.scrollEvent = function(sender, event) {
//     cc.log(sender.name + event)
// }
// Component.prototype.onPageEvent = function(sender, event) {
//     cc.log(sender.name + event)
// }