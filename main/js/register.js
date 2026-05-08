const STORAGE_KEY = 'blog_users';
const SESSION_KEY = 'blog_session';
const message1 = document.getElementById('reg-message1');
const message2 = document.getElementById('reg-message2');

function getUsers() {
  const preset = [{ username: 'jhy1750883993', password: 'Jhy405948689', role: 'admin', displayName: 'Hongyu Jin' }];
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return [...preset, ...saved];
}

document.getElementById('register-submit').addEventListener('click', () => {

  message1.textContent = '';
  message2.textContent = '';

  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if (username.length < 8) {
    message1.textContent = 'The account must be at least 8 characters.';
    return;
  }

  if (password.length < 6) {
    message2.textContent = 'The password must be at least 6 characters.';
    return;
  }

  const exists = getUsers().some((u) => u.username === username);
  if (exists) {
    message1.textContent = 'The account already exists, please choose another one.';
    return;
  }

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newUser = {
    username,
    password,
    role: 'user',
    displayName: username
  };
  saved.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  message2.style.color = '#16a34a';
  message2.textContent = 'Creation successful, returning to the login page...';
  setTimeout(() => {
    window.location.href = '../../index.html';
  }, 3000);
});

document.getElementById('back-login').addEventListener('click', () => {
  window.location.href = '../../index.html';
});