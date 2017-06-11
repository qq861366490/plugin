/**
 *	Scroll自定义滚动条插件
 *	@author Fade
 *	@update 2017/06/9 15:55
 */
;(function(global){
	//开启严格模式
	"use strict";
    //构造函数定义一个类
	function Scroll(el,options) {
		var _this = this;
		//*定义几种公共方法，方便重复利用

		//1、定义获取元素的offset的top,left的方法
		this.offset = function(elem){
			var o = {};
			o.left = elem.offsetLeft;
			o.top= elem.offsetTop;
			while(elem.offsetParent){
				elem = elem.offsetParent;
				o.left += elem.offsetLeft;
				o.top += elem.offsetTop;
			}
			return o;
		};
		//2、定义获取、设置元素的样式方法
		this.css = function(elem,style){
			if(typeof style == 'string'){
				if(elem.currentStyle){
					return parseFloat(elem.currentStyle[style]);
				}else{
					return parseFloat(window.getComputedStyle(elem)[style]);
				}
			}else if(typeof style == 'object' && typeof style.length != 'number' ){
				for(var i in style){
					if(i == 'opacity'){
						elem.style.opacity = style[i];
						elem.style.filter = 'alpha(opacity = '+style[i]*100+')';
					}else if( i == 'zIndex' || i == 'color' || i == 'backgroundColor' || i == 'position' || i == 'overflow' || i == 'overflowX' || i == 'overflowY' || i == 'display'){
						elem.style[i] = style[i];
					}else{
						elem.style[i] = style[i] + 'px';
					}
				}
				
			}
		};
		//3、定义元素的样式的运动方法
		this.animate = function(elem,json,time,fn){
			 function css(elem,attr){
				if(elem.currentStyle){
					return elem.currentStyle[attr];
				}else{
					return window.getComputedStyle(elem)[attr];
				}
			};
			clearInterval(elem.timer);
			elem.timer = setInterval(function(){
				var flag = true;
				for(var attr in json){
					var start = 0, end = 0, speed = 0;
					if(attr == 'opacity'){
						if(!css(elem,attr)){
							start = 100;
						}else{
							start = Math.round( parseFloat( css(elem,attr) )*100 );
						}
						end =  parseFloat( json[attr] )*100;
					}else{
						if(!parseInt(css(elem,attr))){
							start = 0;
						}else{
							start =  parseInt(css(elem,attr) );
						}
						end = parseInt(json[attr]) ;
					}
					speed = (end - start)/(time || 8);
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					start += speed;
					if(start != end){
						flag = false;
					}
					if(attr == 'opacity'){
						elem.style.opacity = start/100 ;
						elem.style.filter ='alpha(opacity='+start+')';
					}else{
						elem.style[attr] = start + 'px';
					}
				}
				if(flag){
					clearInterval(elem.timer);
					fn && fn();
				}
			},13);
		};
		//元素获取	
		this.options = options;
		this.scrollContainer = typeof el == "string" ? document.querySelector(el) : el;
		this.scrollWrapper = this.scrollContainer.querySelector('.scroll-wrapper');
		this.content = this.scrollWrapper.querySelector('.scroll-content');
		this.scrollBar = this.scrollContainer.querySelector('.scroll-bar');
		this.btn = this.scrollBar.querySelector('.scroll-block');

		//样式设定
    	this.style = function(){
    		//滚动条滑块样式设定
    		//颜色
    		if(_this.options && _this.options.blockColor ){
    			_this.css(_this.btn,{
    				backgroundColor: _this.options.blockColor
    			});
    		}else {
    			_this.css(_this.btn,{
    				backgroundColor: 'grey'
    			});
    		};
    		//宽
    		if(_this.options && _this.options.blockWidth){
    			_this.css(_this.btn,{
    				width: _this.options.blockWidth
    			});
    		}else {
    			_this.css(_this.btn,{
    				width: 8
    			});
    		}	
    		//高
    		if(_this.options && _this.options.blockHeight){
    			_this.css(_this.btn,{
    				height: _this.options.blockHeight
    			});
    		}else {
    			_this.css(_this.btn,{
    				height: 16
    			});
    		};
    		//圆角
    		if(_this.options && _this.options.blockRadius){
    			if(_this.options.blockRadius.indexOf('%')){
    				_this.btn.style.borderRadius = _this.options.blockRadius;
    			}else {
    				_this.css(_this.btn,{
	    				borderRadius: _this.options.blockRadius
	    			});
    			}
    		}else {
    			_this.css(_this.btn,{
    				borderRadius: 10
    			});
    		};
    		
    		//滚动条滚动框区域样式设定
    		//颜色
    		if(_this.options && _this.options.barColor){
    			_this.css(_this.scrollBar,{
    				backgroundColor: _this.options.barColor
    			});
    		}else {
    			_this.css(_this.scrollBar,{
    				backgroundColor: '#ccc'
    			});
    		};
    		//宽
    		if(_this.options && _this.options.barWidth){
    			_this.css(_this.scrollBar,{
    				width: _this.options.barWidth
    			});
    		}else {
    			_this.css(_this.scrollBar,{
    				width: 10
    			});
    		};

    		
    		//scroll-bar滚动区域定位样式
    		_this.css(_this.scrollBar,{
				position: 'absolute',
				right: 0,
				top: 0,
				zIndex: 1000
			});
			_this.scrollBar.style.height = '100%';
    		//scroll-block滑块left，定位样式
    		var Bwidth = _this.css(_this.scrollBar,'width'),
    			width = _this.css(_this.btn,'width');
    		_this.css(_this.btn,{
				position: 'absolute',
				left: parseInt((Bwidth - width )/2),
				top: 0,
				zIndex: 1000
			});
    		//scroll-content滚动的内容样式设定
    		_this.css(_this.content,{
    			position: 'absolute',
    			left: 0,
				top: 0,
    			zIndex: 999
    		});
    		_this.content.style.width = '100%';
    		//scroll-wrapper容器样式设定
    		_this.css(_this.scrollWrapper,{
    			position: 'relative',
    			overflow: 'hidden',
    			zIndex: 999
    		});
    		var Cwidth = _this.css(_this.scrollWrapper,'width');
    		//scroll-container最外围容器 样式设定
    		_this.css(_this.scrollContainer,{
    			width: (Cwidth+Bwidth),
    			position: 'relative',
    			zIndex: 999
    		});
    	};
    	//样式执行
    	this.style();


		//获取宽高等信息,定义常量
		this.Cheight = this.content.offsetHeight;
		this.bheight = this.btn.offsetHeight;
		this.height = this.scrollBar.offsetHeight;
		this.speed = this.options && (typeof this.options.speed == 'number') ? Math.abs(parseInt(this.options.speed)) : 5;
		this.l =  (this.Cheight-this.height)/(this.height-this.bheight) ;
		this.h = 0;
		this.h1 = 50;
		this.h2 = 50;
		
		//滚动条滑块拖拽事件
		
		this.btn.onmousedown = function(e){
			var e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			var btnY = e.clientY - _this.btn.offsetTop;
			document.onmousemove = function(e){
				var e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				var t = e.clientY - btnY;
				if(t<0){
					t=0;
					_this.h1 =50;
					_this.h2 =50;
				}else if(t > _this.height-_this.btn.offsetHeight){
					t = _this.height-_this.btn.offsetHeight;
					_this.h2 =50;
				};
				var y = t*(_this.Cheight-_this.height)/(_this.height-_this.bheight);
				_this.css(_this.btn,{top: t});
				_this.css(_this.content,{top: -y});
				_this.scrollContainer.onmouseleave = null;
			}
			document.onmouseup = function(){
				document.onmousemove = null;
				//鼠标移入移出
			    if(_this.options && _this.options.hover ){
			    	_this.css(_this.scrollBar,{
		        		opacity: 0
		        	});
			    	_this.scrollContainer.onmouseenter = function(){
			    		_this.animate(_this.scrollBar,{
			        		opacity: 1
			        	});
			    	}
			    	_this.scrollContainer.onmouseleave = function(){
			    		setTimeout(function(){
			    			_this.animate(_this.scrollBar,{
				        		opacity: 0
				        	});
			    		},1000);
			    		
			    	}
			    }else {
			    	_this.scrollContainer.onmuseenter = null;
			    };
			}
		}
		//鼠标滚轮事件
		this.scrollContainer.onmousewheel = function(e){
			var e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			var wheelDelta = e.wheelDelta;
			var num = parseInt(_this.height/wheelDelta)*_this.speed;
			_this.h -= num;
			if(_this.h <= 0){
				_this.h = 0;
				_this.h1 =50;
				_this.h2 =50;
			};
			if(_this.h>=(_this.height-_this.bheight)){
				_this.h = _this.height-_this.bheight;
				_this.h2 =50;
			}
			_this.css(_this.btn,{top: _this.h});
			_this.css(_this.content,{top: -_this.h*_this.l});
		}
		//侧边滚动条区域点击事件
		this.scrollBar.onclick = function(e){
			var e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			var target = e.target || e.srcElement;
			if(target.className == 'scroll-block'){
				return;
			}
			var t = _this.btn.offsetTop,
				y = e.clientY - _this.offset(_this.scrollBar).top,
				bh = _this.h1 + t,
				hh = _this.h1 - _this.h2;
			
			if(y-t >= 0){
				if(bh>=(_this.height-_this.bheight)){
					bh = _this.height-_this.bheight;
					_this.h2 =50;
				}
				_this.animate(_this.btn,{top: bh});
				_this.animate(_this.content,{top: -bh*_this.l});
				_this.h1 += 50;
			}else if(y-t <= 0) {
				if(hh<=0){
					hh = 0;
					_this.h1 =50;
					_this.h2 =50;
				}
				_this.animate(_this.btn,{top: hh});
				_this.animate(_this.content,{top: -hh*_this.l});
				_this.h2 += 50;
			}	
			
		};
	    //鼠标移入移出
	    if(this.options && this.options.hover ){
	    	this.css(this.scrollBar,{
        		opacity: '0'
        	});
	    	this.scrollContainer.onmouseenter = function(){
	    		_this.animate(_this.scrollBar,{
	        		opacity: 1
	        	});
	    	}
	    	this.scrollContainer.onmouseleave = function(){
	    		setTimeout(function(){
	    			_this.animate(_this.scrollBar,{
		        		opacity: 0
		        	});
	    		},1000);
	    		
	    	}
	    }else {
	    	this.scrollContainer.onmuseenter = null;
	    };


    };


    //原型链上提供方法
    Scroll.prototype = {
    	//显示滚动条
        scrollShow: function() {
        	this.css(this.scrollBar,{
        		display: 'block'
        	});
        },
        //隐藏滚动条
        scrollHide: function() {
        	this.css(this.scrollBar,{
        		display: 'none'
        	});
        }
    };
    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) {
    	module.exports = Scroll;
    };
   	//兼容AMD/CMD规范
    if (typeof define === 'function') define(function() { 
    	return Scroll; 
    });
    //注册全局变量，兼容直接使用script标签引入插件
    global.Scroll = Scroll;
})(this);