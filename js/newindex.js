class Part {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Snake {
    constructor() {
        this.parts = []
        this.expand(100, 100);
    }
    expand(x, y) {
        this.parts.push(new Part(x, y))
    }
    draw(ctx) {
        this.parts.forEach((part, index) => {
            ctx.beginPath();
            ctx.arc(part.x, part.y, 10, 0, Math.PI * 2);
            let color = '#' + Math.random().toString(16).substr(-6);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        })
    }
    move(xVelocity, yVelocity) {
        this.parts[0].x = this.parts[0].x + xVelocity;
        this.parts[0].y = this.parts[0].y + yVelocity;
    }
}
class Apple {
    constructor() {
        this.spawn()
    }
    spawn() {
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
}
class GameState {
    constructor() {
        this.snake = new Snake();
        this.apple = new Apple();
        console.log("Created class")
    }
    dupa() {
        console.log("dupa")
    }
    draw(ctx) {
        console.log({ game: this })
        this.snake.draw(ctx);
        this.apple.draw(ctx);
    }

    handleKeyPress(key) {
        const xVelocity = 10;
        const yVelocity = -10;
        switch (key.keyCode) {
            case 37:
                this.snake.move(-10, 0);
                break;
            case 38:
                this.snake.move(0 , -10);
                break;
            case 39:
                this.snake.move(10,0);
                break;
            case 40:
                this.snake.move(0, 10);
                break;
        }
    }
};



const gameState = new GameState();
window.gameState = gameState;
gameState.dupa()
$(document).ready(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    gameState.draw(ctx);
    document.onkeydown = function (key) {
        gameState.handleKeyPress(key);
    }
    setInterval(function () {
        gameState.draw(ctx);
    }, 10)

});