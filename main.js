const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const W = canvas.width;
const H = canvas.height;

let img = new Image();
img.src = '/assets/dog.png';

const groundY = H - 40;
let player = {
  x: 50,
  y: groundY,
  w: 90,
  h: 90,
  vy: 0,
  gravity: 0.9,
  jumpForce: -14,
  onGround: true,
  runPhase: 0
};

let obstacles = [];
let spawnTimer = 0;
let speed = 4;
let score = 0;
let running = true;

function reset() {
  obstacles = [];
  spawnTimer = 0;
  speed = 4;
  score = 0;
  player.y = groundY;
  player.vy = 0;
  running = true;
}

function spawnObstacle(){
  const size = 20 + Math.random()*30;
  obstacles.push({ x: W + 10, y: groundY + 50 - size, w: size, h: size });
}

function update(){
  if(!running) return;
  // player physics
  player.vy += player.gravity;
  player.y += player.vy;
  if(player.y >= groundY){
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  } else player.onGround = false;

  // obstacle logic
  spawnTimer--;
  if(spawnTimer <= 0){
    spawnObstacle();
    spawnTimer = 60 + Math.floor(Math.random()*80) - Math.floor(score/100);
    if(spawnTimer < 30) spawnTimer = 30;
  }
  for(let i=obstacles.length-1;i>=0;i--){
    obstacles[i].x -= speed;
    if(obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i,1);
  }

  // collision
  for(let o of obstacles){
    if(rectIntersect(player.x, player.y - player.h + 20, player.w, player.h, o.x, o.y-o.h, o.w, o.h)){
      running = false;
    }
  }

  // scoring and speed up
  score += 1;
  if(score % 200 === 0) speed += 0.2;
  scoreEl.textContent = Math.floor(score/10);
  player.runPhase += 0.25;
}

function rectIntersect(ax,ay,aw,ah,bx,by,bw,bh){
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function draw(){
  ctx.clearRect(0,0,W,H);
  // ground
  ctx.fillStyle = '#6b8e23';
  ctx.fillRect(0, groundY + player.h/2 + 10, W, H);

  // draw player with simple "running" bob animation using runPhase
  const bob = Math.sin(player.runPhase) * 6;
  const tilt = Math.sin(player.runPhase) * 0.06;
  const drawX = player.x;
  const drawY = player.y - player.h + 20 + bob;
  ctx.save();
  ctx.translate(drawX + player.w/2, drawY + player.h/2);
  ctx.rotate(tilt);
  ctx.drawImage(img, -player.w/2, -player.h/2, player.w, player.h);
  ctx.restore();

  // obstacles
  ctx.fillStyle = '#8b4513';
  for(let o of obstacles){
    ctx.fillRect(o.x, o.y - o.h, o.w, o.h);
  }

  if(!running){
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('Game Over - Press R to restart', 180, 100);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e=>{
  if(e.code === 'Space' || e.code === 'ArrowUp'){
    if(player.onGround){
      player.vy = player.jumpForce;
      player.onGround = false;
    }
  }
  if(e.key === 'r' || e.key === 'R'){
    reset();
  }
});

canvas.addEventListener('click', ()=>{
  if(player.onGround){
    player.vy = player.jumpForce;
    player.onGround = false;
  } else if(!running){
    reset();
  }
});

// Start when image loaded
img.onload = function(){
  loop();
};
