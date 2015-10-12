/**
 * [ViewBase description] view base class
 * @author lihuiqun
 * @Time   2015-10-10
 */
var ViewBase = Class("ViewBase", puremvc.Notifier);

/**
 * [ctor description] construction
 * @Author lihuiqun
 * @static
 * @param  {!String=} id
 * @return {void}
 */
ViewBase.prototype.ctor = function(id, parent) {
    this._id = id;
    this._isShown = false;
    this.root = null;
    this._notifications = ['MSG_HideOtherView'];

    this.viewOption = new ViewOption();
    if (parent) {
        this.setOption('parent', parent);
    }
    this.initOption && this.initOption();
};

/**
 * [onRegister description] Called by the View when the Mediator is registered
 * @see MyApp.addView;
 * @see facade.registerMediator
 * @Author lihuiqun
 * @return {void}
 */
ViewBase.prototype.onRegister = function() {
    this.facade = this.getFacade();
};

/**
 * [init description] init
 * @param  {!Boolean} isShow
 * @param  {opt_args} custom params
 * @return {void}
 */
ViewBase.prototype.init = function(isShow, opt_args) {
    cc.log('ViewInit(' + Array.prototype.join.call(arguments, ',') + ')');
    var resourceFile = this.viewOption.getResourceFile();
    var viewComponent = Component.create(resourceFile, this);
    this.root = viewComponent;
    this.setViewComponent(viewComponent);
    
    if (!isShow) {
        this.viewComponent.setVisible(false);
    }

    this._setupMode();

    var initPos = this.getOption('initPosition');
    var root = this.viewComponent.getRoot();
    if (!initPos) {
        initPos = cc.p((cc.winSize.width - root.width) / 2, (cc.winSize.height - root.height) / 2);
    }
    root.setPosition(initPos);

    if (this.onCreate) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.onCreate.apply(this, args);
    }
};

ViewBase.prototype._setupMode = function() {
    var option = this.viewOption;
    var touchMode = option.touchMode;
    if (touchMode == ViewOption.TOUCH_NONE) {
        if (this.getOption('isClickClose') || this.getOption('canDrag')) {
            throw new Error('[ViewBase] touchMode error');
        }
        this.viewComponent.touchEnabled(false);
    } else {
        this.viewComponent.touchEnabled(true);
    }

    if (option.showAction == 'fadeIn' || option.hideAction == 'fadeOut') {
        this.viewComponent.setCascadeOpacityEnabled(true);
    }
};

/**
 * [getParent description] get init parent or component
 * @return {cc.Node}
 */
ViewBase.prototype.getParent = function() {
    if (this.viewComponent) {
        return this.viewComponent.parent;
    }

    var parentNode = this.getOption('parent');
    if (typeof(parentNode) == 'string') {
        var view = this.facade.getView(parentOpt);
        if (view !== null) {
            parentNode = view.getViewComponent();
            if (parentNode === null) {
                cc.warn('[ViewBase] view parent not find ' + this.NAME + ' parentName: ' + parent);
                return null;
            }
        }
    }
    return parentNode;
};

/**
 * [getOption description] get view option or key value
 * @static
 * @param  {?String} key
 * @return {Object}
 */
ViewBase.prototype.getOption = function(key) {
    if (!key) {
        return this.viewOption;
    }
    return this.viewOption[key];
};

/**
 * [setOption description]
 * @static
 * @param  {!String} key
 * @param  {Object} value
 */
ViewBase.prototype.setOption = function(key, value) {
    this.viewOption[key] = value;
};

/**
 * [close description] hide or remove self
 * @return {void}
 */
ViewBase.prototype.close = function() {
    if (this.autoHideTime) {
        this.autoHideTime = this.getOption('autoHideTime');
    }
    this.getFacade().removeView(this, this._onShowFinish);
    this.onClose && this.onClose();
    var bindUI = this.getOption('bindUI');
    if (bindUI) {
        this.trigger('C_HideWindow', [bindUI]);
    }
};

/**
 * [onShow description]
 * @param  {?var_args} opt_args custom params
 * @return {void}
 */
ViewBase.prototype.onShow = function(opt_args) {};

/**
 * [onShowFinish description] when show action finish do
 * @param  {?var_args} opt_args custom params
 * @return {void}
 */
ViewBase.prototype.onShowFinish = function(opt_args) {
    cc.log(this.NAME + ' showFinish ');
    this.onShown && this.onShown();

    var bindui = this.getOption('bindUI');
    if (bindui) {
        var bindArr = typeof(bindui) == 'string' ? [bindui] : bindui;
        for (var i = 0; i < bindArr.length; i++) {
            this.trigger('C_ShowWindow', bindArr[i]);
        }
    }
};

/**
 * [onShowFinish description] when hide action finish do
 * @return {void}
 */
ViewBase.prototype.onHideFinish = function() {
    cc.log(this.NAME + ' hideFinish ');
    this.onClosed && this.onClosed();

    if (this.getOption('isAutoRelease')) {
        this.viewComponent.remove();
        this.onRelease && this.onRelease();
    } else {
        this.viewComponent.setVisible(false);
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

ViewBase.prototype.setViewComponent = function(component) {
    var parent = this.getParent();
    if (parent) {
        parent.addChild(component, this.viewOption.getZOrder(), this.getOption('tag'));
        this.viewComponent = component;
    } else {
        throw new Error(this.NAME + ' parent is undefined');
    }
};

ViewBase.prototype.playAnimation = function(actionName, callback) {
    var jsonName = this.getOption('resourceName');
    // ccs.actionManager.playActionByName(jsonName,actionName);
    ccs.actionManager.playActionByName('uiTest.json','rot');
};

ViewBase.prototype.loadFile = function(resourceFile, delegate, parent) {
    return this.viewComponent.loadFile(resourceFile, delegate, parent);
};

ViewBase.prototype.getViewComponent = function() {
    return this.viewComponent;
};

ViewBase.prototype.getRoot = function() {
    return this.viewComponent;
};

ViewBase.prototype.getMediatorName = function() {
    return this._id;
};

ViewBase.prototype.isShown = function() {
    return this._isShown;
};

ViewBase.prototype.setShown = function(state) {
    this._isShown = state;
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

ViewBase.prototype.listen = function(notifierName) {

    if (this._notifications.indexOf(notifierName) >= 0) {
        cc.log('[Warn] already listen ' + notifierName);
        return;
    }
    if (this.facade) {
        this.facade.registerViewObserver(notifierName, this);
    }
    this._notifications.push(notifierName);
};

ViewBase.prototype.trigger = function(notifierName) {
    this.facade.trigger.apply(this.facade, arguments);
};

ViewBase.prototype.listNotificationInterests = function() {
    return this._notifications;
};

ViewBase.prototype.handleNotification = function(notification) {
    if (notification.getName() == 'MSG_HideOtherView' && this != notification.getBody() && this.viewOption.isNormal()) {
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