function _PShareApp() {
	this.currentImageId = 0;
	this.shareLinkObject = {};
	this.selectedText = "";
	
	this.times = {};
	this.shareType = "";
	
	this.conf = {};
	
	// 获取划词内容 对象
	this.getSelectedText = function() {
		var selectedText = "";
		if(window.getSelection) {
			if(document.activeElement && 
				(document.activeElement.tagName.toLowerCase () == "textarea" || 
				document.activeElement.tagName.toLowerCase () == "input")
			) {
				var text = document.activeElement.value;
				selectedText = text.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);
			} else {
				var selRange = window.getSelection();
				selectedText = selRange.toString();
			}
		}
		return selectedText;
	}
	
	// 分享
	this.share = function(shareTo, shareData) {
		shareTo = this.getShareTo(shareTo);
		
		shareData = this.formatShareData(shareTo, shareData);
		var url = this.createShareUrl(shareTo, shareData);
		
		window.open(url, "_blank", "width=600, height=500, top=0, left=0");
	}
	
	// 显示分享按钮
	this.showShareBtn = function(ofs) {
		this.showShareLayer(ofs);
		
		$("#_PShare ._PShare_buttons").show()
		.css({height:"0px", width:"0px"})
		.animate({height:"40px", width:"225px"}, 300, function() {
			$("#_PShare ._PShare_title").hide();
		});
	}
	
	// 显示 分享按钮(小)
	this.showShareBtnSmall = function(ofs) {
		this.showShareLayer(ofs);
		
		$("#_PShare ._PShare_title").show();
		$("#_PShare ._PShare_buttons").hide();
	}
	
	// 显示分享层
	this.showShareLayer = function(ofs) {
		if(ofs) $("#_PShare").css({top:ofs.top+"px", left:ofs.left+"px"});
		$("#_PShare").show();
		
		this.hideShareMore();
		this.hideShareLayer();
	}
	
	// 显示更多
	this.showShareMore = function() {
		if($("#_PShare_more_div:visible").length) {
			this.hideShareMore();
		} else {
			$("#_PShare_more_div").show();
		}
	}
	
	this.hideShareMore = function() {
		$("#_PShare_more_div").hide();
	}
	
	// 隐藏分享层
	this.hideShareLayer = function(time) {
		time = time || 10;
		
		if(this.times.shareBtn) {
			clearTimeout(this.times.shareBtn);
		}
		this.times.shareBtn = setTimeout(function() {
			$("#_PShare").fadeOut();
		}, time*1000);
	}

	// 分享图片
	this.shareImage = function(shareTo) {
		var img = $("img[_PShare_imageId="+this.currentImageId+"]");
		if(!img.length) return false;
		
		var shareData = {
			url: location.href,
			title: img.attr("title") || img.attr("alt") || document.title,
			pic: img.attr("src")
		};
		
		this.share(shareTo, shareData);
	}
	
	// 划词分享
	this.shareText = function(shareTo) {
		var shareData = {
			url: location.href,
			title: $.trim(this.selectedText),
			pic: ""
		};
		if(shareData.title == "") return false;
		
		this.share(shareTo, shareData);
	}
	
	// 分享链接
	this.shareLink = function(shareTo) {
		var $link = $(this.shareLinkObject);
		var shareData = {
			url: $.trim( $link.attr("href") ),
			title: $.trim( $link.attr("title") || $link.html() ) || document.title,
			pic: ""
		};
		if(shareData.url == "") return false;
		
		this.share(shareTo, shareData);
	}
	
	// 获取 默认分享
	this.getShareTo = function(shareTo) {
		if(!shareTo || !this.urls[shareTo]) shareTo = this.conf.quicklyShareTo || 'qzone';
		
		return shareTo;
	}
	
	// 格式化 分享数据
	this.formatShareData = function(shareTo, shareData) {
		var reg = /^[\w]+\:\/\//,
			urlCheck = ["pic", "url"];
		for(var i = 0; i < urlCheck.length; i++) {
			if(shareData[urlCheck[i]] && !reg.test(shareData[urlCheck[i]])) shareData[urlCheck[i]] = location.protocol+"//"+location.hostname+"/"+shareData[urlCheck[i]];
		}
		
		if(diff = this.diffKeys[shareTo]) {
			for(var k in diff) {
				shareData[k] = "";
				
				if(diff[k].indexOf("+") != -1) {
					var keys = diff[k].split("+");
					for(var i = 0; i < keys.length; i++) {
						shareData[k] += shareData[keys[i]]+" ";
						delete shareData[keys[i]];
					}
				} else {
					shareData[k] = shareData[diff[k]];
					delete shareData[diff[k]];
				}
			}
		}
		
		if(other = this.otherParams[shareTo]) {
			for(var k in shareData) {
				other[k] = shareData[k];
			}
			shareData = other;
		}
		
		return shareData;
	}
	
	// 生成分享链接
	this.createShareUrl = function(shareTo, shareData) {
		var uri = [],
			url = this.urls[shareTo]+"?";
		
		for(var i in shareData) {
			uri.push(i + '=' + encodeURIComponent(shareData[i]||''));
		}
		return [url, uri.join('&')].join("");
	}
	
	// 读取图标配置
	this.getDefaultShareBtnHtml = function() {
		var html = '<div class="_PShare" id="_PShare" style="display:none">'
			+ '<div class="_PShare_title">分享</div>'
			+ '<div class="_PShare_buttons" style="display:none">';

		var len = Math.min(this.conf.icons.length, 5);

		for(var i = 0; i < len; i++) {
			html +='<a class="_PShare_'+this.conf.icons[i]+'"></a>';
		}
		html +='<a class="_PShare_more"></a></div>'
			+ '<div id="_PShare_more_div">';
		for(var k in this.urls) {
			html +='<a class="_PShare_'+k+'"></a>';
		}
		html += '<div class="_PShare_clear"></div></div></div>';
		return html;
	}
	
	// 默认分参数键值
	this.defaultKeys = {url:'', title:'', pic:''};
	// 参数键值差异
	this.diffKeys = {
		qzone: {pics:"pic"},
		qq: {pics:"pic"},
		renren: {resourceUrl:"url"},
		douban: {href:"url", name:"title", image:"pic"},
		t163: {info:"title+url", images:"pic"},
		kaixin: {rurl:"url", rtitle:"title", rcontent:"title+pic"},
		mogujie: {content: "title"},
		tianya: {picUrl: "url"}
	};
	// 地址
	this.urls = {
		qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
		tsina: 'http://service.weibo.com/share/share.php',
		tqq: 'http://share.v.t.qq.com/index.php',
		renren: 'http://widget.renren.com/dialog/share',
		douban: 'http://shuo.douban.com/!service/share',
		t163: 'http://t.163.com/article/user/checkLogin.do',
		tsohu: 'http://t.sohu.com/third/post.jsp',
		qq: 'http://connect.qq.com/widget/shareqq/index.html',
		kaixin: 'http://www.kaixin001.com/repaste/share.php',
		mogujie: 'http://www.mogujie.com/mshare',
		tianya: 'http://open.tianya.cn/widget/send_for.php'
	};
	// 其他参数
	this.otherParams = {
		tqq: {c:'share', a:'index'},
		qq: {desc:'', summary:'', site:'baidu'},
		tsina: {appkey:'', source:'bshare', retcode:0},
		t163:{togImg:"true", source: document.title},
		mogujie: {from: "mogujie"},
		tianya: {action:'send-html', shareTo:1, relateTYUserName:'', flashVideoUrl:''}
	}
}

_PShareApp.prototype.init = function(conf) {
	var iconLen = conf.icons.length;
	if(iconLen < 5) {
		for(var k in _PSAPP.urls) {
			var isFind = false;
			for(var i = 0; i < iconLen; i++){
				if(k == conf.icons[i]) {
					isFind = true;
					break;
				}
			}
			if(isFind == false) {
				iconLen = conf.icons.push(k);
				if(iconLen >= 5) break;
			}
		}
	}
	conf.quicklyShare = conf.quicklyShare == 1;
	_PSAPP.conf = conf;
	
	console.log(conf);
	
	if(_PSAPP.conf.quicklyShare) {
		console.log(_PSAPP.conf.quicklyShare);
	}
	
	$("img").each(function(i) {
		$(this).attr("_PShare_imageId", '_PShare_'+i);
	});

	var shareHtml = _PSAPP.getDefaultShareBtnHtml();
	$(shareHtml).appendTo("body");
	
	// 图片
	$(document).on("mouseover", "img", function() {
		var imgConf = _PSAPP.conf.image,
			h = $(this).height() >= imgConf.height,
			w = $(this).width() >= imgConf.width,
			allowShare = false;
		if(imgConf.type == "or") allowShare = h || w;
		else if(imgConf.type == "and") allowShare = h && w;
		
		if(allowShare) {
			var imgId = $(this).attr("_PShare_imageId");
			if(!imgId) {
				imgId = parseInt( Math.random()*1000000+100 );
				$(this).attr("_PShare_imageId", imgId);
			}
			
			if(_PSAPP.currentImageId != imgId || $("#_PShare ._PShare_buttons:hidden").length) {
				_PSAPP.currentImageId = imgId;
				_PSAPP.showShareBtnSmall($(this).offset());
			}
		}
	});
	
	$("#_PShare ._PShare_title").click(function(e) {
		_PSAPP.shareType = "image";
		_PSAPP.showShareBtn();
		e.stopPropagation();
	});
	
	// 点击分享按钮
	$("#_PShare a").click(function(e) {
		var shareTo = $(this).attr("class").replace("_PShare_", "");
		
		if(shareTo == "more") {
			_PSAPP.showShareMore();
		} else {
			switch(_PSAPP.shareType) {
				case "image": _PSAPP.shareImage(shareTo); break;
				case "text":  _PSAPP.shareText(shareTo); break;
				case "link": _PSAPP.shareLink(shareTo); break;
				default: break;
			}
		}
		e.stopPropagation();
		return false;
	});
	
	$("#_PShare ._PShare_buttons").mouseover(function() {
		_PSAPP.hideShareLayer();
	});
	
	$(window).keydown(function(e) {
		// Z 90, X 88
		if(e.shiftKey) {
			switch(e.keyCode) {
				case 90: // 分享图片快捷键 shift+z
					_PSAPP.shareType = "image";
					if(_PSAPP.conf.quicklyShare) _PSAPP.shareImage();
					else _PSAPP.showShareBtn();
					break;
				case 88: // 划词分享快捷键shift+x
					_PSAPP.selectedText = _PSAPP.getSelectedText();
					if(_PSAPP.selectedText == "") break;
					
					_PSAPP.shareType = "text";
					if(_PSAPP.conf.quicklyShare) _PSAPP.shareText();
					else _PSAPP.showShareBtn({top:lastMousedownEvent.pageY, left:lastMousedownEvent.pageX});
					break;
				default: break;
			}
		}
	}).click(function() {
		_PSAPP.hideShareLayer(0.01);
	});
	
	var lastMousedownEvent = {};
	$(document.body).mousedown(function(e) {
		lastMousedownEvent = e;
	});
	
	$(document.body).on("click", "a", function(e) {
		if(e.shiftKey && $(this).attr("href")) { // shift+鼠标单击，分享链接
			_PSAPP.shareLinkObject = $(this);
			
			if(_PSAPP.conf.quicklyShare) {
				_PSAPP.shareLink();
			} else {
				_PSAPP.shareType = "link";
				_PSAPP.showShareBtn($(this).offset());
			}
			e.stopPropagation();
			return false;
		}
	});
}

_PSAPP = new _PShareApp;
$(function() {
	chrome.extension.sendRequest({reqtype: "readConf"},  function(response) {
		console.log(response);
		_PSAPP.init(response);
	});
});
