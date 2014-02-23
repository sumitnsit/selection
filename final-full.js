
var boxes = new Array();
var newBoxes = undefined;


var controlPressed = false;

function changeWidth(className){
	return (
		className.indexOf("rm") > -1 || 
		className.indexOf("tr") > -1 || 
		className.indexOf("br") > -1)
}

function changeHeight(className){
	return (
		className.indexOf("bm") > -1 || 
		className.indexOf("bl") > -1 || 
		className.indexOf("br") > -1)
}

function changeWidthLeft(className){
	return (
		className.indexOf("tl") > -1 || 
		className.indexOf("bl") > -1 || 
		className.indexOf("lm") > -1
		)
}


function changeHeightTop(className){
	return (
		className.indexOf("tl") > -1 || 
		className.indexOf("tm") > -1 || 
		className.indexOf("tr") > -1
		)
}


function init(){
	console.log("Initialising System");
	attachDragabilty("moveable");

	attachDragabilty("moveable1");

	addEvent("keydown", keyDown);
	addEvent("keyup", keyUp);
}

function keyDown(){
	controlPressed = event.keyCode == 91;
}

function keyUp(){
	controlPressed = false;
}

function addEvent(method, func){
	document.addEventListener(method, func, false);
}

function removeEvent(method, func){
	document.removeEventListener(method, func, false);
}

function addHooks(element){
	// var divIds = ["hook-tl", "hook-tm", "hook-tr", "hook-lm", "hook-rm", "hook-bl", "hook-bm", "hook-br" ];
	var divIds = ["hook-rm", "hook-bm", "hook-br" ];

	if (typeof element == 'string')
		element = document.getElementById(element);

	for(var i = 0; i < 8; i++){
		var newDiv = document.createElement("div");
		newDiv.className = divIds[i];
		newDiv.id = divIds[i];
		// newDiv.onmousedown = hookDown;
		attachResizeablity(newDiv, element);
		element.appendChild(newDiv);
	}
}


function addRotatingHook(parent){

	if (typeof parent == 'string')
		parent = document.getElementById(parent);

	var newDiv = document.createElement("div");
	newDiv.className = "rotatingPoint";
	attachRotateablity(newDiv, parent);
	parent.appendChild(newDiv);
}

function attachRotateablity(element, p){

	var rotate = {
		initMouseX: undefined,
		initMouseY: undefined,
		obj: element,
		parent: p,
		prvangle: 0,
		tempangle: 0,

		mouseDown: function(){
			console.log("Mouse down on object");
			rotate.initMouseX = event.clientX;
			rotate.initMouseY = event.clientY;
			addEvent("mousemove", rotate.mouseMove);
			addEvent("mouseup", rotate.mouseUp);
			
			
			
			event.stopPropagation();
			return false;
		},

		mouseUp: function(){
			removeEvent("mousemove", rotate.mouseMove);
			removeEvent("mouseup", rotate.mouseUp);
			console.log(rotate.obj.style.webkitTransform);
			rotate.prvangle = rotate.tempangle;

			event.stopPropagation();
			return false;
		},

		mouseMove: function(multiple){


			var angle = event.clientY - rotate.initMouseY + rotate.prvangle;
			rotate.tempangle = angle;
			rotate.parent.style.webkitTransform = "rotate(" + angle + "deg)"; 
			
			event.stopPropagation();
			return false;
		}


	}

	rotate.obj.onmousedown = rotate.mouseDown;

	return rotate;
}


function moveMultiple(){

	newBoxes = boxes;
	boxes = new Array();

	for(var i = 0; i < newBoxes.length; i++){
		newBoxes[i].mouseMove();
	}
}


function attachDragabilty(element){
	var temp = (function (el){
		var drag = {
			objLeft: undefined,
			objTop: undefined,
			initMouseX: undefined,
			initMouseY: undefined,
			obj: undefined,

			info: function(){
				console.log("info " + el);
			},

			mouseDown: function(){

				if(controlPressed){
					boxes.push(drag);	
				}

				console.log("Mouse down on object");
				drag.objLeft = drag.obj.offsetLeft;
				drag.objTop = drag.obj.offsetTop;
				drag.initMouseX = event.clientX;
				drag.initMouseY = event.clientY;
				addEvent("mousemove", drag.mouseMove);
				addEvent("mouseup", drag.mouseUp);
				event.stopPropagation();
				drag.obj.className += " shadow";

				drag.info();

				return false;
			},

			mouseUp: function(){
				
				drag.obj.className = drag.obj.className.replace(/shadow/,'')	
				removeEvent("mousemove", drag.mouseMove);
				removeEvent("mouseup", drag.mouseUp);
				event.stopPropagation();
			},

			mouseMove: function(multiple){

			if(boxes.length > 0){
				addEvent("mousemove", moveMultiple);

			} else {
				console.log(el);
				drag.obj.style.left = (event.clientX - drag.initMouseX + drag.objLeft) + "px";
				drag.obj.style.top = (event.clientY - drag.initMouseY + drag.objTop) + "px";
				event.stopPropagation();
			}


				return false;
			},

			init: function(){
				console.log("EL: " + el);
				var mdiv = document.getElementById(el);
				mdiv.style.webkitTransformOrigin = "0% 0%";
				this.obj = mdiv;
				addHooks(drag.obj);
				addRotatingHook(drag.obj);
				drag.obj.onclick = drag.click;
				this.obj.onmousedown = this.mouseDown;
			},

			click: function(){
				console.log("Click on object");
				if(drag.obj.className.indexOf("hiddenHooks") < 0){
					drag.obj.className += " hiddenHooks";
				} else {
					drag.obj.className = drag.obj.className.replace(/hiddenHooks/,'')	
				}
				event.stopPropagation();
				return false;
			},

			
		}

		return drag;
	})(element);

	temp.init();

}


function attachResizeablity(element, obj1){


	var resize = {
		parentWidth: undefined,
		parentHeight: undefined,
		parentLeft: undefined,
		parentTop: undefined,
		initMouseX: undefined,
		initMouseY: undefined,
		obj: undefined,
		parent: obj1,
		class_name: element.className,

		init: function(element){
			resize.obj = element;
			element.onmousedown = resize.mouseDown;
		},

		mouseDown: function(){
			console.log("Mouse down on hook");
			resize.parentWidth = resize.obj.parentNode.clientWidth;
			resize.parentHeight = resize.obj.parentNode.clientHeight;
			resize.parentLeft = resize.obj.parentNode.offsetLeft;
			resize.parentTop = resize.obj.parentNode.offsetTop;
			resize.initMouseX = event.clientX;
			resize.initMouseY = event.clientY;
			resize.obj = this;
			addEvent("mousemove", resize.mouseMove);
			addEvent("mouseup", resize.mouseUp);
			event.stopPropagation();
			console.log("ID " + resize.obj.id);
			return false;
		},

		mouseUp: function(){
			removeEvent("mousemove", resize.mouseMove);
			removeEvent("mouseup", resize.mouseUp);

			event.stopPropagation();
		},

		mouseMove: function(){

			if(changeWidth(resize.obj.id)){
				resize.parent.style.width = (event.clientX - resize.initMouseX + resize.parentWidth) + "px";
			}

			if(changeHeight(resize.obj.id)){
				resize.parent.style.height = (event.clientY - resize.initMouseY + resize.parentHeight) + "px";
				// resize.parent.style.left = resize.parentLeft - Math.sin(myangle * Math.PI / 180) * (event.clientY - resize.initMouseY) / 2 + "px";
				// resize.parent.style.top = resize.parentTop - Math.sin(myangle * Math.PI / 180) * (event.clientY - resize.initMouseY) / 2 + "px";
			}

			if(changeWidthLeft(resize.obj.id)){
				resize.parent.style.width = (-event.clientX + resize.initMouseX + resize.parentWidth) + "px";
				// resize.parent.style.left = event.clientX + "px";
			}

			if(changeHeightTop(resize.obj.id)){
				resize.parent.style.height = (-event.clientY + resize.initMouseY + resize.parentHeight) + "px";
				resize.parent.style.top = event.clientY + "px";	

			}
			

			// event.stopPropagation();
			// return false;
		},
	}

	resize.init(element);
	// resize.obj.onclick = resize.click;

	return resize;
}

