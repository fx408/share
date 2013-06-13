var _SHARE_APP_CONF = {
	LDB_KEY: "_SHARE_APP_CONF",

	// 读取用户配置
	readConf: function(callback) {
		var conf = LDB.item(this.LDB_KEY) || {};
		conf = this.mergerConf(conf, this.defaultConf);
		
		if(callback) callback(conf);
		else return conf;
	},

	// 合并配置
	mergerConf: function(obj1, obj2) {
		for(var k in obj2) {
			if(typeof obj2[k] == "object" && !obj2[k].join) {
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
			if(typeof conf[k] == "object" && !conf[k].join) {
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
		var keys = k.split("."),
			conf = LDB.item(this.LDB_KEY) || {};

		conf = this._update(conf, keys, val);
		LDB.set(this.LDB_KEY, conf);
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
		"t163": "网易微博",
		"tsohu": "搜狐微博",
		"qq": "QQ好友",
		"kaixin": "开心网",
		"mogujie": "蘑菇街",
		"tianya": "天涯社区"
	}
}

