var _xhr_open = XMLHttpRequest.prototype.open;

console.log(_xhr_open);

function handlerXhrReady() {
	console.log(this.responseText, this._url);
	//FAPP_XHR_XMLHttpRequest(this.responseText, this._url);
}

XMLHttpRequest.prototype.open = function(method, url) {
	console.log(this._url);
	
	if (!this._url) {
		console.log(url, method);
		
		this._url = url;
		this.addEventListener('readystatechange', handlerXhrReady);
	}
	
	_xhr_open.apply(this, arguments);
};
