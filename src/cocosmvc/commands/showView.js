var ShowViewCommand = Class('C_ShowView', puremvc.SimpleCommand);

ShowViewCommand.prototype.execute = function(notification) {
    var name = notification.getName();
    var params = notification.getBody() || [];
    viewId = params[0];
    if (!viewId || typeof(viewId) != 'string') {
        throw new Error('first params is wrong ' + name);
    }
    if (name == 'C_HideWindow') {
        var view = this.facade.getView(viewId);
        if (view) {
            view.close();
        }
    } else {
        var isScene = name == 'C_RunScene';
        params.unshift(isScene);
        this.facade.showView.apply(this.facade, params);
    }
};