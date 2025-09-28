// main.js

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 200;

let gravity = 0.6;
let gameSpeed = 2;        // starting speed
let speedIncrease = 0.002; // how fast the game speeds up

let score = 0;
let gameOver = false;

// Dog player
const dog = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  dy: 0,
  jumping: false,
};

const dogImg = new Image();
dogImg.src = "dog.png"; // <-- make sure dog.png is in same folder

// Obstacles
let obstacles = [];

class Obstacle {
  constructor() {
    this.width = 20;
    this.height = 30;
    this.x = canvas.width;
    this.y = canvas.height - this.height - 20;
  }

  update() {
    this.x -= gameSpeed;
    this.draw();
  }

  draw() {
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function spawnObstacle() {
  obstacles.push(new Obstacle());
}

function jump() {
  if (!dog.jumping) {
    dog.dy = -10;
    dog.jumping = true;
  }
}

// Input
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

canvas.addEventListener("click", jump);

// Main update loop
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dog physics
  dog.y += dog.dy;
  dog.dy += gravity;

  if (dog.y + dog.height >= canvas.height - 20) {
    dog.y = canvas.height - dog.height - 20;
    dog.dy = 0;
    dog.jumping = false;
  }

  // Draw dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Obstacles
  if (Math.random() < 0.01) {
    spawnObstacle();
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();

    // Collision detection
    if (
      dog.x < obstacles[i].x + obstacles[i].width &&
      dog.x + dog.width > obstacles[i].x &&
      dog.y < obstacles[i].y + obstacles[i].height &&
      dog.y + dog.height > obstacles[i].y
    ) {
      gameOver = true;
      alert("Game Over! Final Score: " + score);
    }
  }

  // Increase difficulty
  gameSpeed += speedIncrease;

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(update);
}

// Start game once dog image is loaded
dogImg.onload = () => {
  update();
};
