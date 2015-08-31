
var MyApp = Class('MyApp',puremvc.Facade);
var hall = {HallController:function(){}};
MyApp.prototype.ctor = function(key) {
}

MyApp.getInstance = function(key) {
	key = key == undefined ? 0 : key;
    var map = puremvc.Facade.instanceMap
    if (puremvc.Facade.instanceMap[key] == null) {
    	var app = new MyApp(key);
    	puremvc.Facade.instanceMap[key] = app;
    } 

    return puremvc.Facade.instanceMap[key];
}

MyApp.prototype.run = function() {
	cc.log('game start');
    this._registeCommand();
    
    this.trigger('startupCommand');
    this.trigger('ShowView_mainScene',null,Const.VIEW_TYPE_SCENE);
}

MyApp.prototype._registeCommand = function() {
    var classMgr = puremvc.ClassManager;
    for(var key in classMgr){
        if(classMgr[key].super == puremvc.SimpleCommand){
            this.registerCommand(key,classMgr[key]);
            cc.log('registerCommand:'+key);
        } else if(classMgr[key].super == ViewBase){
            this.registerCommand('ShowView_'+key,showWindowCommand);
            cc.log('registerViewCommand:'+key);
        }
    }
}

MyApp.prototype.registerViewObserver = function(notifierName,view){
    var observer = new puremvc.Observer(view.handleNotification, view);
    this.view.registerObserver(notifierName, observer);
}

MyApp.prototype.trigger = function (notifierName) {
    if(this.view.observerMap[notifierName] == null){
        throw new Error('[MyApp.trigger] command not find :' + notifierName);
    }
    this.sendNotification.apply(this,arguments);
}

MyApp.prototype.getView = function(id) {
    return this.retrieveMediator(id);
}

MyApp.prototype.removeView = function(id) {
    this.removeMediator(id);
}

MyApp.prototype.getData = function(dataName) {
    var proxy = this.retrieveProxy(dataName);
    if (proxy == null) {
    	var classRef = puremvc.ClassManager[dataName];
    	if(classRef){
    		proxy = new classRef();
    		this.registerProxy(proxy);
    	}
    }
    return proxy;
}

MyApp.prototype.showView = function(isScene,id) {
	cc.log('createView('+Array.prototype.join.call(arguments,',')+')');

    var isShow = true
    var args = Array.prototype.slice.call(arguments, 2);
    if (args[0] && typeof(args[0]) == "boolean") {
        isShow = args[0]
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
        var root = null;
        if (isScene) {
        	root = new cc.Scene();
            this.runningScene = root;
        }
        var arr = id.split('_');
        var classRef = puremvc.ClassManager[arr[0]];
        
        if (!classRef) {
            cc.log('[Warn]createView: view class not find: ' + arr[0]);
            view = new ViewBase(arr[0],root);
        } else {
        	view = new classRef(arr[0],root);
        }

        this.registerMediator(view);
        view._init.apply(view, args);
    }

    if (isShow) {
        args.shift();
    	view.show.apply(view,args);
        if(!isScene){
            if(view.getOption('isHideOther')){
                if(this.currentView){
                    this.currentView.close();
                    this.currentView = null;
                }
            }
            if(view.getOption('mode') === ViewBase.UIMODE_NORMAL){
                this.currentView = view;
                cc.log('currentView: '+view.NAME)
            }
        }
    }
    return view;
}

MyApp.prototype.addView = function(id) {
    Array.prototype.unshift.call(arguments,false);
    return this.showView.apply(this,arguments);
}

MyApp.prototype.runScene = function(id) {
    Array.prototype.unshift.call(arguments,true);
    return this.showView.apply(this,arguments);
}

MyApp.prototype.error = function (msg) {
    // body...
}
