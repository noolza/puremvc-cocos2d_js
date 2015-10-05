var DataProxy = Class('DataProxy', puremvc.Proxy);

DataProxy.prototype.ctor = function(name, data) {
    this.protocol = null;
};

DataProxy.prototype.onRegister = function() {
    cc.log(this.getProxyName() + ' onRegister');
    this.facade = this.getFacade();
    this.init && this.init();
};

/**
 * @Disc   getData(true,callback);
 *         getData(callback); 
 * @param  {[type]}  
 * @return {[type]}  
 */
DataProxy.prototype.getData = function(forceFresh) {
    forceFresh = typeof(forceFresh) == 'boolean' ? forceFresh : false;
    this._callback = typeof(arguments[arguments.length - 1]) == 'function' ? arguments[arguments.length - 1] : null;
    if (forceFresh || this.data === null) {
        this.trigger('CMD_RequestServer',this.getProtocol(),this._callback);
    } else {
        this.trigger(this.getProxyName(), this.data);
        this._callback && this._callback(this.data);
        this._callback = null;
    }
};

DataProxy.prototype.getProtocol = function(){
    if(!this.protocol){
        throw new Error('you must override this function or set protocol value');
    }
    return this.protocol;
    //todo...
};

DataProxy.prototype.trigger = function(notifierName) {
    this.facade.trigger.apply(this.facade, arguments);
};

DataProxy.prototype.get = function(key) {
    if (!this.data || !this.data[key]) {
        return null;
    }
    return this.data[key];
};

DataProxy.prototype.set = function(key, value, isAdd) {
    if (!this.data || !this.data[key]) {
        throw new Error(this.NAME + " set('" + key + "') ");
    }
    if (isAdd) {
        if (typeof(value) == "number" && typeof(this.data[key]) == 'number') {
            this.data[key] += value;
        } else if (this.data[key] instanceof Array) {
            this.data[key].push(value);
        } else {
            throw new Error(this.NAME + " set('" + key + "') ");
        }
    } else {
        this.data[key] = value;
    }
};