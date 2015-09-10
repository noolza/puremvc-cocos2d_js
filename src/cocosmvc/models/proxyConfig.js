var ProxyConfig = {
    'loginUrl': 'http://127.0.0.1:3000',
    'payUrl': '127.0.0.1:40001'
}

ProxyConfig.login = function(name, pwd) {
    return {
        'name': name,
        'pwd': pwd
    };
}

ProxyConfig.getParams = function(id) {
    var params = {};
    params.method = id;
    params.params = this[id] && this[id]() || {};
    sendData = AESEncrypt(JSON.stringify(params), Const.CRYPTO_CODE);
    return sendData;
}