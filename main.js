// Get canvas & context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let dogImg = new Image();
dogImg.src = "assets/dog.png"; // make sure this path is correct in your repo

let dog;
let gravity = 0.5;
let obstacles = [];
let score = 0;
let gameOver = false;
let gameStarted = false;

// Setup dog
function resetDog() {
  dog = {
    x: 30,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    velocityY: 0,
    jumpPower: -10
  };
}

// Start/Reset game
function startGame() {
  resetDog();
  obstacles = [];
  score = 0;
  gameOver = false;
  gameStarted = true;
}

// Handle jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) {
      startGame();
    } else if (!gameOver && dog.y >= canvas.height - dog.height - 10) {
      dog.velocityY = dog.jumpPower;
    }
  }
});

// Update game loop
function update() {
  if (gameOver || !gameStarted) return;

  // Gravity
  dog.velocityY += gravity;
  dog.y += dog.velocityY;

  // Floor check
  const groundLevel = canvas.height - dog.height - 10;
  if (dog.y > groundLevel) {
    dog.y = groundLevel;
    dog.velocityY = 0;
  }

  // Obstacles movement
  obstacles.forEach((obs, index) => {
    obs.x -= 5;

    // Remove offscreen
    if (obs.x + obs.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }

    // Collision check
    if (
      dog.x < obs.x + obs.width &&
      dog.x + dog.width > obs.x &&
      dog.y < obs.y + obs.height &&
      dog.y + dog.height > obs.y
    ) {
      gameOver = true;
    }
  });

  // Spawn obstacles
  if (Math.random() < 0.02) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 40,
      width: 20,
      height: 40
    });
  }
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground line
  ctx.fillStyle = "#000";
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

  // Dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Obstacles
  ctx.fillStyle = "black";
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height - 40);

  // Game Over
  if (gameOver) {
    ctx.font = "22px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over! Press Space to Restart", canvas.width / 2, canvas.height / 2);
  }

  // Not started yet
  if (!gameStarted) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height / 2);
  }

  // Footer with Twitter handle
  ctx.font = "14px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("Made by 0xBalls", canvas.width / 2, canvas.height - 15);

  // Make handle clickable
  canvas.addEventListener("click", (e) => {
    const textWidth = ctx.measureText("Made by 0xBalls").width;
    const textX = canvas.width / 2 - textWidth / 2;
    const textY = canvas.height - 15;
    if (
      e.offsetX >= textX &&
      e.offsetX <= textX + textWidth &&
      e.offsetY >= textY - 14 &&
      e.offsetY <= textY
    ) {
      window.open("https://x.com/0xBalls", "_blank");
    }
  });
}

// Main loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start loop
resetDog();
gameLoop();
