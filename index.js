//背景图滑动
var distance,girltop,girlleft;
var animationEnd = (function() {
           var explorer = navigator.userAgent;
           if (~explorer.indexOf('WebKit')) {
               return 'webkitAnimationEnd';
           }
           return 'animationend';
       })();
var flower=[
	'images/snowflake/snowflake1.png',
	'images/snowflake/snowflake2.png',
	'images/snowflake/snowflake3.png',
	'images/snowflake/snowflake4.png',
	'images/snowflake/snowflake5.png',
	'images/snowflake/snowflake6.png',];
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
		var dtd=$.Deferred();
		contentWrap.transition({
		'transform':"translate("+x+"px,0)"},speed,"linear",function(){dtd.resolve();});
		return dtd;
	};
	return swipe;
}
//人物位置定位
function setposition(){
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
		"top":pathY-$("#boy").height()+25+'px',
	});
	var girl=$(".girl");
	girltop=getValue(".c_background").height*0.7-girl.height();
	girlleft=girl.position().left;
	console.log(girlleft);
	girl.css({
		"top":girltop
	});
}
//人物动画控制

function boywalk(){
	function move(){
		$("#boy").removeClass("walkpause").addClass("slowwalk");
	}
	function stopmove(){
		$("#boy").removeClass("slowwalk").addClass("walkpause");
	}
	function caldist(direction,proportion){
		return (direction=="x"?$("#container").width():$("#container").height())*proportion;
	}
	function startwalk(distx,disty,time){
		var dtd=$.Deferred();
		move();
		$("#boy").transition({
            "left":distx+"px",
            "top":disty+"px"
        },  time,
            'linear',
            function() {
            	dtd.resolve(); // 动画完成
            });
		return dtd;
	}
	function takeflower(){
		var dtd=$.Deferred();
		setTimeout(function(){
			$("#boy").addClass("slowFlowerWalk");
			dtd.resolve();
		},1000);
		return dtd;
	}
	return {
	 	walkto:function (time,proportionX,proportionY){
			var distx=caldist("x",proportionX),disty=proportionY?caldist("y",proportionY):undefined;
			return startwalk(distx,disty,time);
		},
		stop:function(){stopmove();},
		move:function(){move();},
		takeflower:function(){
			return takeflower();
		},
		startwalk:function(distx,disty,time){
			return startwalk(distx,disty,time);
		}
	};
}

//门开关控制
function doorcontrol(way,time){
	var dtd=$.Deferred(),count=2;
	if(way==="open"){
		var l="-50%",r="100%";
	}else{
		var l='0',r='50%';
	}
	function actioncount(){
		if(count==1){
			dtd.resolve();
			return;
		}
		count--;
	}
	$('.leftdoor').transition({
		'left':l},time,actioncount);
	$('.rightdoor').transition({'left':r},time,actioncount);
	return dtd;
}

//人进出门

function walktoshop(time){
	var dtd=$.Deferred();
	var boycenter=$("#boy").offset().left+$("#boy").width()/2;
	var doorcenter=$(".door").offset().left+$(".door").width()/2;
	distance=doorcenter-boycenter;
	$("#boy").transition({
		"transform":"translate("+distance+"px,0) scale(0.3,0.3)",
		"opacity":0.1
	},time,function(){
		$("#boy").css({"opacity":0});
		dtd.resolve();
	});
	return dtd;
}
function walkoutshop(time){
	var dtd=$.Deferred();
	$("#boy").transition({
		"transform":"translate("+distance+"px,0) scale(1,1)",
		"opacity":1
	},time,function(){
		dtd.resolve();
	});
	return dtd;	
}
$(function(){
	swipe($("#container"));
	setposition();
	var boy=boywalk();
	var swipebg=swipe($("#container")),swipebgdistance=$("#container").width()*1;
	boy.walkto(2000,0.5)
		.then(function(){
			return swipebg.scrollTo(-swipebgdistance,5000);
		}).then(function(){
			return doorcontrol("open",2000);
		}).then(function(){
			return walktoshop(2000);
		}).then(function(){
			return boy.takeflower();
		}).then(function(){
			return walkoutshop(2000);
		}).then(function(){
			return doorcontrol("close",2000);
		}).then(function(){
			boy.walkto(5000,0.15);
			return swipebg.scrollTo(-swipebgdistance*2,5000);
		}).then(function(){
			var x=swipebgdistance*0.25;
			var y=girltop;
			return boy.startwalk(x,y,1000);
		}).then(function(){
			var x=girlleft-$("#boy").width();
			return boy.startwalk(x,girltop,1000);
		}).then(function(){
			boy.stop();
			return function(){
				var dtd=$.Deferred();
				$("#container").transition({
					"opacity":0
				},5000,function(){
					$("#container").css({"display":"none"});
					dtd.resolve();
				});
				return dtd;
			}();
		}).then(function(){
            $(".hbtext").addClass('logolightSpeedIn')
                .on(animationEnd, function() {
                    $(".hbtext").addClass('logoshake').off();
                 });
		});
});