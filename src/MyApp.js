var MyApp = Class('MyApp', puremvc.Facade);

MyApp.getInstance = function(key) {
    key = key === undefined ? 0 : key;
    var map = puremvc.Facade.instanceMap;
    if (puremvc.Facade.instanceMap[key] == null) {
        var app = new MyApp(key);
        puremvc.Facade.instanceMap[key] = app;
    }

    return puremvc.Facade.instanceMap[key];
};

/**
 * [ctor description]
 * @Author lihuiqun
 * @constructor
 * @param  {!String} key
 */
MyApp.prototype.ctor = function(key) {

};

MyApp.prototype.run = function() {
    cc.log('game start');
    this._registeCommand();

    this.trigger('C_Startup');
};

MyApp.prototype._registeCommand = function() {
    var classMgr = puremvc.ClassManager;
    for (var key in classMgr) {
        if (classMgr[key].super == puremvc.SimpleCommand) {
            this.registerCommand(key, classMgr[key]);
            cc.log('registerCommand:' + key);
        }
    }
    this.registerCommand('C_ShowWindow', ShowViewCommand);
    this.registerCommand('C_HideWindow', ShowViewCommand);
    this.registerCommand('C_RunScene', ShowViewCommand);
};

MyApp.prototype.registerViewObserver = function(notifierName, view) {
    var observer = new puremvc.Observer(view.handleNotification, view);
    this.view.registerObserver(notifierName, observer);
};

MyApp.prototype.trigger = function(notifierName) {
    if (this.view.observerMap[notifierName] == null) {
        throw new Error('[MyApp.trigger] command not find :' + notifierName);
    }
    var args = Array.prototype.slice.call(arguments, 1);
    if (args.length == 1) {
        args = args[0];
    }
    this.sendNotification(notifierName, args, null);
};

MyApp.prototype.getView = function(id) {
    return this.retrieveMediator(id);
};

MyApp.prototype.removeView = function(view) {
    view = typeof(view) == 'string' ? this.getView(view) : view;
    if (!view) {
        cc.warn('[removeView] view is not exist ' + typeof(view) == 'string' ? view : '');
        return;
    }
    if (view.getOption('isAutoRelease')) {
        this.removeMediator(view.getMediatorName());
    }
    var node = view.getViewComponent();
    var actionId = view.getOption('showAction');
    if (actionId) {
        ViewTransition.execute(node, actionId, view.onHideFinish, view);
    } else {
        view.onHideFinish();
    }
};

MyApp.prototype.getProxy = function(dataName) {
    var proxy = this.retrieveProxy(dataName);
    if (proxy == null) {
        var classRef = puremvc.ClassManager[dataName];
        if (classRef) {
            proxy = new classRef(dataName);
            this.registerProxy(proxy);
        }
    }
    if (!proxy) {
        throw new Error('DataProxy is undefined: ' + bindModel[i]);
    }
    return proxy;
};
/**
 * [addView description] addView('viewId',args)
 *     addView('viewId',false,args)
 * @param  {!String} id
 * @param  {Boolean=true} opt_isShow
 * @param  {Object=undefined} var_args
 */
MyApp.prototype.addView = function(id, opt_isShow, var_args) {
    cc.log('createView(' + Array.prototype.join.call(arguments, ',') + ')');

    var isShow = true;
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof(args[0]) == "boolean") {
        isShow = args[0];
    } else {
        args.unshift(isShow);
    }

    var view = id;
    if (typeof(id) == 'string') {
        view = this.getView(id);
    } else if (!(view instanceof ViewBase)) {
        throw new Error('[Error]createView arguments[1] is not string or ViewBase');
    }

    if (view == null) {
        var parent = this.runningScene;
        if (!parent) {
            parent = this.runningScene = new cc.Scene();
        }

        view = ViewFactory.createView(id, parent);
        this.registerMediator(view);
        view.init.apply(view, args);
    }

    var isScene = view.isScene();
    if (!isScene) {
        if (view.getOption('isHideOther')) {
            this.trigger('MSG_HideOtherView', view);
        }
    }

    if (isShow) {
        args.shift();

        if (view.isShown()) {
            view.onShow.apply(view, args);
        } else {
            view.setShown(true);
            var actionId = view.getOption('showAction');
            var node = isScene ? view.getParent() : view.getViewComponent();
            if (actionId) {
                ViewTransition.execute(node, actionId, function() {
                    view.onShowFinish.apply(view, args);
                });
            } else {
                if (isScene) {
                    cc.director.runScene(node);
                } else {
                    view.onShowFinish.apply(view, args);
                }
            }
        }
    }
    return view;
};

MyApp.prototype.error = function(msg) {
    // body...
};