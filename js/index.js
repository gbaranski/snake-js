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
    }
    extend(dx, dy) {
        const { x, y } = this.parts[this.parts.length - 1]
        this.parts.push(new Part(x - dx, y - dy))
    }
    draw(ctx) {
        this.parts.forEach((part, index) => {
            ctx.beginPath();
            ctx.arc(part.x, part.y, 10, 0, Math.PI * 2);
            if (index == 0) {
                ctx.fillStyle = "#ff0000";
            } else {
                ctx.fillStyle = `rgb(${255 * index / this.parts.length * index % 3}, ${255 * index / this.parts.length}, ${255 * index / this.parts.length * index % 3})`;
            }
            ctx.fill();
            ctx.closePath();
        })
    }
    getHeadPosition() {
        return this.parts[0];
    }
    move(xVelocity, yVelocity) {
        const newHead = new Part(this.parts[0].x, this.parts[0].y)
        newHead.x += xVelocity;
        newHead.y += yVelocity;
        const newParts = this.parts
            .filter((_, index) => index > 0)
            .map((_, index) => new Part(this.parts[index].x, this.parts[index].y));
        this.parts = [newHead, ...newParts];
    }
    getTail() {
        return this.parts.slice(1);
    }

}

class Apple {
    constructor() {
        this.appleIcon = new Image();
        this.appleIcon.src = "assets/apple.png";
        this.scaleMultiplier = 5;
    }
    respawn(canvasWidth, canvasHeight) {
        this.scaleMultiplier = 0;
        this.x = Math.floor(Math.random() * Math.floor((canvasWidth / 1.1) / 10)) * 10;
        this.y = Math.floor(Math.random() * Math.floor((canvasHeight / 1.3) / 10)) * 10;
    }
    draw(ctx) {
        if(this.scaleMultiplier < 5) {
            this.scaleMultiplier = this.scaleMultiplier + 0.3;
        }
        this.appleObject = ctx.drawImage(this.appleIcon, this.x, this.y, this.appleIcon.width * this.scaleMultiplier / 100, this.appleIcon.height * this.scaleMultiplier / 100);
    }
    getPosistion() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
class Canvas {
    constructor(canvas, ctx, gameState) {
        this.canvas = canvas
        this.ctx = ctx
        this.gameState = gameState
    }
    draw() {
        this.gameState.snake.draw(this.ctx);
        this.gameState.apple.draw(this.ctx);
    }
    drawGrid() {
        for (let x = 0.5; x < this.canvas.width; x += 20) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }

        for (let y = 0.5; y < this.canvas.height; y += 20) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.strokeStyle = "#ddd";
        this.ctx.stroke();
    }
    drawScore() {
        this.ctx.fillStyle = "gray";
        this.ctx.font = "10px Montserrat";
        this.ctx.fillText(`Score: ${gameState.score}`, 10, 15);
    }
    clearRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawLoseView() {
        if(localStorage.getItem('hScore') < this.gameState.score || localStorage.getItem('hScore') == null) {
            localStorage.setItem('hScore', this.gameState.score);
        }
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Montserrat";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Score: ${gameState.score}`, canvas.width/2, canvas.height/2);
        this.ctx.fillText(`Highest score: ${localStorage.getItem('hScore')}`, canvas.width/2, canvas.height/2 + 30); 
    } 
}
class GameState {
    constructor(canvasWidth, canvasHeight) {
        this.snake = new Snake();
        this.apple = new Apple();
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.apple.respawn(canvasWidth, canvasHeight);
        this.score = 0;
    }

    move() {
        this.snake.move(this.dx || 0, this.dy || 0);
    }
    changeDirection(dx, dy) {
        if (this.dx == -dx || this.dy == -dy && this.snake.getTail().length > 1) {
        } else {
            this.dx = dx;
            this.dy = dy;
        }

    }
    checkIfCollideWithApple() {
        if (Math.abs(this.snake.getHeadPosition().x - this.apple.getPosistion().x) < 30
            && Math.abs(this.snake.getHeadPosition().y - this.apple.getPosistion().y) < 30) {
            this.apple.respawn(this.canvasWidth, this.canvasHeight);
            this.snake.extend(this.dx || 0, this.dy || 0);
            this.score = this.score + 1;
        }
    }
    checkIfCollideWithWall() {
        if (this.snake.getHeadPosition().x >= this.canvasWidth) {
            return true;
        }
        if (this.snake.getHeadPosition().x <= 0) {
            return true;
        }
        if (this.snake.getHeadPosition().y >= this.canvasHeight) {
            return true;
        }
        if (this.snake.getHeadPosition().y <= 0) {
            return true;
        }
        return false;
    }
    checkIfCollideWithTail() {
        return this.snake.getTail().some(coordinates => {
            if (coordinates.x === this.snake.getHeadPosition().x
                && coordinates.y === this.snake.getHeadPosition().y) {
                return true;
            }
            return false;
        });

    }

};



$(document).ready(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const gameState = new GameState(canvas.width, canvas.height);
    const gameCanvas = new Canvas(canvas, ctx, gameState);

    window.gameState = gameState;

    document.onkeydown = function (key) {
        handleKeyPress(key);
    }
    const renderGameInterval = setInterval(function () {
        gameCanvas.clearRect();
        // gameCanvas.drawGrid();
        gameCanvas.draw();
        gameCanvas.drawScore();
    }, 3)
    const tickSnakeInterval = setInterval(function () {
        gameState.move();
        gameState.checkIfCollideWithApple();
        if (gameState.checkIfCollideWithWall() || gameState.checkIfCollideWithTail()) {
            clearInterval(tickSnakeInterval);
            clearInterval(renderGameInterval);
            gameCanvas.drawLoseView();
        }
    }, 20)
});


function handleKeyPress(key) {
    switch (key.keyCode) {
        case 37:
            gameState.changeDirection(-5, 0);
            break;
        case 38:
            gameState.changeDirection(0, -5);
            break;
        case 39:
            gameState.changeDirection(5, 0);
            break;
        case 40:
            gameState.changeDirection(0, 5);
            break;
    }
}