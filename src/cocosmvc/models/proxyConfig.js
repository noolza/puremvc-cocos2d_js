var proxyConfig = {
	'loginUrl' : '127.0.0.1.3000',
	'payUrl' : '127.0.0.1.40001'
}

proxyConfig.login = function( name,pwd ){
	return {
		'name' : name,
		'pwd' : pwd
	};
}

proxyConfig.prototype.getParams = function( id ){
	var params  = {};
	params.method = id;
	params.params = this[id]() || {} 
	return params;
}
