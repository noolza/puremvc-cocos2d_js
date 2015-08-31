var startupCommand = Class('startupCommand',puremvc.SimpleCommand)

startupCommand.prototype.execute = function(){
	AudioMgr.init();
}

