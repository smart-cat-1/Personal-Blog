const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const agreement = document.getElementById('agreement');
const errorText = document.getElementById('login-error');

const STORAGE_KEY = 'blog_users';
const SESSION_KEY = 'blog_session';

function getUsers() {
  const preset = [{ username: 'jhy1750883993', password: 'Jhy405948689', role: 'admin', displayName: 'Hongyu Jin' }];
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return [...preset, ...saved].filter(u => u && u.username && u.password);
}

function saveSession(user, days = 0) {
  const expiresAt = days > 0 ? Date.now() + days * 24 * 60 * 60 * 1000 : null;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, expiresAt }));
}

function autoLogin() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!session) return;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  if (session.user && session.user.username) {
    window.location.href = 'main/html/blog.html';
  }
}

autoLogin();

document.getElementById('login-btn').addEventListener('click', () => {
  errorText.textContent = '';
  if (!agreement.checked) {
    errorText.textContent = 'Please first agree to the User Agreement and Privacy Policy';
    return;
  }
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (!username || !password) {
    errorText.textContent = 'Please enter username and password';
    return;
  }

  console.log('Registered User:', getUsers());
  console.log('Input username:', username, 'Input password:', password);

  const user = getUsers().find((u) => u.username === username && u.password === password);
  
  if (!user) {
    errorText.textContent = 'Please enter the correct account or password';
    console.log('Login failed: user does not exist or password is incorrect');
    return;
  }

  console.log('Login successful, user information:', user);
  saveSession(user, 0);
  window.location.href = 'main/html/blog.html';
});

document.getElementById('go-register').addEventListener('click', () => {
  window.location.href = 'main/html/register.html';
});

document.getElementById('guest-login').addEventListener('click', () => {
  saveSession({ username: 'guest', role: 'guest', displayName: 'Guest' }, 0);
  window.location.href = 'main/html/blog.html';
});