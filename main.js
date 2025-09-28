const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dog image
const dogImg = new Image();
dogImg.src = "assets/dog.png"; // make sure dog.png is in same folder

// Dog settings
const dogWidth = 60;
const dogHeight = 60;
let dogX = 50;
let dogY = canvas.height - dogHeight;
let velocityY = 0;
const gravity = 1.5;
const jumpPower = -18;

// Obstacles
let obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 40;
let frameCount = 0;

// Score
let score = 0;

// Game state
let gameOver = false;
let gameStarted = false;

// Speed control
let gameSpeed = 3;
let speedIncrease = 0.002;

// Jump / Start / Restart
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!gameStarted) {
      resetGame();
      gameStarted = true;
      requestAnimationFrame(gameLoop);
    } else if (gameOver) {
      resetGame();
      gameStarted = true;
      gameOver = false;
      requestAnimationFrame(gameLoop);
    } else if (dogY >= canvas.height - dogHeight) {
      velocityY = jumpPower;
    }
  }
});

// Reset game state
function resetGame() {
  dogX = 50;
  dogY = canvas.height - dogHeight;
  velocityY = 0;
  obstacles = [];
  frameCount = 0;
  score = 0;
  gameSpeed = 3;
}

// Main loop
function gameLoop() {
  if (gameOver) {
    showGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dog physics
  velocityY += gravity;
  dogY += velocityY;
  if (dogY > canvas.height - dogHeight) {
    dogY = canvas.height - dogHeight;
    velocityY = 0;
  }

  // Draw dog
  ctx.drawImage(dogImg, dogX, dogY, dogWidth, dogHeight);

  // Obstacles
  frameCount++;
  if (frameCount % 90 === 0) {
    obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight });
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.fillStyle = "black";
    ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight);

    // Collision check
    if (
      dogX < obs.x + obstacleWidth &&
      dogX + dogWidth > obs.x &&
      dogY < obs.y + obstacleHeight &&
      dogY + dogHeight > obs.y
    ) {
      gameOver = true;
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x + obstacleWidth > 0);

  // Score
  score++;
  document.getElementById("score").innerText = "Score: " + score;

  // Speed increase
  gameSpeed += speedIncrease;

  requestAnimationFrame(gameLoop);
}

// Game Over screen
function showGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

// Initial message
ctx.fillStyle = "black";
ctx.font = "24px Arial";
ctx.textAlign = "center";
ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2);
