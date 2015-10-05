
var MyApp = Class('MyApp',puremvc.Facade);
var hall = {HallController:function(){}};
MyApp.prototype.ctor = function(key) {
};

MyApp.getInstance = function(key) {
	key = key === undefined ? 0 : key;
    var map = puremvc.Facade.instanceMap;
    if (puremvc.Facade.instanceMap[key] == null) {
    	var app = new MyApp(key);
    	puremvc.Facade.instanceMap[key] = app;
    } 

    return puremvc.Facade.instanceMap[key];
};

MyApp.prototype.run = function() {
	cc.log('game start');
    this._registeCommand();
    
    this.trigger('C_Startup');
};

MyApp.prototype._registeCommand = function() {
    var classMgr = puremvc.ClassManager;
    for(var key in classMgr){
        if(classMgr[key].super == puremvc.SimpleCommand){
            this.registerCommand(key,classMgr[key]);
            cc.log('registerCommand:'+key);
        }
    }
    this.registerCommand('C_ShowWindow',ShowViewCommand);
    this.registerCommand('C_HideWindow',ShowViewCommand);
    this.registerCommand('C_RunScene',ShowViewCommand);
};

MyApp.prototype.registerViewObserver = function(notifierName,view){
    var observer = new puremvc.Observer(view.handleNotification, view);
    this.view.registerObserver(notifierName, observer);
};

MyApp.prototype.trigger = function (notifierName) {
    if(this.view.observerMap[notifierName] == null){
        throw new Error('[MyApp.trigger] command not find :' + notifierName);
    }
    var args = Array.prototype.slice.call(arguments,1);
    if(args.length == 1){
        args = args[0];
    }
    this.sendNotification(notifierName,args,null);
};

MyApp.prototype.getView = function(id) {
    return this.retrieveMediator(id);
};

MyApp.prototype.removeView = function(view,callback) {
    view = typeof(view) == 'string' ? this.getView(view) : view;
    if(!view){
        cc.warn('[removeView] view is not exist ' + typeof(view) == 'string' ? view : '');
        return ;
    }
    if(view.getOption('isAutoRelease')){
        this.removeMediator(view.getMediatorName());
    }
    ViewTransition.execute(view, false, callback);
};

MyApp.prototype.getProxy = function(dataName) {
    var proxy = this.retrieveProxy(dataName);
    if (proxy == null) {
    	var classRef = puremvc.ClassManager[dataName];
    	if(classRef){
    		proxy = new classRef(dataName);
    		this.registerProxy(proxy);
    	}
    }
    if(!proxy){
        throw new Error('DataProxy is undefined: '+bindModel[i]);
    }
    return proxy;
};

MyApp.prototype.showView = function(isScene,id) {
	cc.log('createView('+Array.prototype.join.call(arguments,',')+')');

    var isShow = true;
    var args = Array.prototype.slice.call(arguments, 2);
    if (args[0] && typeof(args[0]) == "boolean") {
        isShow = args[0];
    } else {
    	args.unshift(isShow);
    }

    var view = id;
    if(typeof(id) == 'string'){
        view = this.getView(id);
    } else if(!(view instanceof ViewBase)){
        throw new Error('[Error]createView arguments[1] is not string or ViewBase');
    }

    if (view == null) {                       
        view = ViewFactory.createView(id,isScene);
        view._init.apply(view,args);
    }

    if (isShow) {
        args.shift();

        if (view.isShown()) {
            view.onShow.apply(view,args);
        } else {
            ViewTransition.execute(view, true, view._onShowFinish);
            view._isShown = true;
        }

        if(!isScene){
            if(view.getOption('isHideOther')){
                if(this.currentView){
                    // this.currentView.close();
                    // this.currentView = null;
                    this.trigger('MSG_HideOtherView',view);
                }
            }
            if(view.getOption().isNormal()){
                this.currentView = view;
                cc.log('currentView: '+view.NAME);
            }
        }
    }
    return view;
};

MyApp.prototype.addView = function(id) {
    Array.prototype.unshift.call(arguments,false);
    return this.showView.apply(this,arguments);
};

MyApp.prototype.runScene = function(id) {
    Array.prototype.unshift.call(arguments,true);
    return this.showView.apply(this,arguments);
};

MyApp.prototype.error = function (msg) {
    // body...
};
