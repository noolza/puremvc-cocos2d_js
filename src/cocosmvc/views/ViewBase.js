var ViewBase = Class("ViewBase", puremvc.Notifier);

ViewBase.prototype.ctor = function(id,parent) {
    this._isShown = false;
    this._notifications = [];
    this._id = id;
    this.viewOption = new ViewOption();
    this.setOption('resourceName',id);
    if(parent){
        this.setOption('parent',parent);
    }
}

ViewBase.prototype.onRegister = function() {
    this.facade = this.getFacade();
    if (this.initOption) {
        this.initOption();
    }
}

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

    // auto getData and bind notifier
    var bindModel = this.getOption('bindModel')
    if (bindModel != null) {
        if (typeof(bindModel) == 'string') {
            bindModel = [bindModel]
        }
        for (var i = 0; i < bindModel.length; i++) {
            this.listen(bindModel[i])
            this.getFacade().getData(bindModel[i]);
        }
    }
}

ViewBase.prototype.needTouch = function() {
    return this.onTouchBegan || this.onTouchMoved || this.onTouchEnded || this.getOption('isClickClose') || this.getOption('canDrag');
}

ViewBase.prototype.getOption = function(key) {
    if(!key) {
        return this.viewOption;
    }
    return this.viewOption[key];
}

ViewBase.prototype.setOption = function(key, value) {
    this.viewOption[key] = value;
}

ViewBase.prototype.show = function() {
    if (this._isShown) {
        this.onShow();
    } else {
        ViewTransition.execute(this, true, this._onShowFinish)
        this._isShown = true
    }
}

ViewBase.prototype.close = function() {
    if (this.autoHideTime) {
        this.autoHideTime = this.getOption('autoHideTime');
    }
    if (this.getOption('isAutoRelease')) {
        this.getFacade().removeMediator(this.NAME);
    }

    this.onClose && this.onClose();
    ViewTransition.execute(this, false, this._onShowFinish);
    var bindUI = this.getOption('bindUI');
    if(bindUI){
        this.trigger('HideWindow',[bindUI]);
    }
}

ViewBase.prototype.onShow = function() {}

ViewBase.prototype._onShowFinish = function(isShow) {
    cc.log(this.NAME + ' showFinish ' + isShow)

    if (!isShow) {
        this.onClosed && this.onClosed()

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
            this.trigger('ShowWindow',[bindui]);
        }
    }
}

ViewBase.prototype.addChild = function(child, zorder, tag) {
    this.viewComponent.addChild(child, zorder, tag)
}

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
}

ViewBase.prototype.getRoot = function() {
    return this.viewComponent.getRoot();
}

ViewBase.prototype.getMediatorName = function() {
    return this._id;
}

ViewBase.prototype.isShown = function() {
    return this._isShown;
}

ViewBase.prototype.getChildByName = function(name, root) {
    return this.getViewComponent().findChild(name, root);
}

ViewBase.prototype.setViewComponent = function(component) {
    this.viewComponent = component;
}

ViewBase.prototype.getViewComponent = function() {
    return this.viewComponent;
}

ViewBase.prototype.listen = function(notifierName) {
    
    if (this._notifications.indexOf(notifierName) >= 0) {
        cc.log('[Warn] already listen ' + notifierName);
        return;
    } else if (this.facade) {
        this.facade.registerViewObserver(notifierName, this);
        this._notifications.push(notifierName)
    }

}

ViewBase.prototype.trigger = function(notifierName) {
    this.facade.trigger.apply(this.facade, arguments);
}

// override

ViewBase.prototype.listNotificationInterests = function() {
    return this._notifications;
}

//onRemoveMediator
ViewBase.prototype.onRemove = function() {}

// ViewBase.prototype.onCreate = function(){ }
// ViewBase.prototype.onClose = function(){ }
// ViewBase.prototype.handleNotification = function(notification){ }