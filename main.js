const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dog image
const dogImg = new Image();
dogImg.src = "dog.png"; // make sure dog.png is in the same folder

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
const obstacleGap = 200;
let frameCount = 0;

// Score
let score = 0;
let gameOver = false;

// Jump
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && dogY >= canvas.height - dogHeight) {
    velocityY = jumpPower;
  }
});

// Main loop
function gameLoop() {
  if (gameOver) return;

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
    obs.x -= 6;
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
      alert("Game Over! Final Score: " + score);
      document.location.reload();
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x + obstacleWidth > 0);

  // Score
  score++;
  document.getElementById("score").innerText = "Score: " + score;

  requestAnimationFrame(gameLoop);
}

gameLoop();
