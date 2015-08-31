var Component = cc.Layer.extend({
    ctor: function(delegate) {
        this._super();
        if (delegate) {
            this.setDelegate(delegate);
        }
    },

    onEnter: function() {
        this._super();
        cc.log(this._delegate.NAME + ' onEnter')
        if (this._delegate && this._delegate.onUpdate) {
            this.scheduleUpdate();
        }
    }
})

Component.ResourcePath = 'res/';
Component.createResource = function(resourceFile,component,parentSize) {
    cc.log('resName: ' + resourceFile);
    var nameSplit = resourceFile.split('.');
    component.NAME = nameSplit[0];
    component._resType = nameSplit[1] || Const.UI_FILE_TYPE_JSON;
    component._resourceFile = nameSplit[0] + '.' + component._resType;

    var readNode = null;
    if (component._resType == Const.UI_FILE_TYPE_JSON) {
        var readObj = ccs.load(Component.ResourcePath + component._resourceFile);
        readNode = readObj.node;
        if (readNode && component.getDelegate()) {
            Component.bindEvent(root,component);
        }
    } else if (component._resType == Const.UI_FILE_TYPE_CCBI) {
        if(!parentSize || cc.sizeEqualToSize(parentSize,cc.SizeZero())){
            parentSize = cc.winSize;
        }
        cc.BuilderReader.setResourcePath(Component.ResourcePath);
        if (jsb.fileUtils.isFileExist(component._resourceFile)) {
            readNode = cc.BuilderReader.loadWithController(component._resourceFile, component._delegate, null, parentSize);
        }
    }
    if (!readNode) {
        cc.log('[Warn]resourceFile not exist or read error ' + component._resourceFile);
        readNode = new cc.Node();
    }
    component.addChild(readNode);
    LogNodesName(component);
}

Component.bindEvent = function(root, owner) {
    var children = root.getChildren();
    var delegate = owner.getDelegate();
    for (var i = 0; i < children.length; i++) {
        if (children[i] instanceof ccui.Button && delegate.buttonClick) {
            children[i].addTouchEventListener(delegate.buttonClick, delegate);
        } else if (children[i] instanceof ccui.CheckBox && delegate.checkBoxEvent) {
            children[i].addEventListener(delegate.checkBoxEvent, delegate)
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
}

Component.prototype.update = function(delta) {
    this._delegate.onUpdate(delta);
}

Component.prototype.setDelegate = function(delegate) {
    this._delegate = delegate;
}
Component.prototype.getDelegate = function() {
    return this._delegate
}

Component.prototype.touchEnabled = function(enable) {
    if (!enable) {
        if(this._touchListener){
            cc.eventManager.removeListener(this._touchListener);
            this._touchListener = null;
        }
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
    cc.log('touchBegan ' + this.NAME)
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var pointIn = cc.rectContainsPoint(this._root.getBoundingBox(),locationInNode);
    if (this._delegate.getOption('canDrag')) {
        return pointIn;
    } else if (this._delegate.getOption('mode') == ViewBase.MODE_NORMAL) {
        if(pointIn) {
            return true;
        } else if(this._delegate.onTouchBegan) {
            return this._delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
        } 
        return false
    } else return false;
}

Component.prototype.onTouchMoved = function(touch, event) {
    var target = event.getCurrentTarget();
    var delta = touch.getDelta();
    cc.log('touchMoved ' + this.NAME + ' x:' + delta.x + ',y:' + delta.y)
    if (this._delegate.getOption('canDrag')) {
        this.x += delta.x;
        this.y += delta.y;
    }
    return this._delegate.onTouchMoved && this._delegate.onTouchMoved(delta, target)
}

Component.prototype.onTouchEnded = function(touch, event) {
    cc.log('touchEnded ' + this.NAME)

    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    return this._delegate.onTouchEnded && this._delegate.onTouchEnded(locationInNode.x,locationInNode.y, target)
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
    this._root = null;
    this._delegate = null;
    this._root.removeFromParent();
}

Component.prototype.onEnterTransitionDidFinish = function() {
    cc.log(this.NAME + ' onEnterTransitionDidFinish')
    if (this._delegate.getOption('mode') == ViewBase.MODE_SCENE) {
        this._delegate._onShowFinish(true)
    }
}

Component.prototype.onExit = function() {
    cc.log('onExit ' + this._resourceFile)
    // this.unschedule();
    // cc.eventManager.removeListener(this._touchListener)
}
Component.prototype.onExitTransitionDidStart = function() {}
Component.prototype.onCleanup = function() {}

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