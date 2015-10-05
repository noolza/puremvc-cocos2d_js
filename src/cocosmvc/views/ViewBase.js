var ViewBase = Class("ViewBase", puremvc.Notifier);

ViewBase.prototype.ctor = function(id,parent) {
    this._isShown = false;
    this._notifications = ['MSG_HideOtherView'];
    this._id = id;
    this.viewOption = new ViewOption();
    this.setOption('resourceName',id);
    if(parent){
        this.setOption('parent',parent);
    }
};

ViewBase.prototype.onRegister = function() {
    this.facade = this.getFacade();
    if (this.initOption) {
        this.initOption();
    }
};

ViewBase.prototype._init = function(isShow) {
    cc.log('ViewInit(' + Array.prototype.join.call(arguments, ',') + ')');
    
    if (!isShow) {
        this.viewComponent.setVisible(false);
    }
    cc.log(this.NAME + ' created ');

    if (this.onCreate) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.onCreate.apply(this, args);
    }
};

ViewBase.prototype.needTouch = function() {
    if(this.getOption('touchMode') == ViewOption.TOUCH_NONE){
        return false;
    }
    return this.onTouchBegan || this.onTouchMoved || this.onTouchEnded || this.getOption('isClickClose') || this.getOption('canDrag');
};

ViewBase.prototype.getParent = function(){
    if(this.viewComponent){
        return this.viewComponent.parent;
    }
    var parent = this.parent;
    if (typeof(parent) == 'string') {
        var view = this.facade.getView(parent);
        if (view !== null) {
            parent = view.getViewComponent();
            if (parent === null) {
                cc.log('[ViewBase] view parent not find ' + this.NAME + ' parentName: ' + parent);
            }
        } else {
            parent = null;
        }
    }
    if (parent == null) { 
        parent = this.facade.runningScene;
    }
    return parent;
};

ViewBase.prototype.getOption = function(key) {
    if(!key) {
        return this.viewOption;
    }
    return this.viewOption[key];
};

ViewBase.prototype.setOption = function(key, value) {
    this.viewOption[key] = value;
};

ViewBase.prototype.close = function() {
    if (this.autoHideTime) {
        this.autoHideTime = this.getOption('autoHideTime');
    }
    this.getFacade().removeView(this,this._onShowFinish);
    this.onClose && this.onClose();
    var bindUI = this.getOption('bindUI');
    if(bindUI){
        this.trigger('C_HideWindow',[bindUI]);
    }
};

ViewBase.prototype.onShow = function() {};

ViewBase.prototype._onShowFinish = function(isShow) {
    cc.log(this.NAME + ' showFinish ' + isShow);

    if (!isShow) {
        this.onClosed && this.onClosed();

        if (this.getOption('isAutoRelease')) {
            this.viewComponent.remove();
            this.onRelease && this.onRelease();
        } else {
            this.viewComponent.setVisible(false);
        }
    } else {
        if (this.onShown) {
            this.onShown();
        }
        var bindui = this.getOption('bindUI');
        if (bindui) {
            this.trigger('C_ShowWindow',bindui);
        }
    }
};

ViewBase.prototype.addChild = function(child, zorder, tag) {
    this.viewComponent.addChild(child, zorder, tag);
};

ViewBase.prototype.buttonClick = function(sender, event) {

    cc.log('ButtonClick: sender:' + (sender.name || sender.tag) + " event: " + event);
    if (event == ccui.Widget.TOUCH_ENDED) {
        this.onButtonClick && this.onButtonClick(sender);
    } else if (event == ccui.Widget.TOUCH_BEGAN) {
        // this.buttonClickAction(sender);
        AudioMgr.playEffect(res.okWav);
        this.onButtonBegan && this.onButtonBegan(sender, event);
    } else if (event == ccui.Widget.TOUCH_CANCELED) {
        this.onButtonCanceled && this.onButtonCanceled(sender, event);
    }
};

ViewBase.prototype.getRoot = function() {
    return this.viewComponent.getRoot();
};

ViewBase.prototype.getMediatorName = function() {
    return this._id;
};

ViewBase.prototype.isShown = function() {
    return this._isShown;
};

ViewBase.prototype.isScene = function() {
    return this.viewOption.isScene();
};

ViewBase.prototype.getChildByName = function(name, root) {
    return this.getViewComponent().findChild(name, root);
};

ViewBase.prototype.getChildByTag = function(tag, root) {
    return this.getViewComponent().getChildByTag(tag, root);
};

ViewBase.prototype.setViewComponent = function(component) {
    this.viewComponent = component;
};

ViewBase.prototype.getViewComponent = function() {
    return this.viewComponent;
};

ViewBase.prototype.listen = function(notifierName) {
    
    if (this._notifications.indexOf(notifierName) >= 0) {
        cc.log('[Warn] already listen ' + notifierName);
        return;
    } else if (this.facade) {
        this.facade.registerViewObserver(notifierName, this);
        this._notifications.push(notifierName);
    }

};

ViewBase.prototype.trigger = function(notifierName) {
    this.facade.trigger.apply(this.facade, arguments);
};

ViewBase.prototype.listNotificationInterests = function() {
    return this._notifications;
};

ViewBase.prototype.handleNotification = function(notification){ 
    if(notification.getName() == 'MSG_HideOtherView' && this != notification.getBody() && this.viewOption.isNormal()){
        this.close();
    }
    this.onMessage && this.onMessage(notification);
};
//onRemoveMediator
ViewBase.prototype.onRemove = function() {};

// override
// ViewBase.prototype.onCreate = function(){ }
// ViewBase.prototype.onClose = function(){ }
// ViewBase.prototype.onMessage = function(notification){};
