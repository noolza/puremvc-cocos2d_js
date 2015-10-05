var ShowViewCommand = Class('C_ShowView', puremvc.SimpleCommand);
/**
 * @Author lihuiqun
 * @Time   2015-10-06T00:40:18+0800
 * @Disc   trigger('C_HideWindow','uiId')
 *         trigger('C_ShowWindow','uiId',param0,arg_)
 *         sendNotification('C_RunScene','sceneId',type);
 * @param  {[facade.Notification]} 
 */
ShowViewCommand.prototype.execute = function(notification) {
    var name = notification.getName();
    var params = notification.getBody();
    if(typeof(params) == 'string'){
        params = [params];
    }
    var viewId = params[0] ;
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