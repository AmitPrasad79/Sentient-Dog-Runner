const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Game state
let running = false;
let gameOver = false;
let score = 0;

// Dog
const dogImg = new Image();
dogImg.src = "assets/dog.png";
const dog = {
  x: 50,
  width: 80,
  height: 80,
  y: 0,
  vy: 0
};
dog.y = canvas.height - dog.height - 20;

const GRAVITY = 0.9;
const JUMP_POWER = -18;

// Obstacles
let obstacles = [];
let speed = 5;

// Input (desktop + mobile)
document.addEventListener("keydown", e => {
  if (e.code === "Space") handleInput();
});
canvas.addEventListener("pointerdown", handleInput);
document.getElementById("overlayButton").addEventListener("click", handleInput);

function handleInput() {
  if (!running && !gameOver) {
    startGame();
  } else if (gameOver) {
    resetGame();
  } else {
    jump();
  }
}

function jump() {
  const groundY = canvas.height - dog.height - 20;
  if (dog.y >= groundY) {
    dog.vy = JUMP_POWER;
  }
}

function resetGame() {
  obstacles = [];
  score = 0;
  speed = 5;
  gameOver = false;
  running = false;
  showOverlay("Dog Runner", "Tap anywhere to start", "Start");
}

function startGame() {
  hideOverlay();
  running = true;
  requestAnimationFrame(loop);
}

function loop() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dog physics
  dog.vy += GRAVITY;
  dog.y += dog.vy;
  const groundY = canvas.height - dog.height - 20;
  if (dog.y > groundY) {
    dog.y = groundY;
    dog.vy = 0;
  }

  // Obstacles
  if (Math.random() < 0.02) {
    const h = 40 + Math.random() * 40;
    obstacles.push({
      x: canvas.width,
      y: canvas.height - h - 20,
      w: 30,
      h: h
    });
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.x -= speed;
    ctx.fillStyle = "#333";
    ctx.fillRect(o.x, o.y, o.w, o.h);

    // Collision
    if (
      dog.x < o.x + o.w &&
      dog.x + dog.width > o.x &&
      dog.y < o.y + o.h &&
      dog.y + dog.height > o.y
    ) {
      endGame();
    }

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  // Draw dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  // Speed up
  speed += 0.001;

  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  gameOver = true;
  showOverlay("Game Over", "Final Score: " + score, "Restart");
}

// Overlay functions
function showOverlay(title, text, button) {
  const overlay = document.getElementById("overlay");
  document.getElementById("overlayTitle").innerText = title;
  document.getElementById("overlayText").innerText = text;
  document.getElementById("overlayButton").innerText = button;
  overlay.style.display = "flex";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}

// Init
showOverlay("Dog Runner", "Tap anywhere to start", "Start");
