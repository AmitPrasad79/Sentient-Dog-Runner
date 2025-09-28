<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dog Runner Game</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f9f9f9;
      font-family: Arial, sans-serif;
    }
    canvas {
      background: #fff;
      border: 2px solid #444;
      margin-top: 20px;
    }
    #gameOverScreen {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.85);
      color: white;
      padding: 20px 40px;
      text-align: center;
      border-radius: 12px;
      display: none;
    }
    #restartBtn {
      margin-top: 15px;
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      background: #ff4b4b;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    #restartBtn:hover {
      background: #ff2a2a;
    }
  </style>
</head>
<body>
  <h2>🐶 Sentient Dog Runner</h2>
  <p>Press <b>Space</b> to Jump</p>
  
  <canvas id="gameCanvas" width="600" height="200"></canvas>
  <p id="scoreText">Score: 0</p>

  <div id="gameOverScreen">
    <h2>Game Over!</h2>
    <p id="finalScore">Score: 0</p>
    <button id="restartBtn">Restart</button>
  </div>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreText = document.getElementById("scoreText");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScore = document.getElementById("finalScore");
    const restartBtn = document.getElementById("restartBtn");

    let dog, obstacles, score, gameSpeed, gravity, isGameOver;

    function initGame() {
      dog = { x: 30, y: 150, width: 20, height: 20, velocityY: 0, jumpPower: -8 };
      obstacles = [];
      score = 0;
      gameSpeed = 3;
      gravity = 0.4;
      isGameOver = false;
      gameOverScreen.style.display = "none";
      loop();
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && dog.y >= 150) {
        dog.velocityY = dog.jumpPower;
      }
    });

    function spawnObstacle() {
      const width = 20;
      obstacles.push({ x: canvas.width, y: 160, width, height: 40 });
    }

    function update() {
      if (isGameOver) return;

      // Dog physics
      dog.velocityY += gravity;
      dog.y += dog.velocityY;
      if (dog.y > 150) dog.y = 150;

      // Obstacles
      if (Math.random() < 0.02) spawnObstacle();
      obstacles.forEach(o => o.x -= gameSpeed);
      obstacles = obstacles.filter(o => o.x + o.width > 0);

      // Collision
      for (let o of obstacles) {
        if (
          dog.x < o.x + o.width &&
          dog.x + dog.width > o.x &&
          dog.y < o.y + o.height &&
          dog.y + dog.height > o.y
        ) {
          endGame();
        }
      }

      // Score
      score++;
      scoreText.textContent = "Score: " + score;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "brown";
      ctx.fillRect(dog.x, dog.y, dog.width, dog.height);

      ctx.fillStyle = "black";
      obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
    }

    function loop() {
      if (isGameOver) return;
      update();
      draw();
      requestAnimationFrame(loop);
    }

    function endGame() {
      isGameOver = true;
      finalScore.textContent = "Final Score: " + score;
      gameOverScreen.style.display = "block";
    }

    restartBtn.addEventListener("click", initGame);

    // Start the first game
    initGame();
  </script>
</body>
</html>
