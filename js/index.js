var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height /2;
var yCells = [];
var xCells = [];
var dx = 10; // velocity
var dy = -10; // velocity
var objectX;
var objectY;
var score = 0;
var color = '#' + Math.random().toString(16).substr(-6);
var moveDirectory;

function createNewObject() {
    objectX = Math.floor(Math.random() * Math.floor((canvas.width/1.1) / 10)) * 10;
    objectY = Math.floor(Math.random() * Math.floor((canvas.height/1.3) / 10)) * 10;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    for(let i = 0; i<xCells.length; i++) {
        ctx.arc(xCells[i], yCells[i] + 10, ballRadius, 0, Math.PI * 2);
        
        if(xCells[i] < x) {
            xCells[i]+=dx/10;
        }else {
            xCells[i]-=dx/10;
        }

        if(yCells[i] < y) {
            yCells[i]-=dy/10;
        }else {
            yCells[i]+=dy/10;
        }
        
    }
    console.log(xCells);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawObject() {
    ctx.beginPath();
    // ctx.arc(objectX, objectY, ballRadius, 0, Math.PI * 2);
    ctx.rect(objectX, objectY, ballRadius, ballRadius);
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();
    ctx.closePath();
}
function draw() {
    if(Math.abs(objectX-x) < 20 && Math.abs(objectY-y) < 20 ) {
        createNewObject();
        xCells.push(x);
        yCells.push(y);
        score++;
        document.getElementById("score").innerText = "Score: " + score;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawObject();
    document.getElementById('xlabel').innerText = "x: " + x;
    document.getElementById('ylabel').innerText = "y: " + y;
    switch(moveDirectory) {
        case "up":
            y+=dy/10;
            break;
        case "left":
            x-=dx/10;
            break;
        case "right":
            x+=dx/10;
            break;
        case "down":
            y-=dy/10;
            break;
    }
    if(x>canvas.width) {
        x = 0; 
    }
    if(x<0){
        x=canvas.width;
    }
    if(y>canvas.height) {
        y = 0;
    }
    if(y<0) {
        y=canvas.height;
    }
    
}

document.onkeydown = function (key) {
    switch (key.keyCode) {
        case 37:
            moveDirectory = "left";
            break;
        case 38:
            moveDirectory = "up";
            break;
        case 39:
            moveDirectory = "right";
            break;
        case 40:
            moveDirectory = "down";
            break;
    }
};


setInterval(draw, 10);