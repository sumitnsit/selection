
var selectedDivArrays = {};

var mangle = 0;
var multiselect = false;
var mouseX = undefined;
var mouseY = undefined;
var controlKeyPressed = false;

var newDivProperties = {
	counter: 0,
	prefix: "kdiv_",
	defaultWidth: 100,
	defaultHeight: 100,
	className: "kdiv"
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

function pushItem(key, value){
	selectedDivArrays[key] = value;
}

function popItem(key){
	delete selectedDivArrays[key];	
}

function init(){
	document.addEventListener("mouseup", mouseup, false);
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);

	var workarea = document.getElementById("workarea");

	workarea.onclick = function(){

		clean();
		event.stopPropagation();
		return false
	}
}

function clean(){
			for (var key in selectedDivArrays) {
		  if (selectedDivArrays.hasOwnProperty(key)) {

		  	selectedDivArrays[key].obj.className = selectedDivArrays[key].obj.className.replace(/selected/,'')
		  	selectedDivArrays[key].obj.className += " hideHooks";
		  	selectedDivArrays[key].selected = false;
		  	delete selectedDivArrays[key];
		  }

		}
}

function keyDown(){

	if(event.keyCode === 91 || event.keyCode === 17){
		controlKeyPressed = true;
	}
}

function keyUp(){
	if(event.keyCode === 91 || event.keyCode === 17){
		controlKeyPressed = false;
	}
}

function newDivbuttonClicked(){
	var workarea = document.getElementById("workarea");
	var newDiv = addDiv(workarea);
	workarea.appendChild(newDiv);
	addDragablity(newDiv);

	
}

function addDiv(parent){

	var newDiv = document.createElement("div");
	newDiv.id = newDivProperties.prefix + ++newDivProperties.counter;
	newDiv.className = newDivProperties.className;
	newDiv.className += " hideHooks";
	newDiv.style.width = newDivProperties.defaultWidth + "px";
	newDiv.style.height = newDivProperties.defaultHeight + "px";
	newDiv.style.left = (parent.clientWidth - newDivProperties.defaultWidth)/2 + "px";
	newDiv.style.top = (parent.clientHeight - newDivProperties.defaultHeight)/2 + "px";
	
	addHooks(newDiv);
	addRotatingHook(newDiv);
	return newDiv;
}

function isMultiple(){
	for (var key in selectedDivArrays) {
	  return true;
	}
	return false;
}

function moveElements(){
	var currentX = event.clientX;
	var currentY = event.clientY;

	if(mouseX === undefined){
		mouseX = currentX;
		mouseY = currentY;
	}

	var dx = mouseX - currentX;
	var dy = mouseY - currentY;
	
	for (var key in selectedDivArrays) {
	  if (selectedDivArrays.hasOwnProperty(key)) {
	    

		var left = selectedDivArrays[key].leftDistance - dx;
		var top = selectedDivArrays[key].topDistance - dy;

		selectedDivArrays[key].obj.style.left = left + "px";
		selectedDivArrays[key].obj.style.top = top + "px";

		selectedDivArrays[key].tempLeft = left;
		selectedDivArrays[key].tempTop = top;

	  }
	}

	// for(var index = 0; index < selectedDivArrays.length; index++){
	
	// 	var left = selectedDivArrays[index].leftDistance - dx;
	// 	var top = selectedDivArrays[index].topDistance - dy;

	// 	selectedDivArrays[index].obj.style.left = left + "px";
	// 	selectedDivArrays[index].obj.style.top = top + "px";

	// 	selectedDivArrays[index].tempLeft = left;
	// 	selectedDivArrays[index].tempTop = top;
	// }

	return false;
}

function mouseup(){
	document.removeEventListener("mousemove", moveElements, false);

	mouseX = undefined;
	mouseY = undefined;

	for (var key in selectedDivArrays) {
	  if (selectedDivArrays.hasOwnProperty(key)) {
		selectedDivArrays[key].leftDistance = selectedDivArrays[key].tempLeft;
		selectedDivArrays[key].topDistance = selectedDivArrays[key].tempTop;
	  }
	 }
	// for(var index = 0; index < selectedDivArrays.length; index++){
		// selectedDivArrays[index].leftDistance = selectedDivArrays[index].tempLeft;
		// selectedDivArrays[index].topDistance = selectedDivArrays[index].tempTop;
	// }
}


function setSelected(drag){
	drag.selected = true;
	drag.obj.className += " selected";
  	drag.obj.className = drag.obj.className.replace(/hideHooks/,'');
}

function unsetSelected(drag){
	drag.selected = false;
	drag.obj.className += " hideHooks";
  	drag.obj.className = drag.obj.className.replace(/selected/,'');
}

function addDragablity(element){
	
	var drag = {
		"leftDistance": undefined,
		"topDistance": undefined,
		"mouseClickedX": undefined,
		"mouseClickedY": undefined,
		"obj": element,
		"tempLeft": undefined,
		"tempTop": undefined,
		"selected": false,

		mouseDown: function(){

			//Saving location of the element which is clicked
			drag.leftDistance = drag.obj.offsetLeft;
			drag.topDistance = drag.obj.offsetTop;

			//Saving point where mouse clicked
			drag.mouseClickedX = event.clientX;
			drag.mouseClickedY = event.clientY;

			document.addEventListener("mousemove", moveElements, false);

			if(drag.selected === false){
				setSelected(drag);
				pushItem(drag.obj.id, drag);	
			}			

			if(controlKeyPressed === true){

			} else {
				clean();
				pushItem(drag.obj.id, drag);
				setSelected(drag);
			}

			// if(controlKeyPressed === true){
			// 	if(drag.selected === false){
			// 		drag.selected = true;
			// 		drag.obj.className += " selected";
			// 	  	drag.obj.className = drag.obj.className.replace(/hideHooks/,'');

			// 		pushItem(drag.obj.id, drag);	
			// 	} else {
			// 		drag.selected = false;
			// 		drag.obj.className = drag.obj.className.replace(/selected/,'')
			// 		drag.obj.className += " hideHooks";
			// 		popItem(drag.obj.id);	
			// 	}
			// } else {
			// 	if(drag.selected === false){
			// 		clean();
			// 		drag.selected = true;
			// 		drag.obj.className += " selected";
			// 		drag.obj.className = drag.obj.className.replace(/hideHooks/,'');
			// 		pushItem(drag.obj.id, drag);
			// 	} else {
			// 		drag.selected = false;
			// 		clean();
			// 		popItem(drag.obj.id);
			// 	}
			// }

			

			event.stopPropagation();

			return false;
		},

		click: function(){
			// if(controlKeyPressed === true){
			event.stopPropagation();
			return false;
			// }

			// if(drag.selected === false){
			// 	drag.selected = true;
			// 	drag.obj.className += " selected";
			// 	drag.obj.className = drag.obj.className.replace(/hideHooks/,'');
			// 	pushItem(drag.obj.id, drag);				
			// } else {
			// 	clean();
			// 	drag.selected = false;
			// }
			
			// event.stopPropagation();
			// return false;
		},

		mouseup: function(){
			// console.log(controlKeyPressed);
			// if(controlKeyPressed === false || multiselect === false){
			// 	unsetSelected(drag);
			// 	popItem(drag.obj.id);	
			// }
			// event.stopPropagation();
			return false;
		},


		getMouseLeft: function(){
			return drag.mouseClickedX - drag.leftDistance;
		},

		getMouseTop: function(){
			return drag.mouseClickedY - drag.topDistance;
		}
	}

	element.onmousedown = drag.mouseDown;
	element.onmouseup = drag.mouseup;
	element.onclick = drag.click;

	return drag;
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
			// resize.obj = this;
			setOrigin(resize.obj.id, resize.obj.parentNode);

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
				// resize.parent.style.left = resize.parentLeft - Math.sin(90 * Math.PI / 180) * (event.clientY - resize.initMouseY) / 2 + "px";
				// resize.parent.style.top = resize.parentTop - Math.sin(90 * Math.PI / 180) * (event.clientY - resize.initMouseY) / 2 + "px";
			}

			if(changeWidthLeft(resize.obj.id)){
				resize.parent.style.width = (resize.initMouseX - event.clientX + resize.parentWidth) + "px";
				resize.parent.style.left = (resize.parentLeft - resize.initMouseX + event.clientX) + "px";
			}

			if(changeHeightTop(resize.obj.id)){
				resize.parent.style.height = (-event.clientY + resize.initMouseY + resize.parentHeight) + "px";
				resize.parent.style.top = (resize.parentTop - resize.initMouseY + event.clientY) + "px";

			}
			

			// event.stopPropagation();
			// return false;
		},
	}

	resize.init(element);
	// resize.obj.onclick = resize.click;

	return resize;
}

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

function addEvent(method, func){
	document.addEventListener(method, func, false);
}

function removeEvent(method, func){
	document.removeEventListener(method, func, false);
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
			mangle = rotate.prvangle;
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

function setOrigin(id, parent){
	if(id === "hook-tl"){
		parent.style.webkitTransformOrigin = "100% 100%";
		// parent.style.webkitTransform = "translate(0%, 0%)";
		// parent.style.left = (parent.offsetLeft - parent.clientWidth) + "px";
		// parent.style.top = (parent.offsetTop - parent.clientHeight) + "px";
	}

	if(id === "hook-tm"){
		parent.style.webkitTransformOrigin = "100% 100%";
		// parent.style.webkitTransform = "translate(0%, 0%)";
		// parent.style.webkitTransform = "rotate(" + mangle + "deg)"; 

	} 

	if(id === "hook-tr"){
		parent.style.webkitTransformOrigin = "0% 100%";
	}

	if(id === "hook-rm"){
		parent.style.webkitTransformOrigin = "0% 0%";
	}

	if(id === "hook-br"){
		parent.style.webkitTransformOrigin = "0% 0%";
	}

	if(id === "hook-bm"){
		parent.style.webkitTransformOrigin = "0% 0%";
	}

	if(id === "hook-bl"){
		parent.style.webkitTransformOrigin = "100% 0%";
	}
		
	if(id === "hook-lm"){
		parent.style.webkitTransformOrigin = "100% 100%";
	} 
}