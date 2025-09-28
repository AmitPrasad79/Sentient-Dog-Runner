const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dog image
const dogImg = new Image();
dogImg.src = "assets/dog.png"; // make sure dog.png is in same folder

// Dog settings
const dogWidth = 60;
const dogHeight = 60;
let dogY = canvas.height - dogHeight;
let velocityY = 0;
const gravity = 0.7;
const jumpPower = -16;
let jumpForward = 0; // horizontal boost when jumping

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
      jumpForward = 5; // move forward a bit during jump
    }
  }
});

// Reset game state
function resetGame() {
  dogX = 50;
  dogY = canvas.height - dogHeight;
  velocityY = 0;
  jumpForward = 0;
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

// Game Over popup
function showGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 80, 300, 160);

  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
  ctx.font = "20px Arial";
  ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 50);
}

// Initial message
ctx.fillStyle = "black";
ctx.font = "24px Arial";
ctx.textAlign = "center";
ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2);
