var CCSComponent = Component.extend({
    ctor: function(resourceFile, delegate) {
        this._super(resourceFile, delegate);
    }
});

CCSComponent.prototype.loadFile = function(resourceFile, delegate, parent) {
    if (resourceFile.indexOf('.json') < 0) {
        throw new Error('file type error');
    }

    this.readObject = ccs.load(Const.UI_FILE_JSON_PATH + resourceFile);
    var readNode = this.readObject.node;
    if (readNode && delegate) {
        this.bindEvent(readNode, delegate);
    }
    parent && parent.addChild(readNode);
    cc.log('[CCSComponent] load json finish ' + resourceFile);
    return readNode;
},

/**
 * @desc playAnimation(0,10,true)
 *       playAnimation('animName',true)
 *       
 * @param  {Number or String} startIdx or name
 * @param  {Number or Boolean} endIdx or isLoop
 * @param  {?Boolean} isLoop 
 * @return {void}
 */
CCSComponent.prototype.playAnimation = function(var_opt) {
    var action = this.readObject.action;
    this._root.runAction(action);
    var animName = typeof(var_opt) == 'string' ? var_opt : null;
    var isLoop = typeof(arguments[arguments.length-1]) == 'boolean' ? arguments[arguments.length-1] : false;

    if (animName) {
        action.play(animName, isLoop);
    } else {
        var start = var_opt;
        var end = arguments[1];
        action.gotoFrameAndPlay(start, end, isLoop);
    }
};

CCSComponent.prototype.bindEvent = function(root, delegate) {
    var children = root.getChildren();
    for (var i = 0; i < children.length; i++) {
        if (children[i] instanceof ccui.Button && delegate.buttonClick) {
            children[i].addTouchEventListener(delegate.buttonClick, delegate);
        } else if (children[i] instanceof ccui.CheckBox && delegate.checkBoxEvent) {
            children[i].addEventListener(delegate.checkBoxEvent, delegate);
        } else if (children[i] instanceof ccui.Slider && delegate.valueChangedEvent) { // || children[i] instanceof ccui.LoadingBar)
            children[i].addEventListener(delegate.valueChangedEvent, delegate);
            children[i].addTouchEventListener(delegate.buttonClick, delegate);
        } else if (children[i] instanceof ccui.TextField && delegate.textInputEvent) {
            children[i].addTouchEventListener(delegate.textInputEvent, delegate);
        } else if (children[i] instanceof ccui.ScrollView) {
            if (delegate.scrollEvent) {
                children[i].addEventListener(delegate.scrollEvent, delegate);
            }
            this.bindEvent(children[i], delegate);
        } else if (children[i] instanceof ccui.PageView) {
            if (delegate.onPageEvent) {
                children[i].addEventListener(delegate.onPageEvent, delegate);
            }
            this.bindEvent(children[i], delegate);
        } else {
            this.bindEvent(children[i], delegate);
        }
    }
},

CCSComponent.prototype.onTouchBegan = function(touch, event) {
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var rootRect = this._root.getBoundingBox();

    var delegate = this.getDelegate();
    var option = delegate.getOption();
    cc.log('onTouchBegan:' + this.NAME);
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
    if (touchMode == ViewOption.TOUCH_WINDOW) {
        if (pointIn) {
            delegate.onTouchBegan && delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
            return true;
        } else {
            cc.log('point out');
            return false;
        }
    } else if (touchMode == ViewOption.TOUCH_SCREEN) {
        delegate.onTouchBegan && delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
        return true;
    } else {
        return false;
    }

    return false;
};

CCSComponent.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this.NAME + ' x:' + delta.x + ',y:' + delta.y);
    if (this.viewOption.canDrag) {
        this.x += delta.x;
        this.y += delta.y;
    }
    return this._delegate.onTouchMoved && this._delegate.onTouchMoved(delta, target);
};

CCSComponent.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this.NAME);

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEnded && this._delegate.onTouchEnded(locationInNode.x, locationInNode.y, target);
};

Component.prototype.findChild = function(name, root) {
    root = root || this._root;
    var names = name.split('/');
    for (var i = 0; i < names.length; i++) {
        root = root.getChildByName(names[i]);
        if (root == null) {
            cc.log('[Warn] node not find ' + names[i]);
            return null;
        }
    }
    return root;
};

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