var header = document.getElementById("header");
var main = document.getElementById("main");
var start = document.getElementById("button");
var rectangles;
var startTime , bestTime , bestClick, intersect;
var n = 5;

function genColor() {
  var r = Math.floor( 255*Math.random() ),
      g = Math.floor( 255*Math.random() ),
      b = Math.floor( 255*Math.random() );
  var res = "rgb("+r+","+g+","+b+")";
  return res;
}

function gameOver() {
  var totalTime = new Date() - startTime;
  alert ("Total time: "+totalTime+"\nRectangles removed: "+(n-rectangles.length));
}

function rectangle() {
  this.width = Math.floor( 300*Math.random() + 30 );
  this.height = Math.floor( 300*Math.random() + 30 );

  this.x = Math.floor( (main.offsetWidth-this.width)*Math.random() );
  this.y = Math.floor( (main.offsetHeight-this.height)*Math.random() );

  console.log(this.x, this.y);

  this.color = genColor();

  this.createDiv = function() {
    var div = document.createElement('div');
    div.style.top = this.y+"px";
    div.style.left = this.x+"px";
    div.style.background = this.color;
    div.style.width = this.width+"px";
    div.style.height = this.height+"px";
		div.className = "rectangle";

    div.onclick = function() {
      
      //for(var i=0; i<rectangles.length; i++) {
      //  if(checkCollision(owner, rectangles[i])){
      //    intersect--;
      //  }
      //}
      //intersect++;
      main.removeChild(this);
      rectangles.splice(rectangles.indexOf(this),1);  
      if(checkAll()) {
        gameOver();
      }
    }

    return div;
  }

  this.div = this.createDiv();
}

function checkCollision(a, b) {
  return (a.x<=b.x+b.width && a.x+a.width>=b.x && a.y<=b.y+b.height && a.y+a.height>=b.y);
}

function checkAll() {
  for(var i=0; i<rectangles.length-1; i++){
    for(var j=i+1; j<rectangles.length; j++){
      if (checkCollision(rectangles[i], rectangles[j])) {
        return false;
      }
    }
  }
  return true;
}

function genLevel() {
  intersect = 0;
  rectangles = new Array();
  startTime = new Date();
  while(main.firstChild) main.removeChild(main.firstChild);

  for (var i=0; i<n; i++) {
    var rect = new rectangle();
    main.appendChild(rect.div);
    rectangles.push(rect);
  }

  for (var i=0; i<n-1; i++) {
    for (var j=i+1; j<n; j++) {
      if(checkCollision(rectangles[i], rectangles[j])) intersect++;
    }
  }
  
  console.log(intersect);
}

start.onclick = genLevel;
