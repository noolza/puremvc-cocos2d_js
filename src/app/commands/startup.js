var startupCommand = Class('C_Startup',puremvc.SimpleCommand);

startupCommand.prototype.execute = function(){
	AudioMgr.init(this.facade);
	ViewFactory.init(this.facade);
    this.facade.trigger('C_RunScene','mainScene');
};

