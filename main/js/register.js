const STORAGE_KEY = 'blog_users';
const message = document.getElementById('reg-message');

function getUsers() {
  const preset = [{ username: 'jhy1750883993', password: 'Jhy405948689' }];
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return [...preset, ...saved];
}

document.getElementById('register-submit').addEventListener('click', () => {
  message.textContent = '';
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;

  if (username.length < 4 || password.length < 6) {
    message.textContent = '账号至少4位，密码至少6位';
    return;
  }
  const exists = getUsers().some((u) => u.username === username);
  if (exists) {
    message.textContent = '账号已存在，请更换';
    return;
  }

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  saved.push({ username, password, role: 'user', displayName: `${username}` });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  message.style.color = '#16a34a';
  message.textContent = '创建成功，正在返回登录页...';
  setTimeout(() => { window.location.href = '../../index.html'; }, 1000);
});

document.getElementById('back-login').addEventListener('click', () => {
  window.location.href = '../../index.html';
});