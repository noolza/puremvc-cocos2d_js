var ViewTransition = {};

ViewTransition.moveFromBtm = function(node,callback){
    node.setVisible(true);
    node.setPosition(0,-cc.winSize.height);
    return cc.moveTo(0.5,cc.p(0,0));
};

ViewTransition.moveFromTop = function(node,callback){
    node.setVisible(true);
    node.setPosition(0,cc.winSize.height);
    return cc.moveTo(0.5,cc.p(0,0));
};

ViewTransition.moveToBtm = function(node,callback){
    node.setPosition(0,0);
    return cc.moveTo(0.5,cc.p(0,-cc.winSize.height));
};

ViewTransition.fadeIn = function(node){
    node.setVisible(true);
    node.setOpacity(0);
    return cc.fadeIn(0.5);
};

ViewTransition.fadeOut = function(node){
    node.setVisible(true);
    return cc.fadeOut(0.5);
};

ViewTransition.sceneFade = function(node,opts){
    var transition = new cc.TransitionFade(0.5, node.getParent(), cc.color(0, 0, 0));
	cc.director.runScene(transition);
};

ViewTransition.execute = function(view,isShow,callback){
	var actKey = isShow ? 'showAction' : 'hideAction';
    var actionName = view.getOption(actKey);
    if(view.isScene() && actionName.indexOf('scene')<0){
        cc.warn('scene is assign a error action :'+actionName);
        cc.director.runScene(view.getViewComponent().getParent());
        return;
    } 
    var actionFunc = ViewTransition[view.getOption(actKey)];
    if(actionFunc == null){
        return callback.call(view,isShow);
    }
    var args = Array.prototype.slice.call(arguments,1);
    var node = view.getViewComponent();
    var action = actionFunc(node);
    if(!action) {
        return;
    }
    node.runAction(cc.sequence(action,cc.callFunc(function(){
        callback.call(view,isShow);
    })));
};

