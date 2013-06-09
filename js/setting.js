$(function() {
	var shareToHtml = "",
		titles = _SHARE_APP_CONF.titles,
		conf = _SHARE_APP_CONF.conf();
		
	conf = _SHARE_APP_CONF.formatConf(conf);
	console.log(conf);
	
	for(var k in titles) {
		shareToHtml += '<option value="'+k+'">'+titles[k]+'</option>';
	}
	$("select[name=quicklyShareTo]").html(shareToHtml);
	
	$("#setting input").each(function() {
		var t = $(this).attr("type"),
			k = $(this).attr("name"),
			v = conf[k];
		if(v == undefined) return false;
		
		switch(t) {
			case "radio":
				$(this).removeAttr("checked");
				$("#setting input[name='"+k+"'][value="+v+"]").click();
				break;
			case "textarea":
			case "text":
			case "hidden":
				$(this).val(v);
				break;
			default: break;
		}
	});
	
	$("#setting select").each(function() {
		var k = $(this).attr("name"),
			v = conf[k];
		if(v == undefined) return false;
		$(this).val(v);
	});
	
	$("#setting input, #setting select").change(function() {
		var k = $(this).attr("name"),
			v = $(this).val();
		
		_SHARE_APP_CONF.update(k, v);
	});
});