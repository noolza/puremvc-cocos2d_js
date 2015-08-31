var runSceneCommand = Class('runSceneCommand',puremvc.SimpleCommand)

runSceneCommand.prototype.execute = function(notification){
	var name = notification.getName();
    var viewId = name.split('_')[1];
    if(!viewId) {
    	throw new Error('notification name is wrong '+name);
    }
    var params = notification.getBody() || [];
    params.push(viewId);
	this.facade.runScene.apply(this.facade,params);
}
