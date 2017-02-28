//背景图滑动
function swipe(container){
	var contentWrap=container.find(":first"),
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
	swipe.scrollTo=function(x,speed){
		contentWrap.css({
			"transform":"translate(-"+x+"px,0)",
			"transition":"transform "+speed+"s linear"
		});
	};
	return swipe;
}
$(function(){
	var swipebg=swipe($("#container"));
	//swipebg.scrollTo($("#container").width()*2,5);
	var getValue=function(className){
		var $elm=$(''+className);
		return {
			height:$elm.height(),
			top:$elm.position().top
		};
	};
	var pathY=function(){
		var data=getValue('.a_background_middle');
		return data.top+data.height/2;
	}();
	$("#boy").css({
		"top":pathY-$("#boy").height()+25+'px'
	});


});