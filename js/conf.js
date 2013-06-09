var _SHARE_APP_CONF = {
	confKey: "userShareConfig",
	
	// 读取用户配置
	conf: function() {
		var conf = LDB.item(this.confKey) || {};
		conf = this.mergerConf(conf, this.defaultConf);
		return conf;
	},
	
	// 合并配置
	mergerConf: function(obj1, obj2) {
		for(var k in obj2) {
			if(typeof obj2[k] == "object" && !$.isArray(obj2[k])) {
				obj1[k] = obj1[k] || {};
				obj1[k] = this.mergerConf(obj1[k], obj2[k]);
			} else {
				if(obj1[k] === undefined) {
					obj1[k] = obj2[k];
				}
			}
		}
		return obj1;
	},
	
	// 格式化 配置，将多层JSON对象 转换为一层
	formatConf: function(conf) {
		for(var k in conf) {
			if(typeof conf[k] == "object" && !$.isArray(conf[k])) {
				var obj = this.formatConf(conf[k]);
				for(var k2 in obj) {
					conf[k+"."+k2] = obj[k2];
				}
				delete conf[k];
			}
		}
		
		return conf;
	},

	// 更新用户配置
	update: function(k, val) {
		var conf = LDB.item(this.confKey) || {},
			keys = k.split(".");
		conf = this._update(conf, keys, val);
		LDB.set(this.confKey, conf);
	},
	
	_update: function(conf, keys, val) {
		var first = keys.shift();
		if(keys.length) {
			conf[first] = conf[first] || {};
			conf[first] = this._update(conf[first], keys, val);
		} else {
			conf[first] = val;
		}
		return conf;
	},
	
	// 默认配置
	defaultConf: {
		quicklyShare: 0,
		quicklyShareTo: 'qzone',
		icons: ["qzone", "tsina", "tqq", "renren", "douban"],
		image: {height:100, width:100, type:"or"}
	},
	
	titles: {
		"qzone": "QQ空间",
		"renren": "人人网",
		"tqq": "腾讯微博",
		"tsina": "新浪微博",
		"douban": "豆瓣",
		"t163": "搜狐微博"
	}
}