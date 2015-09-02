var startupCommand = Class('startupCommand',puremvc.SimpleCommand)

startupCommand.prototype.execute = function(){
	AudioMgr.init(this.facade);
	UIFactory.init('res/',this.facade);
}

