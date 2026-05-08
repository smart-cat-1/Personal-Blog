// 获取当前登录会话
const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (!session) {
  window.location.href = '../../index.html';
}

const currentUser = session.user;

// 禁用浏览器返回功能
history.pushState(null, null, window.location.href);
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  history.pushState(null, null, window.location.href);
});

// 从 localStorage 获取帖子列表
let posts = JSON.parse(localStorage.getItem(POSTS_KEY) || JSON.stringify(defaultPosts));

// 存储选择的图片文件
let selectedImages = [];

// 迁移旧数据格式并标准化图片字段
posts = posts.map(post => {
  const normalized = { ...post };
  if (typeof normalized.likes === 'number') {
    normalized.likes = {};
  }
  if (!Array.isArray(normalized.images)) {
    if (typeof normalized.image === 'string' && normalized.image) {
      normalized.images = [normalized.image];
    } else {
      normalized.images = [];
    }
  }
  normalized.images = normalized.images.slice(0, 4);

  if (!Array.isArray(normalized.comments)) {
    normalized.comments = [];
  }
  normalized.comments = normalizeComments(normalized.comments);
  delete normalized.image;
  return normalized;
});

localStorage.setItem(POSTS_KEY, JSON.stringify(posts));

function getAvatarByUsername(username) {
  if (!username) {
    return '../../assets/images/default-avatar.jpg';
  }
  const profile = getUserProfile();
  return profile[username]?.avatar || '../../assets/images/default-avatar.jpg';
}

function normalizeComments(comments) {
  return comments.map((comment) => {
    if (typeof comment === 'string') {
      return {
        author: comment.includes(':') ? comment.split(':')[0].trim() : 'Community',
        username: null,
        text: comment.includes(':') ? comment.slice(comment.indexOf(':') + 1).trim() : comment,
        avatar: '../../assets/images/default-avatar.jpg'
      };
    }

    return {
      author: comment.author || comment.displayName || 'Anonymous',
      username: comment.username || null,
      text: comment.text || '',
      avatar: comment.avatar || getAvatarByUsername(comment.username)
    };
  });
}

/**
 * 获取或初始化用户个人资料
 */
function getUserProfile() {
  let profile = JSON.parse(localStorage.getItem(USER_PROFILE_KEY) || 'null');
  if (!profile) {
    profile = {
      [currentUser.username]: {
        displayName: currentUser.role === 'guest' ? 'guest000' : currentUser.displayName,
        avatar: null
      }
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }
  return profile;
}

/**
 * 获取当前用户的显示名称
 */
function getCurrentDisplayName() {
  const profile = getUserProfile();
  const storedName = profile[currentUser.username]?.displayName;

  if (storedName) {
    return storedName;
  }

  if (currentUser.displayName) {
    return currentUser.displayName;
  }

  if (currentUser.role === 'guest') {
    return 'guest000';
  }

  return currentUser.username || 'User';
}

/**
 * 更新用户显示名称
 */
function updateDisplayName(newName) {
  const profile = getUserProfile();
  if (!profile[currentUser.username]) {
    profile[currentUser.username] = {};
  }
  profile[currentUser.username].displayName = newName;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

/**
 * 获取当前用户的头像
 */
function getCurrentAvatar() {
  const profile = getUserProfile();
  return profile[currentUser.username]?.avatar || '../../assets/images/default-avatar.jpg';
}

/**
 * 更新用户头像
 */
function updateAvatar(avatarDataUrl) {
  const profile = getUserProfile();
  if (!profile[currentUser.username]) {
    profile[currentUser.username] = {};
  }
  profile[currentUser.username].avatar = avatarDataUrl;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

/**
 * 计算点赞数
 */
function getLikeCount(post) {
  return Object.keys(post.likes).length;
}

/**
 * 检查当前用户是否已点赞
 */
function hasLiked(post) {
  return post.likes[currentUser.username] ? true : false;
}

/**
 * 读取文件为 Data URL
 */
function readFilesAsDataURLs(files) {
  return Promise.all(Array.from(files).map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

function handleFileSelect(files) {
  if (selectedImages.length + files.length > 4) {
    alert('You can upload up to 4 images.');
    return;
  }

  readFilesAsDataURLs(files).then((images) => {
    selectedImages.push(...images);
    renderImagePreview();
  }).catch(() => {
    alert('Unable to read selected images. Please try again.');
  });
}