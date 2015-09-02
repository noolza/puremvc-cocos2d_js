var ViewOption = function() {

    this.mode          = ViewBase.MODE_NORMAL;
    this.autoHideTime  = -1;
    this.showAction    = 'moveFromTop';
    this.hideAction    = 'moveToBtm';
    this.resourceType  = 'ccbi';
    this.isAutoRelease = true;
    this.isHideOther   = true;
    this.canDrag       = false;
    this.isClickClose  = false;
    this.parent        = null;
    this.zorder        = null;
    this.initPosition  = null;
    this.resourceName  = null;
    this.bindUI        = null;
    this.bindModel     = null;
    this.tag		   = -1;
}

ViewOption.prototype.getResourceFile = function(){
	return this.resourceName + '.' + this.resourceType;
}

ViewOption.prototype.getParent = function(facade){
	var parent = this.parent;
    if (typeof(parent) == 'string') {
        var view = facade.getView(parent);
        if (view != null) {
            parent = view.getViewComponent();
            if (parent == null) {
                cc.log('[ViewBase] view parent not find ' + this.NAME + ' parentName: ' + parent);
            }
        } else parent = null;
    }
    if (parent == null) {
        parent = facade.runningScene;
    }
    return parent;
}

ViewOption.prototype.isScene = function(){
	return this.mode == ViewOption.MODE_SCENE;
}

ViewOption.prototype.isNormal = function(){
	return this.mode == ViewOption.MODE_NORMAL;
}

ViewOption.prototype.isModel = function(){
	return this.mode == ViewOption.MODE_MODEL;
}

ViewOption.prototype.isTransparent = function(){
	return this.mode == ViewOption.MODE_TRANSPARENT;
}

ViewOption.prototype.getZOrder = function(){
	return this.zorder || ViewOption.ZORDER++;
}

ViewOption.MODE_NORMAL       = 0;
ViewOption.MODE_MODEL        = 1;
ViewOption.MODE_TRANSPARENT  = 2;
ViewOption.MODE_SCENE        = 3;
ViewOption.ZORDER            = Const.ZORDER_UI;
