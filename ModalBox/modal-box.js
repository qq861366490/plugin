/**
 *	ModalBox模态框select弹出插件
 *	@author Fade
 *	@update 2017/06/10 23:39
 */
;(function(global){
	//开启严格模式
	"use strict";
    //构造函数定义一个类
	function ModalBox(btnEl,inputEl,array,obj) {
		var _this = this;
		//*定义几种公共方法，方便重复调用

		//1、定义获取、设置元素的样式方法
		this.css = function(elem,styleObj){
			if(typeof styleObj == 'string'){
				if(elem.currentStyle){
					return elem.currentStyle[styleObj];
				}else{
					return window.getComputedStyle(elem)[styleObj];
				}
			}else if(typeof styleObj == 'object' && typeof styleObj.length != 'number' ){
				for(var i in styleObj){
					if(i == 'opacity'){
						elem.style.opacity = styleObj[i];
						elem.style.filter = 'alpha(opacity = '+styleObj[i]*100+')';
					}else {
						elem.style[i] = styleObj[i] ;
					}
				};
			}
		};
		
		//2、setCookie 设置cookie
		this.setCookie = function (name, value, hour) {
		    if(isNaN(hour) || hour < 0){
		    	hour = 0;
		    }
		    var exp = new Date();
		    exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
		    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() +';path=/';
		};
		
		//3、getCookie 读取cookie
		 this.getCookie = function (name) {
		    var regKey = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
		    var arr = document.cookie.match(regKey);
		    if (arr) {
		        return unescape(arr[2]);
		    } else {
		        return null;
		    }
		};
		
		//元素获取	
		this.array = array;
		this.chooseBtn = typeof btnEl == "string" ? document.querySelector(btnEl) : btnEl;
		this.chooseCon = typeof inputEl == "string" ? document.querySelector(inputEl) : inputEl;
		this.container = null;
		this.selectBox = null;
		this.ensure = null;
		this.cancel = null;
		this.content = null;
		this.w = null;
		this.h = null;
		//读取cookie，是否选择过chooseCon
		if(this.chooseCon.tagName.toLowerCase() == 'div'){
			this.chooseCon.innerHTML = this.getCookie(''+btnEl) || '';
		}else if(this.chooseCon.tagName.toLowerCase() == 'input') {
			this.chooseCon.value = this.getCookie(''+btnEl) || '';
		}
		
		
		//创建模态框
    	this.createModalBox = function(){
    		//创建模态框最外围盒子，半透明膜
    		var container = document.createElement('div');
    		container.className = 'modalBox-container';
    		_this.css(container,{
    			width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				position: "absolute",
				zIndex: "999999",
				left: "0",
				top: "0",
				userSelect: "none",
				display: 'none'
    		});
    		

    		//创建模态框容器
    		var content = document.createElement('div');
    		content.className = 'modalBox-content';
    		
    		if(obj && obj.width){
    			this.w = parseFloat(obj.width);
    			_this.css(content,{
	    			width: obj.width
	    		});
    		}else {
    			_this.css(content,{
	    			width: '400px'
	    		});
	    		this.w = '400';
    		}
    		if(obj && obj.height){
    			this.h = parseFloat(obj.height);
    			_this.css(content,{
	    			height: obj.height
	    		});
    		}else {
    			_this.css(content,{
	    			height: '300px'
	    		});
	    		this.w = '300';
    		}
    		_this.css(content,{
				backgroundColor: '#fff',
				position: 'absolute',
				zIndex: '999999',
				left: '50%',
				top: '50%',
				marginLeft: '-200px',
				marginTop: '-150px'
    		});
    		

    		//创建模态框容器内的文本'请选择：'
    		var textCon = document.createElement('div');
    		textCon.className = 'text-con';
    		if(!obj || obj.text == undefined){
    			textCon.innerHTML = '请选择：';
    		}else {
    			textCon.innerHTML = obj.text ;
    		};
    		_this.css(textCon,{
    			height: '30px',
				lineHeight: '30px',
				float: 'left',
				marginLeft: '10px',
				marginTop: '20px'
    		});
    		

    		//创建模态框容器内的select
    		var selectBox = document.createElement('select');
    		selectBox.className = 'select-box';
    		_this.css(selectBox,{
    			height: '30px',
				float: 'left',
				marginLeft: '10px',
				marginTop: '20px',
				outline: 'none'
    		});
    		

    		//创建模态框容器内的select内的option
    		if(_this.array == undefined){
    			var option = document.createElement('option');
    			selectBox.appendChild(option);
    		}else if( typeof _this.array == 'object' && typeof _this.array.length == 'number') {
    			for(var i=0,len=_this.array.length; i<len; i++){
    				var option = document.createElement('option');
    				option.value = _this.array[i];
    				option.innerHTML = _this.array[i];
    				selectBox.appendChild(option);
    			}
    		}

    		//创建确定按钮
    		var ensure = document.createElement('a');
    		ensure.className = 'ensure';
    		ensure.href = 'javascript:;';
    		ensure.innerHTML = '确定';

    		_this.css(ensure,{
    			display: 'block',
				width: '60px',
				height: '30px',
				lineHeight: '30px',
				textAlign: 'center',
				color: '#fff',
				backgroundColor: '#c33',
				position: 'absolute',
				left: '120px',
				bottom: '20px',
				textDecoration: 'none'
    		});
    		

    		//创建取消按钮
    		var cancel = document.createElement('a');
    		cancel.className = 'cancel';
    		cancel.href = 'javascript:;';
    		cancel.innerHTML = '取消';

    		_this.css(cancel,{
    			display: 'block',
				width: '60px',
				height: '30px',
				lineHeight: '30px',
				textAlign: 'center',
				color: '#fff',
				backgroundColor: '#999',
				position: 'absolute',
				right: '120px',
				bottom: '20px',
				textDecoration: 'none'
    		});
    		
    		//将创建的div塞到body里
			document.body.appendChild(container);
			container.appendChild(content);
			content.appendChild(textCon);
			content.appendChild(selectBox);
			content.appendChild(ensure);
			content.appendChild(cancel);
			
			//获取创建的元素
    		_this.container = container;
			_this.selectBox = selectBox;
			_this.ensure = ensure;
			_this.cancel = cancel;
			_this.content = content;
    	};
    	//执行模态框的创建
    	this.createModalBox();

    	//按钮btn被点击，模态框显示
    	this.chooseBtn.onclick = function(){
    		_this.css(_this.container,{
    			display: 'block'
    		});
    		//窗口改变事件
			if(obj && obj.resiz){
				_this.container.onresiz = function(){
					_this.css(_this.content,{
						left: 'calc(50% - '+_this.w+')',
						top: 'calc(50% - '+_this.h+')'
					});
				}
			}
    	};
    	
		//取消按钮被点击，模态框隐藏
    	this.cancel.onclick = function(){
    		_this.css(_this.container,{
    			display: 'none'
    		});
    	}

    	//确定按钮被点击，模态框隐藏，select的值赋给chooseCon
    	
    	this.ensure.onclick = function(){
    		var text1 = _this.selectBox.options[_this.selectBox.selectedIndex].value;
    		if(_this.chooseCon.tagName.toLowerCase() == 'div'){
				_this.chooseCon.innerHTML = text1;
			}else if(_this.chooseCon.tagName.toLowerCase() == 'input') {
				_this.chooseCon.value = text1;
			};
	    	_this.css(_this.container,{
    			display: 'none'
    		});
    		_this.setCookie(''+btnEl, text1, 1);
    	}
    	
		//模态框拖拽事件
		if(obj && obj.move){
			_this.css(_this.content,{
				cursor: 'move'
			});
			this.content.onmousedown = function(ev){
				ev = ev || window.event;
				var target = ev.target || ev.srcElement;
				//如果点中select选择框，就不触发拖拽
				if(target.className == 'select-box'){
					return;
				}
				var disX=ev.clientX-_this.content.offsetLeft;
				var disY=ev.clientY-_this.content.offsetTop;
				
				document.onmousemove=function(e){
					e = e || window.event;
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
					var l=e.clientX-disX;
					var	t=e.clientY-disY;

					var	wid=document.documentElement.clientWidth;
					var	hei=document.documentElement.clientHeight;
					_this.w = parseFloat(_this.css(_this.content,'width'));
					_this.h = parseFloat(_this.css(_this.content,'height'));
					if(l<0){
						l=0;
					}else if (l>wid-_this.w){
						l=wid-_this.w;
					}
					if(t<0){
						t=0;
					}else if(t>hei-_this.h){
						t=hei-_this.h;
					}
					_this.css(_this.content,{
						left: l+_this.w/2+'px',
						top: t+_this.h/2+'px'
					});
				}
				document.onmouseup=function(){
					document.onmousemove=null;
				}
			}
		}
		
    };

    //原型链上提供方法
    ModalBox.prototype = {
    	
    };
    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) {
    	module.exports = ModalBox;
    };
   	//兼容AMD/CMD规范
    if (typeof define === 'function') define(function() { 
    	return ModalBox; 
    });
    //注册全局变量，兼容直接使用script标签引入插件
    global.ModalBox = ModalBox;
})(this);