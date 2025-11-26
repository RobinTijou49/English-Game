const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDiv = document.getElementById('score');
const messageDiv = document.getElementById('message');
const timerSpan = document.querySelector('#timer span');
const gameTimer = document.getElementById('game-timer');

let containerWidth = 400;
let containerHeight = 500;
let playerWidth = 40;        // Réduit de 60px
let playerX = 180;
let moveSpeed = 20;
let mobileMoveSpeed = 8;     // Vitesse plus lente pour les boutons mobiles
let attacks = [];
let attackInterval;
let gameInterval;
let gameActive = false;
let timeSurvived = 0;
const GAME_TIME = 30;

// Attack types
const attackTypes = [
  { type: 'virus', emoji: '🦠', label: 'VIRUS' },
  { type: 'malware', emoji: '💀', label: 'MALWARE' },
  { type: 'phish', emoji: '🎣', label: 'PHISH' }
];

// Update game dimensions for responsive design
function updateGameDimensions() {
  containerWidth = gameContainer.offsetWidth;
  containerHeight = gameContainer.offsetHeight;
  playerWidth = player.offsetWidth;
  moveSpeed = Math.max(15, Math.floor(containerWidth / 25));
}

// Player movements (Keyboard)
document.addEventListener('keydown', (e) => {
  if (!gameActive) return;

  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= moveSpeed;
    if (playerX < 0) playerX = 0;
    player.style.left = playerX + 'px';
  }
  else if (e.key === 'ArrowRight' && playerX < containerWidth - playerWidth) {
    playerX += moveSpeed;
    if (playerX > containerWidth - playerWidth)
      playerX = containerWidth - playerWidth;
    player.style.left = playerX + 'px';
  }
});

// --- MOBILE BUTTON CONTROLS ---
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let isLeftPressed = false;
let isRightPressed = false;

if (btnLeft && btnRight) {
  // Left button
  btnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isLeftPressed = true;
  });
  
  btnLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    isLeftPressed = false;
  });

  // Right button
  btnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isRightPressed = true;
  });
  
  btnRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    isRightPressed = false;
  });
}

// Create attacks
function spawnAttack() {
  const atk = document.createElement('div');
  const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  atk.classList.add('attack', type.type);
  atk.textContent = type.emoji;
  atk.dataset.type = type.type;
  atk.style.left = Math.floor(Math.random() * (containerWidth - 35)) + 'px';
  atk.style.top = '0px';
  atk.style.width = '35px';    // Réduit de 50px
  atk.style.height = '35px';   // Réduit de 50px
  atk.style.fontSize = '20px'; // Réduit aussi le emoji
  gameContainer.appendChild(atk);
  attacks.push(atk);
}

// Game loop (refresh attacks)
function gameLoop() {
  // Handle continuous button movement
  if (gameActive) {
    if (isLeftPressed && playerX > 0) {
      playerX -= mobileMoveSpeed;  // Utilise mobileMoveSpeed au lieu de moveSpeed
      if (playerX < 0) playerX = 0;
      player.style.left = playerX + 'px';
    }
    if (isRightPressed && playerX < containerWidth - playerWidth) {
      playerX += mobileMoveSpeed;  // Utilise mobileMoveSpeed au lieu de moveSpeed
      if (playerX > containerWidth - playerWidth)
        playerX = containerWidth - playerWidth;
      player.style.left = playerX + 'px';
    }
  }

  attacks.forEach((atk, index) => {
    let top = parseInt(atk.style.top);
    top += 2; // falling speed
    atk.style.top = top + 'px';

    // Collision avec hitbox réduite
    let atkX = parseInt(atk.style.left);
    let atkY = top;

    if (atkY + 25 >= containerHeight - 10 &&
        atkX + 5 < playerX + playerWidth - 5 &&
        atkX + 30 > playerX + 5) {
      endGame(false);
    }

    // Remove if out of bounds
    if (top > containerHeight) {
      gameContainer.removeChild(atk);
      attacks.splice(index, 1);
    }
  });
}

// Start the game
function startGame() {
  updateGameDimensions();

attacks.forEach(a => gameContainer.removeChild(a));
  attacks = [];
  playerX = (containerWidth - playerWidth) / 2;
  player.style.left = playerX + 'px';
  player.style.width = '40px';    // Réduit de 60px
  player.style.height = '40px';   // Réduit de 60px
  timeSurvived = 0;
  gameActive = true;
  messageDiv.textContent = '';
  messageDiv.className = '';
  scoreDiv.textContent = 'Time survived: 0 s';
  timerSpan.textContent = GAME_TIME;

  attackInterval = setInterval(spawnAttack, 1200); // Augmenté de 800ms à 1200ms
  gameInterval = setInterval(gameLoop, 1000 / 60);


  const countdown = setInterval(() => {
    if (!gameActive) {
      clearInterval(countdown);
      return;
    }
    timeSurvived++;
    scoreDiv.textContent = `Time survived: ${timeSurvived} s`;
    timerSpan.textContent = GAME_TIME - timeSurvived;
    gameTimer.textContent = `${GAME_TIME - timeSurvived}s`;

    if (timeSurvived >= GAME_TIME) {
      clearInterval(countdown);
      endGame(true);
    }
  }, 1000);
}

// End game
function endGame(win) {
  gameActive = false;
  clearInterval(attackInterval);
  clearInterval(gameInterval);

  attacks.forEach(a => gameContainer.removeChild(a));
  attacks = [];

  if (win) {
    showPopup('🎉 YOU SURVIVED!', `You survived all 30 seconds!`, true);
  } else {
    showPopup('💀 YOU WERE HIT', `You survived ${timeSurvived} seconds.`, false);
  }
}
