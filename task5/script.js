var header = document.getElementById("header");
var main = document.getElementById("main");
var start = document.getElementById("button");
var rectangles = new Array();
var startTime , bestTime , bestClick, intersect;
var n = 20;
//main.appendChild(document.createElement("div").appendChild("gjdojf"));

function getColor(){
	var color = "rgb(" + Math.floor(Math.random()*240+15)+",";
	color += Math.floor(Math.random()*240+15)+",";
	color += Math.floor(Math.random()*240+15)+")";
	return color;
}
function isIntersect(a,b){
	var rect1 = a.getBoundingClientRect();
	var l1 = rect1.top;
	var t1 = rect1.left;
	var b1 = rect1.bottom;
	var r1 = rect1.right;
	var rect2 = b.getBoundingClientRect();
	var l2 = rect2.left;
	var t2 = rect2.top;
	var r2 = rect2.right;
	var b2 = rect2.bottom;
	if ((l1>r2)||(r1<l2)||(t1>b2)||(b1<t2)){
		return false;
	}
	return true;
}

function endGame(){
	var time = new Date()-startTime;
	if ((bestTime==null)||(time<bestTime)){
		bestTime = time;
	}
	if ((bestClick==null)||(n - rectangles.length<bestClick)){
		bestClick = n - rectangles.length;
	}
	alert("Time: "+time+"\n"+"Clicks: "+(n-rectangles.length));
	for (var i = 0; i < rectangles.length; i++){
		main.removeChild(rectangles[i]);
	}

}
function startGame(){
	for (var i = 0; i < rectangles.length; i++){
		main.removeChild(rectangles[i]);
	}
	rectangles = new Array();
	intersect = 0;
	for (var i = 0; i < n; i++){
		var rectangle = document.createElement("div");
		var height = Math.floor(Math.random()*300+30);
		rectangle.style.height = height+"px";
		var width = Math.floor(Math.random()*300+30);
		rectangle.style.width = width+"px";
		rectangle.className = "rectangle"
		rectangle.style.left = Math.floor(Math.random()*(1000-width))+"px";
		rectangle.style.top = Math.floor(Math.random()*(500-height))+"px";
		rectangle.style.background = getColor();
		rectangle.onclick = function(){
			var index;
			for (var i = 0; i < rectangles.length; i++){
				if (rectangles[i]==this){
					index = i;
				} else {
					if (isIntersect(rectangles[i],this)){
						intersect--;
					}
				}
			}
			rectangles.splice(index,1);
			main.removeChild(this);
			if (intersect == 0){
				endGame();
			}
		} 	
		rectangles.push(rectangle);
		main.appendChild(rectangle);
	}
	for (var i = 0; i < n; i++){
		for (var j = i+1; j < n; j++){
			if (isIntersect(rectangles[i],rectangles[j])){
				intersect++;
			}
		}
	}
	startTime = new Date();
	if (intersect == 0){
		endGame();
	}
}

start.onclick = startGame;

