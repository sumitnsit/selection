
var selectedDivArrays = {};

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
}

function keyDown(){

	if(event.keyCode === 91){
		controlKeyPressed = true;
	}
}

function keyUp(){
	if(event.keyCode === 91){
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
	newDiv.style.width = newDivProperties.defaultWidth + "px";
	newDiv.style.height = newDivProperties.defaultHeight + "px";
	newDiv.style.left = (parent.clientWidth - newDivProperties.defaultWidth)/2 + "px";
	newDiv.style.top = (parent.clientHeight - newDivProperties.defaultHeight)/2 + "px";
	
	return newDiv;
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

			if(controlKeyPressed === true){
				if(drag.selected === false){
					drag.selected = true;
					drag.obj.className += " selected";
					pushItem(drag.obj.id, drag);	
				} else {
					drag.selected = false;
					drag.obj.className = drag.obj.className.replace(/selected/,'')
					popItem(drag.obj.id);	
				}
			}

			document.addEventListener("mousemove", moveElements, false);

			event.stopPropagation();

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
	element.onmouseup = drag.mouseUp;

	return drag;
}