var ShowViewCommand = Class('ShowViewCommand',puremvc.SimpleCommand)

ShowViewCommand.prototype.execute = function(notification){
    var name = notification.getName();   
    var params = notification.getBody() || [];
    viewId = params[0];
    if(!viewId || typeof(viewId) != 'string') {
        throw new Error('first params is wrong '+name);
    }
    var viewType = notification.getType();
    params.unshift(viewType == Const.VIEW_TYPE_SCENE);
	this.facade.showView.apply(this.facade,params);
}
