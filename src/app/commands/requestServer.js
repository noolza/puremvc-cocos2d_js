var requestServer = Class('C_RequestServer', puremvc.SimpleCommand);
/**
 * [execute description]
 * @Author lihuiqun
 * @Time   2015-10-05T09:52:41+0800
 * @Disc   trigger('C_RequestServer','NET_login','uname','pwd',callback)
 * 		   trigger('C_RequestServer',protocol,callback)
 * 		   sendNotification('C_RequestServer',protocol,callback)
 * 		   sendNotification('C_RequestServer','NET_login',callback)
 * @param  {[Notification]}
 */
requestServer.prototype.execute = function(notification) {
    var body = notification.getBody();
    var callback = null;
    var protocol = null;

    if(body instanceof Array){
    	if (typeof(body[body.length-1]) == 'function') {
        	callback = body.pop();
    	}
    	if(typeof(body[0].method) == 'string'){
    		protocol = body[0];
    	} else if(typeof(body[0] == 'string')){
    		protocol = this.getProtocol.apply(this, body);
    	} else {
    		throw new Error('[CMD_RequestServer] arguments error');
    	}

    } else if(typeof(body.method) == 'string'){
    	protocol = body;
    	callback = notification.getType();
    } else if(typeof(body) == 'string'){
    	protocol = this.getProtocol(body);
    	callback = notification.getType();
    }
    
    this.httpRequest(protocol, callback);
};

requestServer.prototype.getProtocol = function(method, arg_) {
    var cfg = ProtocolConfig[method];
    if (!cfg) {
        throw new Error('Protocol is not exsit :' + method);
    }
    if (cfg == ProtocolConfig.defaultProtocol) {
    	var playerData = this.facade.getProxy('M_PlayerData');
    	var udid = cc.sys.localStorage.getItem("udid");
    	var device_hash = playerData.get('device_hash');
        return cfg(method,udid,device_hash);

    } else {
        var args = Array.prototype.slice.call(arguments, 1);
        return cfg.apply(ProtocolConfig, args);
    }
};

requestServer.prototype.HttpRequest = function(protocol, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", ProtocolConfig.url);
    xhr.onreadystatechange = function() {
        var status = xhr.status;
        var state  = xhr.readyState;
        if (xhr.status === 200 && xhr.readyState === 4) {
            var result = severData.result;
            result = AESDecrypt(result, Const.CRYPTO_CODE);
            result = JSON.parse(result);
            this.sendNotification('NET_Request_' + protocol.method, result);
            callback && callback(result);
        } else {
            this.sendNotification('NET_NetworkError', [status, state]);
            callback && callback(null, status, state);
        }
    };

    xhr.send(protocol);
};