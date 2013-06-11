_SHARE_APP_CONF.localSqlServer = function() {
	this.DBNAME = "_PSAPP_DATABASES";
	this.CONF_TABLE = "config";
	this.DB = {};
	this.defaultCid = 1;

	// 初始化数据库
	this.init = function() {
		this.DB = openDatabase(this.DBNAME, "", this.CONF_TABLE, 1024*1024, function() {

		});

		//this.doSql("DROP TABLE IF EXISTS config", []);
		var _this = this;
		this.doSql("CREATE TABLE IF NOT EXISTS config (cid int UNIQUE, content TEXT)", []);
		this.item(this.defaultCid, function(result) {
			if(result.rows.length == 0) _this.insert({cid:_this.defaultCid, content:""});
		});
	}

	// 根据CID 查询
	this.item = function(cid, callback) {
		cid = cid || this.defaultCid;

		this.doSql("SELECT * FROM config WHERE cid=?", [cid], callback);
	}

	// 插入
	this.insert = function(data, callback) {
		if(!data.cid) return;
		data = this.formatData(data);

		this.doSql("INSERT INTO config (cid, content) VALUES (?, ?)", [data.cid, data.content], callback);
	}

	// 更新
	this.update = function(data, callback) {
		if(!data.cid) return;
		data = this.formatData(data);

		this.doSql("UPDATE config SET content=? WHERE cid=?", [data.content, data.cid], callback);
	}

	//删除
	this.del = function(cid, callback) {
		this.doSql("DELETE FROM config WHERE cid=?", [cid], callback);
	}

	// 执行sql语句
	this.doSql = function(sql, data, callback) {
		this.DB.transaction(function(tx) {
			tx.executeSql(
				sql,
				data,
				function(tx, result) {
					console.log(result);
					if(callback) callback(result);
				},
				function(tx, err) {
					console.log(err);
				}
			);
		});
	}

	// 格式化数据
	this.formatData = function(data) {
		data.content = data.content || {};
		if(typeof data.content != "string") data.content = JSON.stringify(data.content);

		return data;
	}

	this.init();
}

_SHARE_APP_CONF.fileSystem = function() {
	this.confFileName = "_SHARE_APP.conf";
	
	// 读取文件
	this.read = function(callback) {
		var _this = this;
		
		var handleCallback = function(fs, fileEntry) {
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					
					console.log(this.result);
					callback && callback(this.result);
				};
				reader.readAsText(file);
			}, _this.errorHandle);
		}

		this.fileHandle(handleCallback);
	}
	
	// 写入文件
	this.write = function(data, callback) {
		var _this = this;
		
		var handleCallback = function(fs, fileEntry) {
			var w = fileEntry.createWriter(function(fileWriter) {
				fileWriter.onwriteend = function(e) {
					
					callback && callback();
					console.log('Write completed.');
				};
				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};
				
				var blob = new Blob([data], {type: "text/plain"});
				fileWriter.write(blob);
			}, _this.errorHandle);
		}

		this.fileHandle(handleCallback);
	}

	this.fileHandle = function(callback) {
		var func = window.webkitRequestFileSystem || window.requestFileSystem,
			_this = this;
		
		func(window.PERSISTENT, 1*1024*1024, function(fs) {
			fs.root.getFile(_this.confFileName, {create: true}, function(fileEntry) {
				console.log(fs, fileEntry);
				callback(fs, fileEntry);
			}, _this.errorHandle);
		}, _this.errorHandle);
	}

	this.errorHandle = function(err) {
		console.log(err);
	}
}

// _SHARE_APP_CONF.LSS = new _SHARE_APP_CONF.localSqlServer();
// _SHARE_APP_CONF.LSS.defaultCid = _SHARE_APP_CONF.confID;
//_SHARE_APP_CONF.FS = new _SHARE_APP_CONF.fileSystem();