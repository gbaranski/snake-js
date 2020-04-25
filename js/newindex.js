class Part {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor() {
        this.parts = []
        this.parts.push(new Part(100, 100))
        console.log(this.parts);
    }
    extend() {
        const { x, y } = this.parts[this.parts.length - 1]
        console.log({x,y})
        this.parts.push(new Part(x, y))
    }
    draw(ctx) {
        this.parts.forEach((part, index) => {
            ctx.beginPath();
            ctx.arc(part.x, part.y, 10, 0, Math.PI * 2);
            if(index == 0) {
                ctx.fillStyle = "#fff000";
            } else{
                ctx.fillStyle = "#212121";
            }
            ctx.fill();
            ctx.closePath();
        })
    }
    getHeadPosition() {
        return this.parts[0];
    }
    move(xVelocity, yVelocity) {
        const newHead = this.parts[0];
        newHead.x += xVelocity;
        newHead.y += yVelocity;
        const newParts = this.parts
            .filter((_, index) => index > 0)
            .map((_, index) => new Part(this.parts[index].x, this.parts[index].y));
            this.parts = [newHead, ...newParts];
    }
    
}

class Apple {
    constructor() {
        this.respawn()
    }
    respawn() {
        this.x = Math.floor(Math.random() * Math.floor((canvas.width / 1.1) / 10)) * 10;
        this.y = Math.floor(Math.random() * Math.floor((canvas.height / 1.3) / 10)) * 10;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, 10, 10);
        ctx.strokeStyle = "#ff0000";
        ctx.stroke();
        ctx.closePath();
    }
    getPosistion() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
class GameState {
    constructor() {
        this.snake = new Snake();
        this.apple = new Apple();
    }
    draw(ctx) {
        this.snake.draw(ctx);
        this.apple.draw(ctx);
    }
    move(){
        this.snake.move(this.dx || 0, this.dy || 0);
    }
    changeDirection(dx,dy) {
        this.dx = dx;
        this.dy = dy;
    }
    checkIfCollideWithApple() {
        if(Math.abs(this.snake.getHeadPosition().x - this.apple.getPosistion().x) < 20 
        && Math.abs(this.snake.getHeadPosition().y - this.apple.getPosistion().y) < 20 ) {
            this.apple.respawn();
            this.snake.extend();
        }
    }
    checkIfCollideWithWall(canvas) {
        if(this.snake.getHeadPosition().x>=canvas.width) {
            return true;
        }
        if(this.snake.getHeadPosition().x<=0){
            return true;
        }
        if(this.snake.getHeadPosition().y>=canvas.height) {
            return true;
        }
        if(this.snake.getHeadPosition().y<=0) {
            return true;
        }
        return false;
    }
    drawGrid(canvas, ctx) {
        for (var x = 0.5; x < canvas.width; x += 20) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
          }
          
          for (var y = 0.5; y < canvas.height; y += 20) {
            ctx.moveTo(0, y);
            ctx.lineTo(480, y);
          }
          ctx.strokeStyle = "#ddd";
          ctx.stroke();
        }
};



const gameState = new GameState();
window.gameState = gameState;

function handleKeyPress(key) {
    switch (key.keyCode) {
        case 37:
            gameState.changeDirection(-10, 0);
            break;
        case 38:
            gameState.changeDirection(0 , -10);
            break;
        case 39:
            gameState.changeDirection(10,0);
            break;
        case 40:
            gameState.changeDirection(0, 10);
            break;
    }
}

$(document).ready(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    gameState.draw(ctx);
    document.onkeydown = function (key) {
        handleKeyPress(key);
    }
    const renderGameInterval = setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameState.drawGrid(canvas, ctx);
        gameState.draw(ctx);
        
    }, 10)
    const tickSnakeInterval = setInterval(function () {
        gameState.move();   
        gameState.checkIfCollideWithApple(); 
        if(gameState.checkIfCollideWithWall(canvas)) {
            console.log("Snake is dead");
            clearInterval(tickSnakeInterval);
            clearInterval(renderGameInterval);
        }
    }, 100)
    

});