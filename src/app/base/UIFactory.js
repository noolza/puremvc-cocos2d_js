
var UIFactory = {
    // resPath : must end with '/'
    init: function(resPath,viewClass) {
        this._resPath = resPath;
    },
    createView : function (resourceFilename, controller, parentSize) {
        cc.log('resName: ' + this._resourceFile);
        var nameSplit = resourceFilename.split('.');
        this.NAME = nameSplit[0];
        this._resType = nameSplit[1] || Const.UI_FILE_TYPE_JSON;
        this._resourceFile = nameSplit[0] + '.' + this._resType;

        var readNode = null;
        if (this._resType == Const.UI_FILE_TYPE_JSON) {
            var readObj = ccs.load(this._resPath + this._resourceFile);
            readNode = readObj.node;
            if (readNode && this._delegate) {
                this.bindEvent(root);
            }
        } else if (this._resType == Const.UI_FILE_TYPE_CCBI) {
            if (parentSize) {
                if (parentSize.width == 0 || parentSize.height == 0)
                    parentSize = cc.winSize;
            } else parentSize = cc.winSize;

            cc.BuilderReader.setResourcePath(this._resPath);
            if (jsb.fileUtils.isFileExist(this._resourceFile)) {
                readNode = cc.BuilderReader.loadWithController(this._resourceFile, controller, null, parentSize);
            }
        }
        if (!readNode) {
            cc.log('[Warn]resourceFile not exist or read error ' + this._resourceFile);
            readNode = new cc.Node();
        }
        LogNodesName(readNode, this._resType);
        return readNode;
    }
};

Component.prototype.update = function(delta) {
    this._delegate.onUpdate(delta);
};

Component.prototype.setDelegate = function(delegate) {
    this._delegate = delegate;
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
    cc.log('touchBegan ' + this.NAME)
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    if (this._delegate.getOption('canDrag')) {
        return true;
    } else if (this._delegate.onTouchBegan) {
        return this._delegate.onTouchBegan(locationInNode.x, locationInNode.y, target);
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
    return this._delegate.onTouchEnded && this._delegate.onTouchEnded(locationInNode, target)
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

Component.prototype.buttonEvent = function(sender, event) {
    this._delegate.buttonClick(sender, event);
}
Component.prototype.textInputEvent = function(sender, event) {
    cc.log(sender.name + event)
}
Component.prototype.valueChangedEvent = function(sender, event) {
    cc.log(sender.name + event)
}
Component.prototype.checkBoxEvent = function(sender, event) {
    cc.log(sender.name + event)
}
Component.prototype.scrollEvent = function(sender, event) {
    cc.log(sender.name + event)
}
Component.prototype.onPageEvent = function(sender, event) {
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
            if (owner._delegate.scrollEvent) {
                children[i].addEventListener(owner.scrollEvent, owner);
            }
            this.bindEvent(children[i], owner);
        } else if (children[i] instanceof ccui.PageView) {
            if (owner._delegate.onPageEvent) {
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