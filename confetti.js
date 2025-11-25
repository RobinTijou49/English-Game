/**
 * Confetti Animation & Popup System
 */

// Create confetti pieces
function createConfetti() {
  const confetti = [];
  const colors = ['#FF006E', '#00D9FF', '#37dbba', '#FFD700', '#FF00FF'];
  
  for (let i = 0; i < 50; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 8,
      speedY: Math.random() * 5 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      opacity: 1
    });
  }
  
  return confetti;
}

// Animate confetti falling
function animateConfetti(confetti, canvas) {
  const ctx = canvas.getContext('2d');
  
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeConfetti = false;
    
    confetti.forEach(piece => {
      if (piece.opacity > 0) {
        activeConfetti = true;
        
        // Update position
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;
        piece.opacity -= 0.01;
        
        // Draw confetti piece
        ctx.save();
        ctx.globalAlpha = piece.opacity;
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      }
    });
    
    if (activeConfetti) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}

// Show popup with confetti
function showPopup(title, message, isWin = true) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
  `;
  
  // Create popup container
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #1a1f3a 0%, #2a2f4a 100%);
    border: 3px solid ${isWin ? '#00FF41' : '#FF006E'};
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 0 30px ${isWin ? 'rgba(0, 255, 65, 0.5)' : 'rgba(255, 0, 110, 0.5)'};
    max-width: 500px;
    animation: popupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10001;
  `;
  
  // Title
  const titleEl = document.createElement('h1');
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-size: 2.5em;
    margin: 0 0 20px 0;
    color: ${isWin ? '#00FF41' : '#FF006E'};
    text-shadow: 0 0 20px ${isWin ? 'rgba(0, 255, 65, 0.5)' : 'rgba(255, 0, 110, 0.5)'};
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  `;
  
  // Message
  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    font-size: 1.3em;
    margin: 20px 0;
    color: #00D9FF;
    font-family: 'Courier New', monospace;
    line-height: 1.6;
  `;
  
  // Button
  const button = document.createElement('button');
  button.textContent = 'Continue';
  button.style.cssText = `
    margin-top: 30px;
    padding: 15px 40px;
    font-size: 1.1em;
    background: linear-gradient(135deg, ${isWin ? '#00FF41' : '#FF006E'}, ${isWin ? '#00D9FF' : '#FF00FF'});
    color: #0A0E27;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
    font-family: 'Courier New', monospace;
  `;
  
  button.onmouseover = () => {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = `0 0 20px ${isWin ? 'rgba(0, 255, 65, 0.6)' : 'rgba(255, 0, 110, 0.6)'}`;
  };
  
  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = 'none';
  };
  
  button.onclick = () => {
    overlay.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => overlay.remove(), 300);
  };
  
  popup.appendChild(titleEl);
  popup.appendChild(messageEl);
  popup.appendChild(button);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Create confetti canvas
  if (isWin) {
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(confettiCanvas);
    
    const confetti = createConfetti();
    animateConfetti(confetti, confettiCanvas);
    
    // Remove confetti canvas after animation
    setTimeout(() => confettiCanvas.remove(), 3000);
  }
  
  // Add animations to style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    
    @keyframes popupIn {
      from {
        opacity: 0;
        transform: scale(0.5) rotateX(-10deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotateX(0);
      }
    }
  `;
  
  if (!document.getElementById('popup-animations')) {
    style.id = 'popup-animations';
    document.head.appendChild(style);
  }
}
