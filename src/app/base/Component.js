var Component = cc.Layer.extend({
    ctor: function(delegate) {
        this._super();
        if(delegate) {
        	this.setDelegate(delegate);
            this.NAME = delegate._id;
        }
    },
    onEnter : function() {
	    this._super();
	    cc.log(this._delegate.NAME + ' onEnter')
	    if (this._delegate.onUpdate) {
	        this.scheduleUpdate();
	    }
        this.setupMode();
	}
})
Component.extend = cc.Class.extend;

Component.prototype.setupMode = function() {
    var option = this._delegate.getOption();
    var mode = option.mode;
    if (option.touchMode == ViewOption.TOUCH_NONE) {
        this.touchEnabled(false);
    } else {
        if (this._delegate.needTouch()) {
            this.touchEnabled(true);
        }
    }
    if (option.showAction == 'fadeIn' || option.hideAction == 'fadeOut') {
        this.setCascadeOpacityEnabled(true);
    }
};
Component.prototype.update = function(delta) {
    this._delegate.onUpdate(delta);
};
Component.prototype.getDelegate = function(delegate) {
    return this._delegate ;
}

Component.prototype.setDelegate = function(delegate) {
    this._delegate = delegate;
    this.viewOption = delegate.getOption();
    this.NAME = delegate.NAME;
}

Component.prototype.touchEnabled = function(enable) {
    if (!enable && this._touchListener) {
        cc.eventManager.removeListener(this._touchListener);
        this._touchListener = null;
        return;
    }

    this._touchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan.bind(this),
        onTouchMoved: this.onTouchMoved.bind(this),
        onTouchEnded: this.onTouchEnded.bind(this)
    });
    cc.eventManager.addListener(this._touchListener, this);
}

Component.prototype.onTouchBegan = function(touch, event) {
    cc.log('onTouchBegan ' + this.NAME)
    throw new Error('must override this function');
}

Component.prototype.onTouchMoved = function(touch, event) {
    throw new Error('must override this function');
}

Component.prototype.onTouchEnded = function(touch, event) {
    throw new Error('must override this function');
}

Component.prototype.addChild = function(child, order, tag) {
    if (this._root != null) {
        this._root.addChild(child, order || 0, tag || 0)
    } else {
    	this._root = child;
        cc.Layer.prototype.addChild.call(this, child, order || 0, tag || 0);
    }
}

Component.prototype.findChild = function(name, root) {
    root = root || this._root
    var names = name.split('/')
    for (var i = 0; i < names.length; i++) {
        root = root.getChildByName(names[i])
        if (root == null) {
            cc.log('[Warn] node not find . ' + names[i])
            return null
        }
    }
    return root
}

Component.prototype.getRoot = function() {
    return this._root
}

Component.prototype.getChildByTag = function(tag) {
    return this._root.getChildByTag(tag)
}

Component.prototype.remove = function() {
    this.touchEnabled(false);
    this.unschedule();
    this._delegate = null;
    this._root = null;
    this.removeFromParent();
}

Component.prototype.onEnterTransitionDidFinish = function() {
    cc.log(this.NAME + ' onEnterTransitionDidFinish')
    if (this._delegate.getOption().isScene()) {
        this._delegate._onShowFinish(true)
    }
}

Component.prototype.onExitTransitionDidStart = function() {}
Component.prototype.onCleanup = function() {}

// Component.prototype.textInputEvent = function( sender,event ){
//  cc.log(sender.name + event)
// }
// Component.prototype.valueChangedEvent = function( sender,event ){
//  cc.log(sender.name + event)
// }
// Component.prototype.checkBoxEvent = function( sender,event ){
//  cc.log(sender.name + event)
// }
// Component.prototype.scrollEvent = function( sender,event ){
//  cc.log(sender.name + event)
// }
// Component.prototype.onPageEvent = function( sender,event ){
//  cc.log(sender.name + event)
// }