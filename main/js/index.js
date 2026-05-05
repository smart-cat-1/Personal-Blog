const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const agreement = document.getElementById('agreement');
const remember = document.getElementById('remember');
const errorText = document.getElementById('login-error');

const STORAGE_KEY = 'blog_users';
const SESSION_KEY = 'blog_session';

function getUsers() {
  const preset = [{ username: 'jhy1750883993', password: 'Jhy405948689', role: 'admin', displayName: 'Hongyu Jin' }];
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return [...preset, ...saved];
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
  if (session.expiresAt) {
    window.location.href = 'main/html/blog.html';
  }
}

autoLogin();

document.getElementById('login-btn').addEventListener('click', () => {
  errorText.textContent = '';
  if (!agreement.checked) {
    errorText.textContent = '请先同意用户协议和隐私政策';
    return;
  }
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const user = getUsers().find((u) => u.username === username && u.password === password);
  if (!user) {
    errorText.textContent = '请输入正确的账号或密码';
    return;
  }

  saveSession({ ...user, canOperate: true }, remember.checked ? 7 : 0);
  window.location.href = 'main/html/blog.html';
});

document.getElementById('go-register').addEventListener('click', () => {
  window.location.href = 'main/html/register.html';
});

document.getElementById('guest-login').addEventListener('click', () => {
  saveSession({ username: 'guest', role: 'guest', displayName: 'Guest', canOperate: false }, 0);
  window.location.href = 'main/html/blog.html';
});