const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let player, obstacles, score, highScore, gameOver;
let obstacleSpeed, obstacleBaseSpeed, obstacleMaxSpeed, speedIncreaseRate;

// Load dog sprite
const dogImg = new Image();
dogImg.src = "assets/dog.png"; // make sure this is transparent PNG

// Player object
function resetPlayer() {
    player = {
        x: 50,
        y: canvas.height - 100,
        w: 60,
        h: 60,
        vy: 0,
        gravity: 0.6,
        jumpPower: -12,
        grounded: false,
    };
}

// Reset game
function resetGame() {
    resetPlayer();
    obstacles = [];
    score = 0;
    gameOver = false;
    obstacleBaseSpeed = 3;       // starting speed
    obstacleMaxSpeed = 14;       // max speed
    obstacleSpeed = obstacleBaseSpeed;
    speedIncreaseRate = 0.002;   // ramp up rate
}

// Jump
function jump() {
    if (player.grounded && !gameOver) {
        player.vy = player.jumpPower;
        player.grounded = false;
    }
    if (gameOver) {
        resetGame();
    }
}

// Handle input
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") jump();
});
canvas.addEventListener("click", jump);

// Spawn obstacles
function spawnObstacle() {
    const height = 40 + Math.random() * 30;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        w: 30,
        h: height,
    });
}
setInterval(spawnObstacle, 1800);

// Collision detection
function checkCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Update game logic
function update() {
    if (!gameOver) {
        // Gravity
        player.vy += player.gravity;
        player.y += player.vy;

        if (player.y + player.h >= canvas.height) {
            player.y = canvas.height - player.h;
            player.vy = 0;
            player.grounded = true;
        }

        // Increase speed gradually
        if (obstacleSpeed < obstacleMaxSpeed) {
            obstacleSpeed += speedIncreaseRate;
        }

        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= obstacleSpeed;
            if (obstacles[i].x + obstacles[i].w < 0) {
                obstacles.splice(i, 1);
                score++;
                if (!highScore || score > highScore) {
                    highScore = score;
                }
            }
        }

        // Check collisions
        for (let obs of obstacles) {
            if (checkCollision(player, obs)) {
                gameOver = true;
            }
        }
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player (dog)
    ctx.drawImage(dogImg, player.x, player.y, player.w, player.h);

    // Obstacles
    ctx.fillStyle = "#8b4513";
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    }

    // Score
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 10, 25);

    if (highScore) {
        ctx.fillText("High Score: " + highScore, 10, 50);
    }

    // Game Over
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "32px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Space / Click to Restart", canvas.width / 2 - 150, canvas.height / 2 + 40);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
resetGame();
gameLoop();
