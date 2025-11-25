const TIME_LIMIT = 30; // in seconds
const timerSpan = document.querySelector('#timer span');
const inputField = document.getElementById('input‑field');
const textTarget = document.getElementById('text‑target');
const startBtn = document.getElementById('start');
const resultDiv = document.getElementById('result');
const messageP = document.getElementById('message');
const restartBtn = document.getElementById('restart');

// Cybersecurity phrases
const cybersecurityPhrases = [
  'A strong password must contain uppercase, lowercase, and numeric characters.',
  'Be careful of phishing emails that try to steal your personal information.',
  'Enable multi-factor authentication to secure your account.',
  'Never share your login credentials with anyone else.',
  'Regularly update your system and security software.',
  'A firewall protects your network against unauthorized access.',
  'Data encryption ensures the confidentiality of your communications.',
  'Viruses can spread rapidly in an unprotected network.',
  'Regularly back up your data to avoid total loss.',
  'A hacker can use social engineering to bypass defenses.',
  'SSL certificates secure connections between your browser and the server.',
  'Regularly clean your browsing history and cookies.',
  'Ransomware encrypts your files to demand a ransom.',
  'Use a password manager to securely store your credentials.',
  'Biometric authentication provides additional security to your devices.',
  'Brute force cyberattacks test thousands of passwords.',
  'Critical updates should be installed as soon as possible.',
  'A VPN encrypts your data and masks your IP address.',
  'Antivirus software detects and eliminates threats on your computer.',
  'Data security begins with good digital hygiene.',
  'Security logs record all access to the computer system.',
  'Risk analysis helps identify potential vulnerabilities.',
  'Firewalls inspect and control incoming and outgoing network traffic.',
  'Security awareness is crucial for all users.',
  'Digital certificates authenticate the identity of a user or company.',
];

let timeLeft = TIME_LIMIT;
let timerInterval;
let currentPhrase = '';

// Function to get a random phrase
function getRandomPhrase() {
  return cybersecurityPhrases[Math.floor(Math.random() * cybersecurityPhrases.length)];
}

function startTest() {
  startBtn.disabled = true;
  inputField.disabled = false;
  inputField.value = '';
  inputField.focus();
  timeLeft = TIME_LIMIT;
  timerSpan.textContent = timeLeft;
  resultDiv.classList.add('hidden');
  
  // Display a random phrase
  currentPhrase = getRandomPhrase();
  textTarget.textContent = currentPhrase;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      finishTest(false);
    }
  }, 1000);
}

function finishTest(success) {
  clearInterval(timerInterval);
  inputField.disabled = true;
  startBtn.disabled = false;
  if (success) {
    showPopup('✓ SUCCESS!', 'Congratulations! You typed the phrase correctly!', true);
  } else {
    showPopup('✗ TIME\'S UP', 'You ran out of time. Try again!', false);
  }
}

inputField.addEventListener('input', () => {
  const target = textTarget.textContent.trim();
  const entered = inputField.value.trim();
  if (entered === target) {
    finishTest(true);
  }
});

restartBtn.addEventListener('click', () => {
  startTest();
});

startBtn.addEventListener('click', () => {
  startTest();
});
