var DataProxy = Class('DataProxy', puremvc.Proxy)

DataProxy.prototype.ctor = function(name, params) {
    this._params = params || {};
    this._data = null;
}

DataProxy.prototype.onRegister = function() {
    cc.log(this.getProxyName()+' onRegister');
    this.facade = this.getFacade();
    DataProxy.sendRequest(this);
}

DataProxy.prototype.getData = function(forceFresh) {
    if (forceFresh || this.data == null) {
        this.send();
    } else {
        this.sendNotification(this.getProxyName(), this._data);
    }
}

DataProxy.prototype.trigger = function(notifierName) {
    this.facade.trigger.apply(this.facade, arguments);
}

DataProxy.sendRequest = function(proxy) {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", ProxyConfig.loginUrl);
    xhr.onreadystatechange = function() {
        var status = xhr.status;
        var state = xhr.readyState;
        cc.log(proxy.getProxyName() + ' [Post] status: ' + status + ' state: ' + state);
        if (xhr.status === 200 && xhr.readyState === 4) {
            var severData = JSON.parse(xhr.response);
            if (severData.error) {
                cc.warn(proxy.getProxyName() + ' Request error: '+severData.error)
            } else {
                var result = JSON.parse(AESDecrypt(severData.result, Const.CRYPTO_CODE));
                proxy.setData(result);
                proxy.trigger(proxy.getProxyName(), result);
            }
        } else {
            cc.log(proxy.getProxyName() + ' [Post] error: ' + status + 'state: ' + state);
        }
    }
    var sendData = ProxyConfig.getParams(proxy.getProxyName());
    xhr.send(sendData);
}