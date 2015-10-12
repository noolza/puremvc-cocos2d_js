var normalWindow = Class('WindowNormal', ViewBase);

normalWindow.prototype.initOption = function() {
    this.setOption('isHideOther', false);
    this.setOption('showAction', null);
    this.setOption('hideAction', null);
    this.setOption('resourceName', 'window_normal.json');
    this.setOption('touchMode', ViewOption.TOUCH_WINDOW);
    this.setOption('zorder', -1);
    // this.setOption('bindModel','testData');
    // this.setOption('bindUI', 'uiMain');
    // var rootView = this.facade.getView('mainScene');
    // var root = rootView.mNodeRoomList;
    // this.setOption('parent',root);
};