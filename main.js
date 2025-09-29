const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load dog frames (dog.png, dog2.png ... dog4.png)
const dogFrames = [];
["dog.png", "dog2.png", "dog3.png", "dog4.png"].forEach(name => {
  const img = new Image();
  img.src = `assets/${name}`;
  dogFrames.push(img);
});

let currentFrame = 0;
let frameTick = 0;

// Dog settings
const dogWidth = 60;
const dogHeight = 60;
let dogX = 50;
let dogY = canvas.height - dogHeight;
let velocityY = 0;
const gravity = 0.6;
const jumpPower = -15;

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

// Input (keyboard, touch, click)
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") handleInput();
});
document.addEventListener("touchstart", handleInput);
document.addEventListener("mousedown", handleInput);

function handleInput() {
  if (!gameStarted) {
    resetGame();
    gameStarted = true;
    requestAnimationFrame(gameLoop);
  } else if (gameOver) {
    resetGame();
    gameOver = false;
    gameStarted = true;
    requestAnimationFrame(gameLoop);
  } else if (dogY >= canvas.height - dogHeight) {
    velocityY = jumpPower;
  }
}

function resetGame() {
  dogX = 50;
  dogY = canvas.height - dogHeight;
  velocityY = 0;
  obstacles = [];
  frameCount = 0;
  score = 0;
  gameSpeed = 3;
}

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

  // Animate dog (cycle frames only when running on ground)
  frameTick++;
  if (frameTick % 6 === 0 && dogY >= canvas.height - dogHeight) {
    currentFrame = (currentFrame + 1) % dogFrames.length;
  }
  ctx.drawImage(dogFrames[currentFrame], dogX, dogY, dogWidth, dogHeight);

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

    // Collision detection
    if (
      dogX < obs.x + obstacleWidth &&
      dogX + dogWidth > obs.x &&
      dogY < obs.y + obstacleHeight &&
      dogY + dogHeight > obs.y
    ) {
      gameOver = true;
    }
  }

  obstacles = obstacles.filter(obs => obs.x + obstacleWidth > 0);

  // Score
  score++;
  document.getElementById("score").innerText = "Score: " + score;

  // Speed increase
  gameSpeed += speedIncrease;

  requestAnimationFrame(gameLoop);
}

function showGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 80, 300, 160);

  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
  ctx.font = "20px Arial";
  ctx.fillText("Tap or Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 50);
}

// Initial screen text
ctx.fillStyle = "black";
ctx.font = "24px Arial";
ctx.textAlign = "center";
ctx.fillText("Press SPACE or TAP to Start", canvas.width / 2, canvas.height / 2);
