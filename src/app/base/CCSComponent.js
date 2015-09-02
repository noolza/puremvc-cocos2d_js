var Component = cc.Layer.extend({
    ctor: function(resourceFilename,delegate,viewType) {
        this._super();
        this._viewType = viewType || 'json';
        this._resourceFilename = resourceFilename + '.' + this._viewType;
        this.NAME = resourceFilename;
        if(delegate) {
        	this.setDelegate(delegate);
        }
        
        this.createResource();
    },
    onEnter : function() {
	    this._super();
	    cc.log(this._delegate.NAME + ' onEnter')
	    if (this._delegate.onUpdate) {
	        this.scheduleUpdate();
	    }
	}
})

Component.prototype.createResource = function() {
	cc.log(this._resourceFilename);

    if(this._viewType == 'json'){
        var readObj = ccs.load('res/sd_other/' + this._resourceFilename);
        var root = readObj.node;
        if (!root) {
            root = new cc.Node();
        }  
        this.addChild(root);
        if(this._delegate){
            this.bindEvent(root)
        }
    } else if(this._viewType == 'ccbi'){
        
    }
    LogNodesName(this);
}

Component.prototype.update = function(delta) {
    {
        this._delegate.onUpdate(delta);
    }
};

Component.prototype.setDelegate = function(delegate) {
    this._delegate = delegate;
    this.isScene = delegate.getOption('mode') == ViewBase.MODE_SCENE;
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
    cc.log('touchMoved ' + this._resourceFilename)
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchBegan && this._delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
}

Component.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this._resourceFilename + delta.x + ',' + delta.y)

    return this._delegate.onTouchEvent(delta, 'moved', target)
}

Component.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this._resourceFilename)

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEvent(locationInNode, 'ended', target)
}

Component.prototype.addChild = function(child, order, tag) {
    if (this._resourceNode != null) {
        this._resourceNode.addChild(child, order || 0, tag || 0)
    } else {
    	this._resourceNode = child;
        cc.Layer.prototype.addChild.call(this, child, order || 0, tag || 0);
    }
}

Component.prototype.findChild = function(name, root) {
    root = root || this._resourceNode
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

Component.prototype.buttonEvent = function(sender,event) {
    this._delegate.buttonClick(sender,event);
}
Component.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}
Component.prototype.valueChangedEvent = function( sender,event ){
	cc.log(sender.name + event)
}
Component.prototype.checkBoxEvent = function( sender,event ){
	cc.log(sender.name + event)
}
Component.prototype.scrollEvent = function( sender,event ){
	cc.log(sender.name + event)
}
Component.prototype.onPageEvent = function( sender,event ){
	cc.log(sender.name + event)
}

Component.prototype.bindEvent = function(root, owner) {
	owner = owner || this;
    var children = root.getChildren();
    for (var i = 0; i < children.length; i++) {
        if (children[i] instanceof ccui.Button && owner._delegate.buttonClick) {
            children[i].addTouchEventListener(owner.buttonEvent, owner);
        } else if (children[i] instanceof ccui.CheckBox && owner._delegate.checkBoxEvent) {
            children[i].addEventListener(owner.checkBoxEvent, owner)
        } else if (children[i] instanceof ccui.Slider && owner._delegate.valueChangedEvent) { // || children[i] instanceof ccui.LoadingBar)
            children[i].addEventListener(owner.valueChangedEvent, owner);
            children[i].addTouchEventListener(owner.buttonEvent, owner);
        } else if (children[i] instanceof ccui.TextField && owner._delegate.textInputEvent) {
            children[i].addTouchEventListener(owner.textInputEvent, owner);
        } else if (children[i] instanceof ccui.ScrollView) {
        	if(owner._delegate.scrollEvent){
	            children[i].addEventListener(owner.scrollEvent, owner);
        	}
            this.bindEvent(children[i], owner);
        } else if (children[i] instanceof ccui.PageView) {
        	if(owner._delegate.onPageEvent){
	            children[i].addEventListener(owner.onPageEvent, owner);
        	}
            this.bindEvent(children[i], owner);
        } else {
            this.bindEvent(children[i], owner);
        }
    }
}


Component.prototype.getRoot = function() {
    return this._resourceNode
}

Component.prototype.getChildByTag = function(tag) {
    return this._resourceNode.getChildByTag(tag)
}

Component.prototype.remove = function() {
    this.touchEnabled(false);
    this.unschedule();
    this._resourceNode.removeFromParent()
    this._resourceNode = null
}

Component.prototype.onEnterTransitionDidFinish = function() {
    cc.log(this._resourceFilename + ' onEnterTransitionDidFinish')
    if (this.isScene) {
        this._delegate._onShowFinish(true)
    }
}

Component.prototype.onExit = function() {
    cc.log('onExit ' + this._resourceFilename)
    // this.unschedule();
    // cc.eventManager.removeListener(this._touchListener)
}
Component.prototype.onExitTransitionDidStart = function() {}
Component.prototype.onCleanup = function() {}