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

 const titleLink = document.createElement('a');
  titleLink.href = 'index.html';
  titleLink.style.display = 'flex';
  titleLink.style.alignItems = 'center';
  titleLink.style.gap = '10px';

  const logo = document.createElement('img');
  logo.src = 'src/logo.png';
  logo.alt = '1000 Links';
  logo.style.height = '80px';
  logo.style.objectFit = 'contain';
  logo.style.display = 'block';

  // texte accessible pour les lecteurs d'écran
  const sr = document.createElement('span');
  sr.textContent = '1000 Links';
  sr.style.position = 'absolute';
  sr.style.left = '-9999px';

  titleLink.appendChild(logo);
  titleLink.appendChild(sr);
  header.appendChild(titleLink);

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
