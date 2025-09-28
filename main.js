// game.js - mobile + desktop controls

(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const overlayButton = document.getElementById('overlayButton');
  const scoreDisplay = document.getElementById('scoreDisplay');

  const dogImg = new Image();
  dogImg.src = 'assets/dog.png';
  let dogLoaded = false;
  dogImg.onload = () => { dogLoaded = true; };

  const GROUND_HEIGHT = 12;
  const BASE_SPEED = 2.0;
  const MAX_SPEED = 14.0;

  const GRAVITY = 0.85;
  const JUMP_POWER = -16.5;

  let gameSpeed = BASE_SPEED;
  let speedIncrease = 0.0009;
  let obstacles = [];
  let lastTimestamp = 0;
  let frameCount = 0;

  const DOG = {
    x: 90,
    width: 80,
    height: 80,
    y: canvas.height - GROUND_HEIGHT - 80,
    vy: 0
  };

  let score = 0;
  let running = false;
  let gameOver = false;

  function showOverlay(title, text, buttonLabel) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayButton.textContent = buttonLabel;
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
  }
  function hideOverlay() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }

  function resetGameState() {
    obstacles = [];
    gameSpeed = BASE_SPEED;
    score = 0;
    frameCount = 0;
    DOG.y = canvas.height - GROUND_HEIGHT - DOG.height;
    DOG.vy = 0;
    running = false;
    gameOver = false;
    scoreDisplay.innerText = 'Score: 0';
    showOverlay('Tap or Press SPACE to Start', 'Tap screen (mobile) or SPACE (desktop) to begin.', 'Start');
  }

  function startGame() {
    running = true;
    gameOver = false;
    hideOverlay();
    requestAnimationFrame(loop);
  }

  function spawnObstacle() {
    const h = 26 + Math.random() * 36;
    obstacles.push({
      x: canvas.width + 6,
      y: canvas.height - GROUND_HEIGHT - h,
      w: 20 + Math.random() * 16,
      h: h
    });
  }

  function isColliding(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.width > b.x &&
      a.y < b.y + b.h &&
      a.y + a.height > b.y
    );
  }

  function tryJump() {
    const groundY = canvas.height - GROUND_HEIGHT - DOG.height;
    if (Math.abs(DOG.y - groundY) < 0.1) {
      DOG.vy = JUMP_POWER;
    }
  }

  // KEYBOARD
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleInput();
    }
  });

  // BUTTON CLICK
  overlayButton.addEventListener('click', () => {
    handleInput();
  });

  // TOUCH / TAP
  canvas.addEventListener('pointerdown', () => {
    handleInput();
  });

  function handleInput() {
    if (!running && !gameOver) {
      startGame();
    } else if (gameOver) {
      resetGameState();
    } else {
      tryJump();
    }
  }

  function drawGround() {
    ctx.fillStyle = '#2e2e2e';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
  }

  function drawDog() {
    if (dogLoaded) {
      ctx.drawImage(dogImg, DOG.x, DOG.y, DOG.width, DOG.height);
    } else {
      ctx.fillStyle = '#FF8A65';
      ctx.fillRect(DOG.x, DOG.y, DOG.width, DOG.height);
    }
  }

  function drawObstacles() {
    ctx.fillStyle = '#333';
    for (let obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    }
  }

  function endGame() {
    gameOver = true;
    running = false;
    showOverlay('Game Over', 'Final Score: ' + score, 'Restart');
  }

  function loop(ts) {
    if (!lastTimestamp) lastTimestamp = ts || performance.now();
    const dt = (ts || performance.now()) - lastTimestamp;
    lastTimestamp = ts || performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (running && !gameOver) {
      DOG.vy += GRAVITY;
      DOG.y += DOG.vy;
      const groundY = canvas.height - GROUND_HEIGHT - DOG.height;
      if (DOG.y > groundY) {
        DOG.y = groundY;
        DOG.vy = 0;
      }

      const spawnProb = 0.008 + (gameSpeed - BASE_SPEED) * 0.0012;
      if (Math.random() < spawnProb) spawnObstacle();

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= gameSpeed;

        if (isColliding({ x: DOG.x, y: DOG.y, width: DOG.width, height: DOG.height }, o)) {
          endGame();
        }

        if (o.x + o.w < -10) {
          obstacles.splice(i, 1);
          score += 1;
          scoreDisplay.innerText = 'Score: ' + score;
        }
      }

      if (gameSpeed < MAX_SPEED) {
        gameSpeed += speedIncrease;
      }
    }

    ctx.fillStyle = '#f6f8fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawObstacles();
    drawDog();

    if (running && !gameOver) {
      requestAnimationFrame(loop);
    }
  }

  resetGameState();
})();
