//var proxyConfig = require('app.models.proxyConfig')
var DataProxy = Class('DataProxy',puremvc.Proxy)

DataProxy.prototype.ctor = function( name,params ){
	this._params = params || {};
	this._data = {};
}

DataProxy.prototype.onRegister = function() {
	this.send();
}

DataProxy.prototype.send = function(){
	var self = this;
	var xhr = new cc.XMLHttpRequest()
    xhr.responseType = cc.XMLHTTPREQUEST_RESPONSE_JSON
    xhr.open("POST", proxyConfig.loginUrl)
    var onReadyStateChange = function(){
    	var status = xhr.status
    	var state  = xhr.readyState
    	cc.log(this.NAME + ' [Post] status.' + status + 'state.' + state);
        if(xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 207)){
        	var response = xhr.response
        	if(response.error){
        		cc.log(response.error)
        	} else{
        		this._data = response
            	this.sendNotification(this.NAME,xhr.response)
        	}
        } else{
            cc.log(this.NAME + ' [Post] error.' + status + 'state.' + state)
        }
}
    xhr.registerScriptHandler(onReadyStateChange)
    xhr.send(proxyConfig.getParams(this.NAME))
}

DataProxy.prototype.getData = function( forceFresh ){
	if(forceFresh || this.data == null){
		this.send()
	} else{
		this.sendNotification(this.NAME + '_Complete',this._data)
	}
}
