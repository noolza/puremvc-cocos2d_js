var ViewTransition = {};

ViewTransition.moveFromBtm = function(node, callback) {
    node.setVisible(true);
    node.setPosition(0, -cc.winSize.height);
    return cc.moveTo(0.5, cc.p(0, 0));
};

ViewTransition.moveFromTop = function(node, callback) {
    node.setVisible(true);
    node.setPosition(0, cc.winSize.height);
    return cc.moveTo(0.5, cc.p(0, 0));
};

ViewTransition.moveToBtm = function(node, callback) {
    node.setPosition(0, 0);
    return cc.moveTo(0.5, cc.p(0, -cc.winSize.height));
};

ViewTransition.fadeIn = function(node) {
    node.setVisible(true);
    node.setOpacity(0);
    return cc.fadeIn(0.5);
};

ViewTransition.fadeOut = function(node) {
    node.setVisible(true);
    return cc.fadeOut(0.5);
};

ViewTransition.sceneFade = function(node) {
    var transition = new cc.TransitionFade(0.5, node, cc.color(0, 0, 0));
    return transition;
};

/**
 * [execute description] run a node action
 * @Author lihuiqun
 * @param  {!cc.Node} node
 * @param  {!String} actionId
 * @param  {?Function} callback
 * @param  {?Object} owner
 * @return {void}
 */
ViewTransition.execute = function(node, actionId, callback, owner) {
    var actionFunc = ViewTransition[actionId];
    if (actionFunc == null) {
        throw new Error('[ViewTransition] action is undefined :' + actionId);
    }
    var action = actionFunc(node);
    if (!action) {
        throw new Error('[ViewTransition] action is undefined :' + actionId);
    }
    if(node instanceof cc.Scene){
        /** 
         * @see ViewBase.setOption('showAction')
         * @see ViewOption.showAction
         */
        if(!(action instanceof cc.Scene)){
            throw new Error('[ViewTransition] action typeError cc.TransitionScene :' + actionId);
        }
        cc.director.runScene(action);
    } else {
        if (callback) {
            action = cc.sequence(action, cc.callFunc(function() {
                callback.apply(owner);
            }));
        }
        node.runAction(action);
    }
};