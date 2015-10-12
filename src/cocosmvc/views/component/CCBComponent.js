var CCBComponent = Component.extend({
    ctor: function(delegate) {
        this._super(delegate);
    }
});

CCBComponent.prototype.loadFile = function(resourceFile, delegate,parent) {
    var parentSize = parent? parent.getContentSize() : this.getContentSize();
    if (!cc.BuilderReader.controllerClassCache['CCBProxy']) {
        cc.BuilderReader.registerController('CCBProxy', {});
    }

    var readNode = null;
    if (jsb.fileUtils.isFileExist(resourceFile)) {

        readNode = cc.BuilderReader.load(resourceFile, delegate, parentSize);
        var ccbProxy = readNode.controller;
        for (var k in ccbProxy) {
            if (typeof(ccbProxy[k]) != 'function') {
                delegate[k] = ccbProxy[k];
            }
        }
        var animationManager = readNode.animationManager;
        var documentCallbackNames = animationManager.getDocumentCallbackNames();
        var documentCallbackNodes = animationManager.getDocumentCallbackNodes();

        for (var i = 0; i < documentCallbackNames.length; i++) {
            var callbackName = documentCallbackNames[i];
            var callbackNode = documentCallbackNodes[i];

            if (delegate[callbackName] === undefined) {
                cc.log("Warning: " + callbackName + " is undefined.");
            } else {
                if (callbackNode instanceof cc.ControlButton) {
                    var documentCallbackControlEvents = animationManager.getDocumentCallbackControlEvents();
                    var btnEvent = function(sender, evt) {
                        return delegate[callbackName](sender, evt);
                    };
                    callbackNode.addTargetWithActionForControlEvents(delegate, btnEvent, documentCallbackControlEvents[i]);
                } else {
                    callbackNode.setCallback(controller[callbackName], controller);
                }
            }
        }
    }
    parent && parent.addChild(readNode);

    return readNode;
},

CCBComponent.prototype.onTouchBegan = function(touch, event) {
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

CCBComponent.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this.NAME + ' x:' + delta.x + ',y:' + delta.y)
    if (this.viewOption.canDrag) {
        this.x += delta.x;
        this.y += delta.y;
    }
    return this._delegate.onTouchMoved && this._delegate.onTouchMoved(delta, target);
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