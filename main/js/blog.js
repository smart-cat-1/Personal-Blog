const SESSION_KEY = 'blog_session';
const POSTS_KEY = 'blog_posts';

const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (!session) window.location.href = '../../index.html';

const randomName = () => `User${Math.floor(Math.random() * 9000 + 1000)}`;
const currentUser = session?.user?.role === 'guest' ? { ...session.user, displayName: 'Guest' } : { ...session.user, displayName: session.user.displayName || randomName() };

const defaultPosts = [
  { id: 1, author: 'Hongyu Jin', content: '你好，我入驻这里啦！', image: '', date: '2026-05-05', likes: 12, views: 160, comments: ['欢迎！'] },
  { id: 2, author: 'Hongyu Jin', content: '今天分享一张风景图。', image: 'https://picsum.photos/seed/blog/600/300', date: '2026-05-04', likes: 8, views: 120, comments: [] }
];

const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || JSON.stringify(defaultPosts));
localStorage.setItem(POSTS_KEY, JSON.stringify(posts));

function renderProfile() {
  document.getElementById('profile-name').textContent = currentUser.role === 'admin' ? 'Hongyu Jin' : (currentUser.displayName || randomName());
  document.getElementById('profile-bio').textContent = currentUser.role === 'admin' ? '工程师 - 博客作者' : 'Community Reader';
  document.getElementById('profile-hobbies').innerHTML = currentUser.role === 'admin' ? '<p>💻 Coding</p><p>📷 Photography</p><p>🎵 Music</p>' : '<p>🙂 阅读博客</p>';
}

function renderPosts() {
  const root = document.getElementById('posts');
  root.innerHTML = '';
  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
      <div class="card-header"><strong>${post.author}</strong><span>${post.date}</span></div>
      <p>${post.content}</p>
      ${post.image ? `<img class="post-image" src="${post.image}" alt="post">` : ''}
      <div class="card-stats">
        <button data-id="${post.id}" class="like-btn">👍 ${post.likes}</button>
        ${currentUser.role === 'admin' ? `<span>👀 ${post.views}</span>` : ''}
      </div>
      <div class="comments">${post.comments.map((c) => `<p>💬 ${c}</p>`).join('')}</div>
      <div class="comment-input-row">
        <input data-id="${post.id}" class="comment-input" placeholder="写评论..." ${currentUser.role === 'guest' ? 'disabled' : ''}>
        <button data-id="${post.id}" class="comment-btn" ${currentUser.role === 'guest' ? 'disabled' : ''}>发送</button>
      </div>
    `;
    root.appendChild(card);
  });
}

function persist() { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); }

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('like-btn')) {
    if (currentUser.role === 'guest') return;
    const id = Number(e.target.dataset.id);
    const post = posts.find((p) => p.id === id);
    post.likes += 1;
    persist(); renderPosts();
  }
  if (e.target.classList.contains('comment-btn')) {
    const id = Number(e.target.dataset.id);
    const input = document.querySelector(`input.comment-input[data-id="${id}"]`);
    if (!input.value.trim()) return;
    posts.find((p) => p.id === id).comments.push(`${currentUser.displayName}: ${input.value.trim()}`);
    persist(); renderPosts();
  }
});

const editor = document.getElementById('post-editor');
if (currentUser.role === 'admin') {
  editor.classList.remove('hidden');
  document.getElementById('publish-btn').addEventListener('click', () => {
    const text = document.getElementById('new-post-text').value.trim();
    const image = document.getElementById('new-post-image').value.trim();
    if (!text) return;
    posts.unshift({ id: Date.now(), author: 'Hongyu Jin', content: text, image, date: new Date().toISOString().slice(0, 10), likes: 0, views: 0, comments: [] });
    persist(); renderPosts();
    document.getElementById('new-post-text').value = '';
    document.getElementById('new-post-image').value = '';
  });
}

document.getElementById('logout').onclick = () => { localStorage.removeItem(SESSION_KEY); window.location.href='../../index.html'; };
document.getElementById('switch-account').onclick = () => { localStorage.removeItem(SESSION_KEY); window.location.href='../../index.html'; };

renderProfile();
renderPosts();