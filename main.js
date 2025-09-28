// game.js - drop in same folder and ensure assets/dog.png exists

(function () {
  // — DOM
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const overlayButton = document.getElementById('overlayButton');
  const scoreDisplay = document.getElementById('scoreDisplay');

  // — assets
  const dogImg = new Image();
  dogImg.src = 'assets/dog.png'; // IMPORTANT: put your dog.png at assets/dog.png
  let dogLoaded = false;
  dogImg.onload = () => { dogLoaded = true; };

  // — game constants & state
  const GROUND_HEIGHT = 12;
  const BASE_SPEED = 2.0;
  const MAX_SPEED = 14.0;

  // tuning for a longer floaty jump (vertical)
  const GRAVITY = 0.85;      // smaller = floatier; tuned
  const JUMP_POWER = -16.5;  // stronger lift

  let gameSpeed = BASE_SPEED;
  let speedIncrease = 0.0009; // per frame small increase (gradual)
  let obstacles = [];
  let lastTimestamp = 0;
  let frameCount = 0;

  // dog (fixed X)
  const DOG = {
    x: 90,
    width: 80,
    height: 80,
    y: canvas.height - GROUND_HEIGHT - 80,
    vy: 0
  };

  let score = 0;
  let running = false;   // true when gameplay started
  let gameOver = false;

  // overlay control
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

  // Reset game to initial playable state (not started)
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
    showOverlay('Press SPACE to Start', 'Get ready — press SPACE to begin.', 'Start (SPACE)');
  }

  // Start playing
  function startGame() {
    running = true;
    gameOver = false;
    hideOverlay();
    // ensure the gameLoop runs
    requestAnimationFrame(loop);
  }

  // spawn obstacle
  function spawnObstacle() {
    const h = 26 + Math.random() * 36; // varied heights
    obstacles.push({
      x: canvas.width + 6,
      y: canvas.height - GROUND_HEIGHT - h,
      w: 20 + Math.random() * 16,
      h: h
    });
  }

  // collision AABB
  function isColliding(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.width > b.x &&
      a.y < b.y + b.h &&
      a.y + a.height > b.y
    );
  }

  // handle jump if on ground
  function tryJump() {
    const groundY = canvas.height - GROUND_HEIGHT - DOG.height;
    if (Math.abs(DOG.y - groundY) < 0.1) {
      DOG.vy = JUMP_POWER;
    }
  }

  // key handling
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault(); // prevent page scroll
      if (!running && !gameOver) {
        startGame();
      } else if (gameOver) {
        // restart
        resetGameState();
      } else {
        // jump while running
        tryJump();
      }
    }
  });

  // start button
  overlayButton.addEventListener('click', () => {
    if (!running && !gameOver) startGame();
    else if (gameOver) resetGameState();
  });

  // draw ground line
  function drawGround() {
    ctx.fillStyle = '#2e2e2e';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
  }

  // draw dog (use image when loaded or placeholder)
  function drawDog() {
    const x = DOG.x;
    const y = DOG.y;
    const w = DOG.width;
    const h = DOG.height;
    if (dogLoaded) {
      ctx.drawImage(dogImg, x, y, w, h);
    } else {
      ctx.fillStyle = '#FF8A65';
      ctx.fillRect(x, y, w, h);
    }
  }

  // draw obstacles
  function drawObstacles() {
    ctx.fillStyle = '#333';
    for (let obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    }
  }

  // show final popup (canvas overlay is handled in HTML overlay)
  function endGame() {
    gameOver = true;
    running = false;
    // update overlay with final score and restart button
    showOverlay('Game Over', 'Final Score: ' + score, 'Restart (SPACE)');
  }

  // main loop
  function loop(ts) {
    if (!lastTimestamp) lastTimestamp = ts || performance.now();
    const dt = (ts || performance.now()) - lastTimestamp;
    lastTimestamp = ts || performance.now();

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // physics only when running
    if (running && !gameOver) {
      // dog physics
      DOG.vy += GRAVITY;
      DOG.y += DOG.vy;

      const groundY = canvas.height - GROUND_HEIGHT - DOG.height;
      if (DOG.y > groundY) {
        DOG.y = groundY;
        DOG.vy = 0;
      }

      // spawn frequency scales with speed (more speed → more frequent)
      const spawnProb = 0.008 + (gameSpeed - BASE_SPEED) * 0.0012;
      if (Math.random() < spawnProb) spawnObstacle();

      // move obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= gameSpeed;

        // collision test (create temporary rect for dog)
        const dogRect = { x: DOG.x, y: DOG.y, width: DOG.width, height: DOG.height };
        const obsRect = { x: o.x, y: o.y, w: o.w, h: o.h };
        if (
          dogRect.x < obsRect.x + obsRect.w &&
          dogRect.x + dogRect.width > obsRect.x &&
          dogRect.y < obsRect.y + obsRect.h &&
          dogRect.y + dogRect.height > obsRect.y
        ) {
          // collision
          endGame();
        }

        // remove if off screen
        if (o.x + o.w < -10) {
          obstacles.splice(i, 1);
          score += 1;
          scoreDisplay.innerText = 'Score: ' + score;
        }
      }

      // gradually increase speed (non-linear feel)
      if (gameSpeed < MAX_SPEED) {
        // small steady acceleration
        gameSpeed += speedIncrease;

        // accelerate a bit more at score milestones to feel stage-like
        if (score > 0 && score % 500 === 0 && score !== 0 && Math.random() < 0.04) {
          gameSpeed += 0.4;
        }
      }
    }

    // draw
    // background (light)
    ctx.fillStyle = '#f6f8fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ground
    drawGround();

    // obstacles
    drawObstacles();

    // dog
    drawDog();

    // if running, loop again
    if (running && !gameOver) {
      requestAnimationFrame(loop);
    } else {
      // not running: do not auto-reload; overlay handles restart/start
      // but still render final frame / idle frame
      if (!gameOver) {
        // show initial idle text on canvas if desired (we use overlay main screen)
      }
    }
  } // end loop

  // initial/reset
  resetGameState();

  // ensure overlay is focusable via keyboard
  overlayButton.focus();

  // (optional) if user wants to click canvas to jump:
  canvas.addEventListener('pointerdown', (e) => {
    if (!running && !gameOver) {
      startGame();
    } else if (!gameOver) {
      tryJump();
    } else if (gameOver) {
      resetGameState();
    }
  });

})();
