var ProtocolConfig = {};
ProtocolConfig.url = '127.0.0.1:3000';
ProtocolConfig.defaultProtocol = function(method,udid,device_hash){
    return {
        'method': method,
        'params': {
            'udid': udid,
            'device_hash':device_hash,
        }
    }
};

ProtocolConfig.login = function(name,pwd){
    return {
        'methord': 'login',
        'params': {
            'udid': this.udid,
            'name': name,
            'pwd': pwd
        }
    }
};





