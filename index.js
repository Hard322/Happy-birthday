var container=$("#container"),
	contentWrap=container.find(":first"),
	eachBg=contentWrap.find("li"),
	containerWidth=container.width(),
	containerHeight=container.height();
contentWrap.css({
	"width":containerWidth*3+'px',
	"height":containerHeight+'px'
});
eachBg.each(function(){
	$(this).css({
		"width":containerWidth+'px',
	    "height":containerHeight+'px'
	});
});
contentWrap.css({
	"transform":"translate(-"+containerWidth*2+"px,0)",
	"transition":"transform 5s linear"
});
