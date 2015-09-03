var ViewOption = function() {

    this.mode          = ViewOption.MODE_NORMAL;
    this.touchMode     = ViewOption.TOUCH_SCREEN;
    this.autoHideTime  = -1;
    this.showAction    = 'moveFromTop';
    this.hideAction    = 'moveToBtm';
    this.resourceType  = Const.UI_DEFAULT_TYPE;
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

ViewOption.prototype.isFloat = function(){
	return this.mode == ViewOption.MODE_FLOAT;
}

ViewOption.prototype.getZOrder = function(){
	return this.zorder || ViewOption.ZORDER++;
}

ViewOption.MODE_NORMAL  = 0;
ViewOption.MODE_FLOAT   = 1;
ViewOption.MODE_SCENE   = 3;

ViewOption.TOUCH_WINDOW = 0;
ViewOption.TOUCH_SCREEN = 1;
ViewOption.TOUCH_NONE   = 2;
ViewOption.ZORDER       = Const.ZORDER_UI;
