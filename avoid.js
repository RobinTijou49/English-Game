const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDiv = document.getElementById('score');
const messageDiv = document.getElementById('message');
const timerSpan = document.querySelector('#timer span');
const gameTimer = document.getElementById('game-timer');

let containerWidth = 400;
let containerHeight = 500;
let playerWidth = 60;
let playerX = 170;
let moveSpeed = 20;
let attacks = [];
let attackInterval;
let gameInterval;
let gameActive = false;
let timeSurvived = 0;
const GAME_TIME = 30; // seconds

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

if (btnLeft && btnRight) {
  btnLeft.addEventListener('touchstart', () => {
    if (!gameActive) return;
    playerX -= moveSpeed;
    if (playerX < 0) playerX = 0;
    player.style.left = playerX + 'px';
  });

  btnRight.addEventListener('touchstart', () => {
    if (!gameActive) return;
    playerX += moveSpeed;
    if (playerX > containerWidth - playerWidth)
      playerX = containerWidth - playerWidth;
    player.style.left = playerX + 'px';
  });
}

// Create attacks
function spawnAttack() {
  const atk = document.createElement('div');
  const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  atk.classList.add('attack', type.type);
  atk.textContent = type.emoji;
  atk.dataset.type = type.type;
  atk.style.left = Math.floor(Math.random() * (containerWidth - 50)) + 'px';
  atk.style.top = '0px';
  gameContainer.appendChild(atk);
  attacks.push(atk);
}

// Game loop (refresh attacks)
function gameLoop() {
  attacks.forEach((atk, index) => {
    let top = parseInt(atk.style.top);
    top += 5; // falling speed
    atk.style.top = top + 'px';

    // Collision
    let atkX = parseInt(atk.style.left);
    let atkY = top;

    if (atkY + 50 >= containerHeight - 10 &&
        atkX < playerX + playerWidth &&
        atkX + 50 > playerX) {
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
  timeSurvived = 0;
  gameActive = true;
  messageDiv.textContent = '';
  messageDiv.className = '';
  scoreDiv.textContent = 'Time survived: 0 s';
  timerSpan.textContent = GAME_TIME;

  attackInterval = setInterval(spawnAttack, 800);
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
