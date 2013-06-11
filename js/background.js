function _background() {
	this.initReauest = function(arg) {
		if(arg[0].reqtype && typeof this[arg[0].reqtype] == "function") this[arg[0].reqtype](arg);
	}
	
	this.readConf = function(arg) {
		_SHARE_APP_CONF.readConf(function(conf) {
			arg[2](conf);
		});
	}
}

var BK = new _background;
chrome.extension.onRequest.addListener(function() {
	BK.initReauest(arguments);
});