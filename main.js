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
window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Game settings
  let gravity = 0.6;
  let jump = -12;
  let obstacles = [];
  let frame = 0;
  let score = 0;
  let gameSpeed = 3;         // starting slow
  let speedIncrease = 0.002; // gradual increase

  // Dog character
  const dog = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    dy: 0,
    jumping: false,
    img: new Image(),
  };
  dog.img.src = "./assets/dog.png"; // make sure file exists

  // Controls
  document.addEventListener("keydown", function (e) {
    if ((e.code === "Space" || e.code === "ArrowUp") && !dog.jumping) {
      dog.dy = jump;
      dog.jumping = true;
    }
  });

function spawnObstacle() {
  obstacles.push(new Obstacle());
}
  document.addEventListener("click", function () {
    if (!dog.jumping) {
      dog.dy = jump;
      dog.jumping = true;
    }
  });

  // Obstacle
  class Obstacle {
    constructor() {
      this.width = 20 + Math.random() * 20;
      this.height = 20 + Math.random() * 40;
      this.x = canvas.width;
      this.y = canvas.height - this.height;
    }

function jump() {
  if (!dog.jumping) {
    dog.dy = -10;
    dog.jumping = true;
  }
}
    draw() {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

// Input
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
    update() {
      this.x -= gameSpeed;
      this.draw();
    }
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
  // Draw Dog
  function drawDog() {
    ctx.drawImage(dog.img, dog.x, dog.y, dog.width, dog.height);
  }

  // Draw dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
  // Game Loop
  function update() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Obstacles
  if (Math.random() < 0.01) {
    spawnObstacle();
  }
    // Dog physics
    dog.y += dog.dy;
    dog.dy += gravity;

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
    if (dog.y > canvas.height - dog.height) {
      dog.y = canvas.height - dog.height;
      dog.dy = 0;
      dog.jumping = false;
    }
  }

  // Increase difficulty
  gameSpeed += speedIncrease;
    drawDog();

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
    // Obstacles
    if (frame % 100 === 0) {
      obstacles.push(new Obstacle());
    }

  requestAnimationFrame(update);
}
    obstacles.forEach((obs, index) => {
      obs.update();

      // Collision
      if (
        dog.x < obs.x + obs.width &&
        dog.x + dog.width > obs.x &&
        dog.y < obs.y + obs.height &&
        dog.y + dog.height > obs.y
      ) {
        alert("Game Over! Final Score: " + score);
        document.location.reload();
      }

      // Remove passed obstacles
      if (obs.x + obs.width < 0) {
        obstacles.splice(index, 1);
        score++;
        document.getElementById("score").innerText = "Score: " + score;
      }
    });

    // Increase game speed gradually
    gameSpeed += speedIncrease;

    requestAnimationFrame(update);
  }

// Start game once dog image is loaded
dogImg.onload = () => {
  update();
};
