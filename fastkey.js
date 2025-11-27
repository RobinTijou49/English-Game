const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let targetKeyDiv = document.getElementById('target-key');
let scoreDiv = document.getElementById('score');
let timerSpan = document.querySelector('#timer span');
let messageDiv = document.getElementById('message');
let virtualKeyboardDiv = document.getElementById('virtual-keyboard');

let timeLeft = 20;
let score = 0;
let timerInterval;
let gameActive = false;
let currentKey = '';
const TARGET_SCORE = 15; // Minimum score to win

// Create virtual keyboard
function createVirtualKeyboard() {
  virtualKeyboardDiv.innerHTML = '';
  const rows = [
    'ABCDEFGHIJ',
    'KLMNOPQRST',
    'UVWXYZ'
  ];
  
  rows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    for (let char of row) {
      const btn = document.createElement('button');
      btn.className = 'key-btn';
      btn.textContent = char;
      btn.id = `key-${char}`;
      btn.addEventListener('click', () => handleKeyPress(char));
      rowDiv.appendChild(btn);
    }
    
    virtualKeyboardDiv.appendChild(rowDiv);
  });
}

// Handle key press (virtual keyboard or physical keyboard)
function handleKeyPress(key) {
  if (!gameActive) return;
  if (key === currentKey) {
    score++;
    scoreDiv.textContent = `Score: ${score}`;
    
    // Visual effect on correct key
    const btn = document.getElementById(`key-${currentKey}`);
    if (btn) {
      btn.style.background = '#90EE90';
      setTimeout(() => {
        btn.style.background = '#e0e0e0';
      }, 100);
    }
    
    if (score >= TARGET_SCORE) {
      endGame(); // immediate victory if score reached
      return;
    }
    currentKey = randomKey();
    targetKeyDiv.textContent = currentKey;
  }
}

// Highlight the target key
function updateKeyboardHighlight() {
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.classList.remove('target');
  });
  const targetBtn = document.getElementById(`key-${currentKey}`);
  if (targetBtn) {
    targetBtn.classList.add('target');
  }
}

function randomKey() {
  return keys[Math.floor(Math.random() * keys.length)];
}

function startGame() {
  score = 0;
  timeLeft = 20;
  gameActive = true;
  scoreDiv.textContent = `Score: ${score}`;
  messageDiv.textContent = '';
  currentKey = randomKey();
  targetKeyDiv.textContent = currentKey;
  
  // Create virtual keyboard
  createVirtualKeyboard();

  timerSpan.textContent = timeLeft;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if(timeLeft <= 0){
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  if(score >= TARGET_SCORE){
    showPopup('🎉 YOU WON!', `Excellent! You scored ${score} points!`, true);
  } else {
    showPopup('⏰ TIME\'S UP', `Time is up! You scored ${score}/${TARGET_SCORE} points.`, false);
  }
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();
  if (keys.includes(key)) {
    handleKeyPress(key);
  }
});
