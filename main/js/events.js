/**
 * 点赞、评论和删除事件处理
 */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
    e.preventDefault();

    if (currentUser.role === 'guest') {
      alert('Guests cannot like posts. Please log in.');
      return;
    }

    const likeBtn = e.target.classList.contains('like-btn') ? e.target : e.target.closest('.like-btn');
    const id = Number(likeBtn.dataset.id);
    const post = posts.find((p) => p.id === id);

    if (post) {
      if (hasLiked(post)) {
        delete post.likes[currentUser.username];
      } else {
        post.likes[currentUser.username] = true;
      }
      persist();
      renderPosts();
    }
  }

  if (e.target.classList.contains('comment-btn')) {
    if (currentUser.role === 'guest') {
      alert('Guests cannot comment. Please log in.');
      return;
    }

    const id = Number(e.target.dataset.id);
    const input = document.querySelector(`input.comment-input[data-id="${id}"]`);
    if (!input || !input.value.trim()) {
      return;
    }

    const post = posts.find((p) => p.id === id);
    if (post) {
      const displayName = getCurrentDisplayName();
      post.comments.push({
        author: displayName,
        username: currentUser.username,
        text: input.value.trim(),
        avatar: getCurrentAvatar()
      });
      persist();
      renderPosts();
    }
  }

  if (e.target.classList.contains('grid-image')) {
    const src = e.target.dataset.src || e.target.src;
    if (src) {
      showImageViewer(src);
    }
    return;
  }

  if (e.target.classList.contains('delete-comment-btn')) {
    if (currentUser.role !== 'admin') {
      alert('Only administrators can delete comments.');
      return;
    }

    const postId = Number(e.target.dataset.id);
    const commentIdx = Number(e.target.dataset.commentIdx);
    const post = posts.find((p) => p.id === postId);

    if (post) {
      post.comments.splice(commentIdx, 1);
      persist();
      renderPosts();
    }
  }

  if (e.target.classList.contains('delete-post-btn')) {
    if (currentUser.role !== 'admin') {
      alert('Only administrators can delete posts.');
      return;
    }

    const id = Number(e.target.dataset.id);
    if (confirm('Are you sure you want to delete this post?')) {
      const idx = posts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        posts.splice(idx, 1);
        persist();
        renderPosts();
      }
    }
  }
});

/**
 * 显示/隐藏发布编辑器（仅管理员可见）
 */
const editor = document.getElementById('post-editor');
if (currentUser.role === 'admin') {
  editor.classList.remove('hidden');

  document.getElementById('publish-btn').addEventListener('click', () => {
    const text = document.getElementById('new-post-text').value.trim();

    if (!text) {
      alert('Please enter a post message.');
      return;
    }

    if (selectedImages.length > 4) {
      alert('You can upload up to 4 images.');
      return;
    }

    const newPost = {
      id: Date.now(),
      author: 'Hongyu Jin',
      content: text,
      images: selectedImages.slice(),
      date: new Date().toISOString().slice(0, 10),
      likes: {},
      comments: []
    };

    posts.unshift(newPost);
    persist();
    renderPosts();

    document.getElementById('new-post-text').value = '';
    selectedImages = [];
    renderImagePreview();
  });

  document.getElementById('new-post-images').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
    e.target.value = '';
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = Number(e.target.dataset.index);
      selectedImages.splice(index, 1);
      renderImagePreview();
    }
  });
} else {
  editor.classList.add('hidden');
}

/**
 * 登出处理
 */
const logoutButton = document.getElementById('logout');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../../index.html';
  });
}

// 初始化页面
renderProfilePanel();
renderPosts();

const viewerClose = document.getElementById('close-image-viewer');
const viewerOverlay = document.getElementById('image-viewer');
if (viewerClose) {
  viewerClose.addEventListener('click', hideImageViewer);
}
if (viewerOverlay) {
  viewerOverlay.addEventListener('click', (event) => {
    if (event.target === viewerOverlay || event.target.classList.contains('viewer-backdrop')) {
      hideImageViewer();
    }
  });
}