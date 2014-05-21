var header = document.getElementById("header");
var main = document.getElementById("main");
var start = document.getElementById("button");
var rectangles = new Array();
var startTime , bestTime , bestClick, intersect;
var n = 3;
//main.appendChild(document.createElement("div").appendChild("gjdojf"));

function getColor(){
	var color = "rgb(" + Math.floor(Math.random()*240+15)+",";
	color += Math.floor(Math.random()*240+15)+",";
	color += Math.floor(Math.random()*240+15)+")";
	return color;
}
function isIntersect(a,b){
	var rect1 = a.getBoundingClientRect();
	//var l1 = rect1.left;
	//var t1 = rect1.top;
	//var b1 = rect1.bottom;
	//var r1 = rect1.right;
	var l1 = Number(a.style.left.replace("px",""));
	var t1 = Number(a.style.top.replace("px",""));
	var b1 = t1+Number(a.style.width.replace("px",""));
	var r1 = l1+Number(a.style.height.replace("px",""));
	var rect2 = b.getBoundingClientRect();
	//var l2 = rect2.left;
	//var t2 = rect2.top;
	//var r2 = rect2.right;
	//var b2 = rect2.bottom;
	var l2 = Number(b.style.left.replace("px",""));
	var t2 = Number(b.style.top.replace("px",""));
	var b2 = t2+Number(b.style.width.replace("px",""));
	var r2 = l2+Number(b.style.height.replace("px",""));
	alert(l1+" "+r1+" "+t1+" "+b1+"\n"+l2+" "+r2+" "+t2+" "+b2);
	if ((l1>r2)||(r1<l2)||(t1>b2)||(b1<t2)){
		return false;
	}
	return true;
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}
function isIntersect2(a, b) {
	var ap = getPosition(a);
	var bp = getPosition(b);

	var l1 = ap.x, r1 = ap.x + a.offsetWidth,
		t1 = ap.y, b1 = a.offsetHeight;
	var l2 = bp.x, r2 = bp.x + b.offsetWidth,
		t2 = bp.y, b2 = b.offsetHeight;

	console.log(ap.x, ap.y, a.offsetWidth, a.offsetHeight);
	console.log(bp.x, bp.y, b.offsetWidth, b.offsetHeight);
	var result;

	if (l1>r2 || r1<l2 || t1>b2 || b1 < t2){
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
	//for (var i = 0; i < rectangles.length; i++){
	//	main.removeChild(rectangles[i]);
	//}

}
function startGame(){
	//for (var i = 0; i < rectangles.length; i++){
	//	main.removeChild(rectangles[i]);
	//}
	rectangles = new Array();
	intersect = 0;
	for (var i = 0; i < n; i++){
		var rectangle = document.createElement("div");
		//var width = 20;
		//var height = 20;
		var height = Math.floor(Math.random()*300+30);
		rectangle.style.height = height+"px";
		var width = Math.floor(Math.random()*300+30);
		rectangle.style.width = width+"px";
		rectangle.className = "rectangle";
		rectangle.id = "rect"
		
		rectangle.style.left = Math.floor(Math.random()*(1000-width))+"px";
		rectangle.style.top = Math.floor(Math.random()*(500-height))+"px";
		
		
		//rectangle.style.top = 0;
		//rectangle.style.left = 0;
		

		rectangle.style.background = getColor();
		rectangle.onclick = function(){
			var index;
			for (var i = 0; i < rectangles.length; i++){
				if (rectangles[i]==this){
					index = i;
				} else {
					if (isIntersect2(rectangles[i],this)){
						intersect--;

					}
				}
			}
			console.log(intersect);
			rectangles.splice(index,1);
			main.removeChild(this);
			if (intersect == 0){
				endGame();
			}
		} 	
		rectangles[i] = rectangle;
		main.appendChild(rectangle);
	}

	//isIntersect2(rectangles[0], rectangles[1]);
	for (var i = 0; i < n; i++){
		for (var j = i+1; j < n; j++){
			console.log(rectangles[i]);
			console.log(rectangles[j]);
			if (isIntersect2(rectangles[i],rectangles[j])){
				intersect++;
				console.log(true);
			}
		}
	}
	console.log(intersect);
	startTime = new Date();
	if (intersect == 0){
		endGame();
	}
}

start.onclick = startGame;

