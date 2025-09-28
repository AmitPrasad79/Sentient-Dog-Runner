// game.js - debug-friendly minimal runner (mobile + desktop controls)
console.log('game.js loaded');

const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  console.error('ERROR: canvas element not found. Make sure index.html contains <canvas id="gameCanvas">');
}
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
if (!ctx) {
  console.error('ERROR: 2d context not available.');
}

const overlayCard = document.getElementById('overlayCard');
const overlayButton = document.getElementById('overlayButton');
const scoreDisplay = document.getElementById('scoreDisplay');

let running = false, gameOver = false;
let score = 0;

// simple placeholder dog (no external image required for debug)
const DOG = { x: 90, width: 70, height: 70, y: canvas.height - 12 - 70, vy: 0 };
const GRAVITY = 0.9, JUMP_POWER = -16;

// safe function to show/hide overlay
function showOverlay(title, text, btnText) {
  document.getElementById('overlayTitle').innerText = title || 'Overlay';
  document.getElementById('overlayText').innerText = text || '';
  overlayButton.innerText = btnText || 'OK';
  overlayCard.style.display = 'flex';
}
function hideOverlay() { overlayCard.style.display = 'none'; }

// debug checks
console.log('canvas exists?', !!canvas, 'context ok?', !!ctx);

// controls
function tryJump(){
  const groundY = canvas.height - 12 - DOG.height;
  if (Math.abs(DOG.y - groundY) < 0.1) DOG.vy = JUMP_POWER;
}
function handleInput(){
  if (!running && !gameOver) {
    startGame();
  } else if (gameOver) {
    resetGame();
  } else {
    tryJump();
  }
}
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleInput();
  }
});
canvas.addEventListener('pointerdown', handleInput);
overlayButton.addEventListener('click', handleInput);

// simple obstacle array for debug
let obstacles = [];
function spawnObstacle() {
  const h = 30 + Math.random()*40;
  obstacles.push({ x: canvas.width + 10, y: canvas.height - 12 - h, w: 26, h: h });
}

// reset state
function resetGame(){
  obstacles = [];
  running = false;
  gameOver = false;
  score = 0;
  DOG.y = canvas.height - 12 - DOG.height;
  DOG.vy = 0;
  scoreDisplay.innerText = 'Score: 0';
  showOverlay('Press SPACE or Tap to Start', 'Tap/click the canvas or press SPACE to start.', 'Start');
  console.log('Game reset');
}

// start
function startGame(){
  hideOverlay();
  running = true;
  gameOver = false;
  requestAnimationFrame(loop);
  console.log('Game started');
}

// collision simple
function isColliding(a,b){
  return a.x < b.x + b.w && a.x + a.width > b.x && a.y < b.y + b.h && a.y + a.height > b.y;
}

let frame = 0, speed = 3;
function loop(){
  if (!running) return; // do nothing until started
  frame++;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // physics for dog
  DOG.vy += GRAVITY;
  DOG.y += DOG.vy;
  const groundY = canvas.height - 12 - DOG.height;
  if (DOG.y > groundY) { DOG.y = groundY; DOG.vy = 0; }

  // spawn
  if (frame % 110 === 0) spawnObstacle();

  // move obstacles
  for (let i = obstacles.length-1;i>=0;i--){
    obstacles[i].x -= speed;
    if (isColliding({x:DOG.x,y:DOG.y,width:DOG.width,height:DOG.height}, obstacles[i])) {
      console.log('Collision detected');
      running = false;
      gameOver = true;
      showOverlay('Game Over', 'Final Score: ' + score, 'Restart');
      return;
    }
    if (obstacles[i].x + obstacles[i].w < 0) {
      obstacles.splice(i,1);
      score++;
      scoreDisplay.innerText = 'Score: ' + score;
    }
  }

  // draw ground
  ctx.fillStyle = '#222';
  ctx.fillRect(0, canvas.height - 12, canvas.width, 12);

  // draw dog (placeholder)
  ctx.fillStyle = '#ff8a65';
  ctx.fillRect(DOG.x, DOG.y, DOG.width, DOG.height);

  // draw obstacles
  ctx.fillStyle = '#333';
  for (let o of obstacles) ctx.fillRect(o.x, o.y, o.w, o.h);

  // increase difficulty slightly
  if (frame % 600 === 0) speed += 0.5;

  requestAnimationFrame(loop);
}

// initial
resetGame();
console.log('Setup complete - open Developer Console to view logs.');
