$(function() {
	var shareToHtml = "",
		topSharesHtml = '',
		titles = _SHARE_APP_CONF.titles;
	for(var k in titles) {
		shareToHtml += '<option value="'+k+'">'+titles[k]+'</option>';
		topSharesHtml += '<label class="checkbox inline">'
			+ '<input type="checkbox" id="inlineCheckbox1" name="icons[]" value="'+k+'"> '+titles[k]
			+ '</label>'
	}
	$("select[name=quicklyShareTo]").html(shareToHtml);
	$("#topShares").append(topSharesHtml);
	
	$("#topShares input").click(function(e) {
		if($("#topShares input:checked").length > 5) {
			return false;
		}
	});
	
	var checkboxMaxLen = {"icons[]":5};
	
	$("#setting input, #setting select").change(function() {
		var t = $(this).attr("type"),
			k = $(this).attr("name"),
			v = "";

		if(t == "checkbox") {
			v = [];
			var boxs = $("#setting input[name='"+k+"']:checked");
			if(checkboxMaxLen[k] && boxs.length > checkboxMaxLen[k]) return;
			
			boxs.each(function() {
				v.push($(this).val());
			});
			k = k.replace(/[\[\]]/g, "");
		} else {
			v = $(this).val();
		}
		
		console.log(v);
		_SHARE_APP_CONF.update(k, v);
	});
	
	_SHARE_APP_CONF.readConf(_init_setting);
});

function _init_setting(conf) {
	conf = _SHARE_APP_CONF.formatConf(conf);
	console.log(conf);
	
	$("#setting input").each(function() {
		var t = $(this).attr("type"),
			k = $(this).attr("name");
	
		switch(t) {
			case "radio":
				$(this).removeAttr("checked");
				$("#setting input[name='"+k+"'][value="+conf[k]+"]")[0].checked = true;
				break;
			case "textarea":
			case "text":
			case "hidden":
				$(this).val(conf[k]);
				break;
			case "checkbox":
				k = k.replace(/[\[\]]/g, "");
				if(!conf[k]) break;
				
				var val = $(this).attr("value");
				
				console.log(val);
				
				for(var i = 0; i < conf[k].length; i++) {
					if(val == conf[k][i]) {
						$(this)[0].checked = true;
						break;
					}
				}
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
	
}