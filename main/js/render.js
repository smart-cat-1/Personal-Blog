/**
 * 渲染图片预览
 */
function renderImagePreview() {
  const preview = document.getElementById('image-preview');
  if (!preview) return;

  preview.innerHTML = selectedImages.map((src, index) => `
    <div class="preview-item">
      <img src="${src}" alt="preview">
      <button class="remove-btn" data-index="${index}">×</button>
    </div>
  `).join('');
}

/**
 * 显示图片全屏预览
 */
function showImageViewer(src) {
  const overlay = document.getElementById('image-viewer');
  const image = document.getElementById('image-viewer-img');
  if (!overlay || !image) return;
  image.src = src;
  overlay.classList.remove('hidden');
}

/**
 * 隐藏图片全屏预览
 */
function hideImageViewer() {
  const overlay = document.getElementById('image-viewer');
  if (!overlay) return;
  overlay.classList.add('hidden');
}

/**
 * 渲染用户个人资料面板
 */
function renderProfilePanel() {
  const profileUsername = document.getElementById('profile-username');
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileRole = document.getElementById('profile-role');
  const profileNameInput = document.getElementById('profile-name');
  const saveNameBtn = document.getElementById('save-name');
  const profileAvatar = document.getElementById('profile-avatar');
  const avatarUploadBtn = document.getElementById('avatar-upload-btn');
  const avatarInput = document.getElementById('avatar-input');

  const displayName = getCurrentDisplayName();
  let roleText = '';

  if (currentUser.role === 'admin') {
    roleText = 'Administrator';
  } else if (currentUser.role === 'user') {
    roleText = 'Standard User';
  } else if (currentUser.role === 'guest') {
    roleText = 'Guest';
  }

  if (profileUsername) {
    profileUsername.innerHTML = `Username: <span>${currentUser.username}</span>`;
  }

  if (profileDisplayName) {
    profileDisplayName.innerHTML = `Display Name: <span>${displayName}</span>`;
  }

  if (profileRole) {
    profileRole.innerHTML = `Account Type: <span>${roleText}</span>`;
  }

  if (profileNameInput) {
    profileNameInput.value = displayName;
  }

  const avatarSrc = getCurrentAvatar();
  if (profileAvatar) {
    profileAvatar.src = avatarSrc;
  }

  if (saveNameBtn && !saveNameBtn.hasAttribute('data-listener-attached')) {
    saveNameBtn.setAttribute('data-listener-attached', 'true');
    saveNameBtn.onclick = () => {
      const newName = profileNameInput.value.trim();
      if (newName && newName.length >= 2) {
        updateDisplayName(newName);
        renderProfilePanel();
        renderPosts();
      } else {
        alert('Display name must be at least 2 characters long.');
      }
    };
  }

  if (avatarUploadBtn && avatarInput && !avatarUploadBtn.hasAttribute('data-listener-attached')) {
    avatarUploadBtn.setAttribute('data-listener-attached', 'true');
    avatarUploadBtn.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      readFilesAsDataURLs([file]).then(([avatarUrl]) => {
        updateAvatar(avatarUrl);
        renderProfilePanel();
      }).catch(() => {
        alert('Unable to upload avatar. Please try again.');
      }).finally(() => {
        event.target.value = '';
      });
    });
  }
}

/**
 * 渲染帖子列表
 */
function renderPosts() {
  const root = document.getElementById('posts');
  root.innerHTML = '';

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'blog-card';

    const likeCount = getLikeCount(post);
    const currentUserLiked = hasLiked(post);

    const images = Array.isArray(post.images) ? post.images : [];
    const imageCount = images.length;

    const imageHtml = imageCount === 0 ? '' : imageCount === 1
      ? `<div class="image-grid one"><img src="${images[0]}" class="grid-image" data-src="${images[0]}" alt="post image"></div>`
      : `<div class="image-grid ${imageCount === 4 ? 'two-row' : 'one-row'}">
          ${images.map((src) => `<div class="grid-cell"><img src="${src}" class="grid-image" data-src="${src}" alt="post image"></div>`).join('')}
         </div>`;

    const likeBtn = currentUser.role === 'guest'
      ? `<button data-id="${post.id}" class="like-btn" disabled>
           <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
           <span>${likeCount}</span>
         </button>`
      : `<button data-id="${post.id}" class="like-btn ${currentUserLiked ? 'liked' : ''}">
           <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
           <span>${likeCount}</span>
         </button>`;

    const deletePostBtn = currentUser.role === 'admin'
      ? `<button data-id="${post.id}" class="delete-post-btn" type="button">Delete</button>`
      : '';

    const commentInput = currentUser.role === 'guest'
      ? `<input data-id="${post.id}" class="comment-input" placeholder="Write a comment..." disabled>`
      : `<input data-id="${post.id}" class="comment-input" placeholder="Write a comment...">`;

    const commentBtn = currentUser.role === 'guest'
      ? `<button data-id="${post.id}" class="comment-btn" disabled>Send</button>`
      : `<button data-id="${post.id}" class="comment-btn">Send</button>`;

    const commentsList = post.comments.map((comment, idx) => {
      const commentData = typeof comment === 'string' ? { author: 'Community', username: null, text: comment, avatar: '../../assets/images/default-avatar.jpg' } : comment;
      const avatarSrc = commentData.avatar || getAvatarByUsername(commentData.username);
      const authorName = commentData.author || 'Anonymous';
      const deleteCommentBtn = currentUser.role === 'admin'
        ? `<button data-id="${post.id}" data-comment-idx="${idx}" class="delete-comment-btn" type="button">×</button>`
        : '';
      return `<div class="comment-item">
        <img class="comment-avatar" src="${avatarSrc}" alt="${authorName}">
        <div class="comment-body">
          <span class="comment-author">${authorName}</span>
          <span class="comment-text">${commentData.text}</span>
        </div>
        ${deleteCommentBtn}
      </div>`;
    }).join('');

    card.innerHTML = `
      <div class="card-header">
        <div class="author-info">
          <img class="post-author-avatar" src="../../assets/images/me.jpg" alt="Author avatar">
          <strong>${post.author}</strong>
        </div>
        <div class="card-header-end">
          <span>${post.date}</span>
          ${deletePostBtn}
        </div>
      </div>
      <p class="post-content">${post.content}</p>
      ${imageHtml}
      <div class="card-stats">${likeBtn}</div>
      <div class="comments">${commentsList}</div>
      <div class="comment-input-row">${commentInput}${commentBtn}</div>
    `;
    root.appendChild(card);
  });
}

/**
 * 保存帖子列表到 localStorage
 */
function persist() {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}