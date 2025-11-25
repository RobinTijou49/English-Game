/**
 * Site Header Navigation
 */

function createHeader() {
  // Check if header already exists
  if (document.getElementById('site-header')) {
    return;
  }
  
  const header = document.createElement('header');
  header.id = 'site-header';
  header.className = 'site-header';

  const title = document.createElement('h1');
  title.textContent = '🔐 CYBER CLASH 🔐';
  header.appendChild(title);

  const nav = document.createElement('div');
  nav.className = 'header-nav';

  // Home button
  const homeBtn = document.createElement('a');
  homeBtn.href = 'index.html';
  homeBtn.className = 'header-btn';
  homeBtn.textContent = '🏠 Home';
  nav.appendChild(homeBtn);

  // Rules button
  const rulesBtn = document.createElement('a');
  rulesBtn.href = 'rules.html';
  rulesBtn.className = 'header-btn';
  rulesBtn.textContent = '📖 Rules';
  nav.appendChild(rulesBtn);

  header.appendChild(nav);
  document.body.insertBefore(header, document.body.firstChild);
}

// Create header when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createHeader);
} else {
  createHeader();
}
