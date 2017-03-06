
//全局变量
var distance,girltop,girlleft;
var flower=[
	'images/snowflake/snowflake1.png',
	'images/snowflake/snowflake2.png',
	'images/snowflake/snowflake3.png',
	'images/snowflake/snowflake4.png',
	'images/snowflake/snowflake5.png',
	'images/snowflake/snowflake6.png',];
//动画结束监测
var animationEnd = (function() {
           var explorer = navigator.userAgent;
           if (~explorer.indexOf('WebKit')) {
               return 'webkitAnimationEnd';
           }
           return 'animationend';
       })();
//背景图滑动
function swipe(container){
	var contentWrap=container.find(":first"),
		eachBg=contentWrap.find("li"),
		containerWidth=container.width(),
		containerHeight=container.height();
		console.log(containerWidth,containerHeight);
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
//花瓣飘落动画
function setflowers(){
	var topleft=parseInt(Math.random()*$(".flowerdown").width(),10)-50,
		downleft=parseInt(Math.random()*$(".flowerdown").width(),10)-50,
		url=flower[Math.floor(Math.random()*6)],
		dur=Math.floor(Math.random()*10000),
		duration=(dur<5000)?10000:dur,
		opa=Math.random(),
		opafinal=(opa<0.5)?1:opa;
	var $newflower=$("<div class='eachflower'></div>").css({
		"background":"url("+url+")",
		"left":topleft,
		"opacity":opafinal
	});
	$(".flowerdown").append($newflower);
	$newflower.transition({
		"top":$(".flowerdown").height()-50+'px',
		"left":downleft,
		opacity:0.7
	},duration,"ease-out",function(){
		$(this).remove();
	});
}
$(function(){
	swipe($("#container"));
	
	setposition();
	var boy=boywalk();
	var swipebg=swipe($("#container")),swipebgdistance=$("#container").width()*1;
	var audio=new Audio("http://m2.music.126.net/sSscv7oylNDJAzwRdkdV6A==/18620229416637724.mp3");
	audio.loop=false;
	audio.play();
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
            setInterval('setflowers()',200);
		});
});