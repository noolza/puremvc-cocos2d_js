var showWindowCommand = Class('showWindowCommand',puremvc.SimpleCommand)

showWindowCommand.prototype.execute = function(notification){
    var name = notification.getName();
    var viewId = name.split('_')[1];
    if(!viewId) {
    	throw new Error('notification name is wrong '+name);
    }
    var params = notification.getBody() || [];
    params.unshift(viewId);
    var viewType = notification.getType();
    params.unshift(viewType == Const.VIEW_TYPE_SCENE);
	this.facade.showView.apply(this.facade,params);
}
