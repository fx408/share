var footer = '<div class="navbar" style="margin: 5px;"><div class="navbar-inner">'+
	'<ul class="nav">'+
		'<li class="active"><a href="/pages/use.html">使用</a></li>'+
		'<li class="divider-vertical"></li>'+
		//'<li><a href="/pages/setting.html">设置</a></li>'+
		//'<li class="divider-vertical"></li>'+
		'<li><a href="/pages/about.html">关于</a></li>'+
	'</ul>'+
  '</div></div>';
document.write(footer);

$(function() {
	//var _href = window.location.href.replace(/.*?\/pages\/(.*?)\.html$/, "/pages/$1.html");
	//$(".navbar a[href='"+_href+"']").parent("li").removeClass().addClass("active");
	
	$(".navbar .nav a").click(function() {
		var p = $(this).parent();
		$("li.active").removeClass();
		p.removeClass().addClass("active");
		$("#mainIframe iframe").attr("src", $(this).attr("href"));
		return false;
	});
});

