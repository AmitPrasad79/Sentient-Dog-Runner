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

    draw() {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
      this.x -= gameSpeed;
      this.draw();
    }
  }

  // Draw Dog
  function drawDog() {
    ctx.drawImage(dog.img, dog.x, dog.y, dog.width, dog.height);
  }

  // Game Loop
  function update() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dog physics
    dog.y += dog.dy;
    dog.dy += gravity;

    if (dog.y > canvas.height - dog.height) {
      dog.y = canvas.height - dog.height;
      dog.dy = 0;
      dog.jumping = false;
    }

    drawDog();

    // Obstacles
    if (frame % 100 === 0) {
      obstacles.push(new Obstacle());
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

  update();
};
