// ...existing code...
const timerSpan = document.querySelector('#timer span');
const messageDiv = document.getElementById('message');
const sourcesDiv = document.getElementById('sources');
const targetsDiv = document.getElementById('targets');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('cables-game');
const canvas = document.getElementById('cable-canvas');
const ctx = canvas.getContext('2d');

let timer = 20;
let timerInterval;
let gameActive = false;
let connections = {}; // Stores cable -> target connections
let draggingCable = null;
let cables = [];
let correctConnections = {};
let cableElements = {};
let targetElements = {};
let mouseX = 0;
let mouseY = 0;
let isDragging = false;

// Prevent page scroll while dragging on touch devices
document.addEventListener('touchmove', (e) => {
  if (isDragging) e.preventDefault();
}, { passive: false });

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function resizeCanvas() {
  if (!gameContainer || !canvas) return;
  const rect = gameContainer.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Initialize the game
function initGame() {
  // Create 5 pairs of cables
  const cableCount = 5;
  cables = [];
  connections = {};
  correctConnections = {};
  
  sourcesDiv.innerHTML = '';
  targetsDiv.innerHTML = '';
  cableElements = {};
  targetElements = {};
  
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  
  // Create a random order for targets
  const targetOrder = shuffle([...Array(cableCount).keys()]);
  
  for (let i = 0; i < cableCount; i++) {
    const color = colors[i];
    const cableId = `cable-${i}`;
    
    // Create source cable
    const sourceCable = document.createElement('div');
    sourceCable.id = cableId;
    sourceCable.className = 'cable';
    sourceCable.style.backgroundColor = color;
    sourceCable.textContent = i + 1;
    sourceCable.draggable = false; // use pointer dragging for all devices
    sourceCable.dataset.index = i;
    
    sourcesDiv.appendChild(sourceCable);
    cableElements[i] = sourceCable;
    
    // Make it pointer/touch draggable
    makeSourceDraggable(sourceCable);
    
    // Store the cable color
    cables.push({ index: i, color: color });
    correctConnections[i] = i;
  }
  
  // Create targets in random order
  for (let i = 0; i < cableCount; i++) {
    const correctIndex = targetOrder[i];
    const color = colors[correctIndex];
    
    const targetId = `target-${i}`;
    const target = document.createElement('div');
    target.id = targetId;
    target.className = 'target';
    target.style.backgroundColor = color;
    target.style.border = '2px solid ' + color;
    target.dataset.correctIndex = correctIndex;
    target.dataset.position = i;
    target.dataset.connected = false;
    
    targetsDiv.appendChild(target);
    targetElements[correctIndex] = target;
  }
  
  // Resize canvas now that elements exist
  resizeCanvas();
}

function makeSourceDraggable(el) {
  // pointer events unify mouse + touch
  el.addEventListener('pointerdown', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    draggingCable = {
      index: parseInt(el.dataset.index),
      element: el
    };
    el.setPointerCapture(e.pointerId);
    el.style.opacity = '0.6';
    isDragging = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    drawCables();
  });
  
  el.addEventListener('pointermove', (e) => {
    if (!isDragging || !draggingCable) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    drawCables();
  });
  
  el.addEventListener('pointerup', (e) => {
    if (!isDragging || !draggingCable) return;
    // detect target under pointer
    handlePointerDrop(e.clientX, e.clientY);
    try { el.releasePointerCapture(e.pointerId); } catch (err) {}
  });
  
  el.addEventListener('pointercancel', (e) => {
    if (draggingCable && draggingCable.element === el) {
      el.style.opacity = '1';
      draggingCable = null;
      isDragging = false;
      drawCables();
    }
  });
}

// Handle drop by checking element under the pointer coordinates
function handlePointerDrop(clientX, clientY) {
  const elUnder = document.elementFromPoint(clientX, clientY);
  
  // restore dragging element visual
  if (draggingCable) {
    draggingCable.element.style.opacity = '1';
  }
  
  // find nearest target ancestor
  let targetEl = elUnder;
  while (targetEl && targetEl !== document.body && !targetEl.classList.contains('target')) {
    targetEl = targetEl.parentElement;
  }
  
  if (targetEl && draggingCable) {
    // Perform drop logic similar to handleDrop
    const correctIndex = parseInt(targetEl.dataset.correctIndex);
    const cableIndex = draggingCable.index;
    
    if (cableIndex === correctIndex) {
      // Good connection
      connections[cableIndex] = correctIndex;
      
      const cableElement = draggingCable.element;
      cableElement.style.borderColor = 'green';
      cableElement.style.boxShadow = '0 0 10px #00FF00, 0 4px 10px rgba(0, 0, 0, 0.5)';
      cableElement.textContent = (cableIndex + 1) + ' ✓';
      // prevent re-drag
      cableElement.style.pointerEvents = 'none';
      
      // Mark target visually
      targetEl.style.borderColor = 'green';
      targetEl.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
      
      drawCables();
    } else {
      // Wrong connection: visual feedback
      const cableElement = draggingCable.element;
      cableElement.style.borderColor = 'red';
      cableElement.style.boxShadow = '0 0 10px #FF0000, 0 4px 10px rgba(0, 0, 0, 0.5)';
      setTimeout(() => {
        if (cableElement) {
          cableElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          cableElement.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
        }
      }, 500);
    }
    
    checkWin();
  }
  
  draggingCable = null;
  isDragging = false;
  drawCables();
}

function checkWin() {
  // Check if all connections are correct
  const cableCount = cables.length;
  let correctCount = 0;
  
  for (let i = 0; i < cableCount; i++) {
    if (connections[i] === correctConnections[i]) {
      correctCount++;
    }
  }
  
  // Win only if ALL cables are correctly connected
  if (correctCount === cableCount && cableCount > 0) {
    endGame(true);
  }
}

// Function to draw the cables connecting source and target
function drawCables() {
if (!canvas || !gameContainer) return;

  // assure la bonne taille du canvas si elle a changé (appel sécurisé de resize)
  const rect = gameContainer.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const expectedW = Math.max(1, Math.floor(rect.width * dpr));
  const expectedH = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== expectedW || canvas.height !== expectedH) {
    resizeCanvas(); // resizeCanvas n'appelle PLUS drawCables(), pas de boucle
  }
  const containerRect = gameContainer.getBoundingClientRect();
  // clear using container logical size (after transform)
  ctx.clearRect(0, 0, containerRect.width, containerRect.height);
  
  // Draw connected cables
  for (const cableIndex in connections) {
    const targetIndex = connections[cableIndex];
    const sourceElement = cableElements[cableIndex];
    const targetElement = targetElements[targetIndex];
    
    if (sourceElement && targetElement) {
      // Get positions relative to the container
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      const fromX = sourceRect.left - containerRect.left + sourceRect.width / 2;
      const fromY = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const toX = targetRect.left - containerRect.left + targetRect.width / 2;
      const toY = targetRect.top - containerRect.top + targetRect.height / 2;
      
      // Obtenir la couleur du câble
      const color = sourceElement.style.backgroundColor;
      
      // Dessiner le câble avec une courbe de Bézier
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const controlX = (fromX + toX) / 2;
      const controlY = Math.min(fromY, toY) - 50;
      
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.quadraticCurveTo(controlX, controlY, toX, toY);
      ctx.stroke();
      
      // Ajouter une ombre
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      // reset shadow for next strokes
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }
  
  // Dessiner le fil en cours de glissement
  if (isDragging && draggingCable) {
    const sourceElement = draggingCable.element;
    const sourceRect = sourceElement.getBoundingClientRect();
    
    const fromX = sourceRect.left - containerRect.left + sourceRect.width / 2;
    const fromY = sourceRect.top - containerRect.top + sourceRect.height / 2;
    const toX = mouseX - containerRect.left;
    const toY = mouseY - containerRect.top;
    
    // Get the cable color
    const color = sourceElement.style.backgroundColor;
    
    // Draw the dotted wire
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.9;
    
    const controlX = (fromX + toX) / 2;
    const controlY = Math.min(fromY, toY) - 50;
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(controlX, controlY, toX, toY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
  }
}

// Start game
function startGame() {
  gameActive = true;
  timer = 10;
  timerSpan.textContent = timer;
  messageDiv.textContent = '';
  messageDiv.style.color = '#000';
  startBtn.disabled = true;
  
  // Réinitialiser le canvas
  resizeCanvas();
  
  initGame();
  drawCables();
  
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerSpan.textContent = timer;
    if (timer <= 0) {
      endGame(false);
    }
  }, 1000);
}

function endGame(win) {
  gameActive = false;
  clearInterval(timerInterval);
  startBtn.disabled = false;
  
  if (win) {
    showPopup('✓ PERFECT!', 'All cables connected correctly!', true);
  } else {
    showPopup('✗ TIME\'S UP', 'You ran out of time!', false);
  }
}

// Redraw cables when resizing
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

// Track pointer movement globally (mouse + touch)
document.addEventListener('pointermove', (e) => {
  if (isDragging) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    drawCables();
  }
});

// Keep backward-compatible mouse move tracking (in case)
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (isDragging) {
    drawCables();
  }
});
