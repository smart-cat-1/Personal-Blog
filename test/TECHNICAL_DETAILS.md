# 博客系统技术实现细节

## 代码改进总结

### 1. 点赞系统数据结构升级

**原数据结构** (数字格式):
```javascript
post.likes = 12  // 无法追踪谁点了赞
```

**新数据结构** (对象格式):
```javascript
post.likes = {
  'user1': true,
  'user2': true,
  'user3': true
}
// 现在知道谁点了赞，点赞总数 = Object.keys(post.likes).length
```

**数据迁移逻辑**:
```javascript
posts = posts.map(post => {
  if (typeof post.likes === 'number') {
    return { ...post, likes: {} };  // 自动转换
  }
  return post;
});
```

---

### 2. 爱心点赞视觉效果实现

#### SVG 爱心图标
```html
<svg class="heart-icon" viewBox="0 0 24 24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>
```

#### CSS 动画
```css
@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.like-btn.liked .heart-icon {
  fill: #ef4444;
  stroke: #ef4444;
  animation: heartBeat 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

#### 点赞检查函数
```javascript
function hasLiked(post) {
  return post.likes[currentUser.username] ? true : false;
}

function getLikeCount(post) {
  return Object.keys(post.likes).length;
}
```

---

### 3. 删除功能实现

#### 删除帖子
```javascript
if (e.target.classList.contains('delete-post-btn')) {
  if (currentUser.role !== 'admin') {
    alert('只有管理员可以删除帖子');
    return;
  }

  const id = Number(e.target.dataset.id);
  if (confirm('确定要删除此帖子吗？')) {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      posts.splice(idx, 1);
      persist();
      renderPosts();
    }
  }
}
```

#### 删除评论
```javascript
if (e.target.classList.contains('delete-comment-btn')) {
  if (currentUser.role !== 'admin') {
    alert('只有管理员可以删除评论');
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
```

---

### 4. 用户信息自定义系统

#### 存储结构
```
localStorage: {
  'user_profile': {
    'username1': {
      'displayName': 'My Custom Name',
      'avatar': null
    },
    'guest': {
      'displayName': 'guest000',
      'avatar': null
    }
  }
}
```

#### 获取用户显示名称
```javascript
function getCurrentDisplayName() {
  const profile = getUserProfile();
  const storedName = profile[currentUser.username]?.displayName;
  
  if (storedName) return storedName;
  if (currentUser.displayName) return currentUser.displayName;
  if (currentUser.role === 'guest') return 'guest000';
  return currentUser.username || 'User';
}
```

#### 更新用户名
```javascript
function updateDisplayName(newName) {
  const profile = getUserProfile();
  if (!profile[currentUser.username]) {
    profile[currentUser.username] = {};
  }
  profile[currentUser.username].displayName = newName;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}
```

---

### 5. 禁用浏览器返回功能

```javascript
// 在页面加载时立即执行
history.pushState(null, null, window.location.href);

// 监听返回按钮点击
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  history.pushState(null, null, window.location.href);
});
```

**原理**:
- `pushState()` 向浏览历史栈中添加一条记录
- `popstate` 事件在用户点击返回时触发
- 通过重新 push 状态，使浏览器停留在当前页面

---

### 6. CSS 三栏布局

#### Flexbox 布局
```css
.main-container {
  display: flex;
  height: calc(100vh - 100px);
  margin-top: 100px;
  gap: 0;
}

.left-sidebar {
  width: 300px;
  overflow-y: auto;
}

.blog-feed {
  flex: 1;  /* 占据剩余空间 */
  overflow-y: auto;
  padding: 20px 30px;
}

.right-sidebar {
  width: 300px;
  overflow-y: auto;
}
```

#### 响应式设计
```css
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;  /* 垂直布局 */
  }

  .left-sidebar,
  .right-sidebar {
    width: 100%;
    max-height: 200px;
  }
}
```

---

### 7. 登录问题修复

#### 问题分析
- 注册成功，但重新打开登录页无法找到已注册用户
- 原因：getUsers() 函数需要正确合并预设用户和注册用户

#### 解决方案
```javascript
function getUsers() {
  const preset = [{ 
    username: 'jhy1750883993', 
    password: 'Jhy405948689', 
    role: 'admin', 
    displayName: 'Hongyu Jin' 
  }];
  
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  // 添加数据有效性检查
  return [...preset, ...saved].filter(u => u && u.username && u.password);
}
```

#### 调试增强
```javascript
console.log('已注册用户:', getUsers());
console.log('输入账号:', username, '输入密码:', password);
```

---

## 性能考虑

### 数据持久化
- 所有数据使用 localStorage（浏览器存储）
- 每次操作后立即调用 persist()
- 刷新页面数据自动恢复

### 重新渲染优化
- 每次修改时重新渲染帖子列表
- 使用 `innerHTML` 追加元素（DOM 操作）
- 对于大数据量可考虑虚拟滚动

### 事件委托
```javascript
// 使用单个事件监听器处理多个元素
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('like-btn')) { ... }
  if (e.target.classList.contains('comment-btn')) { ... }
  if (e.target.classList.contains('delete-post-btn')) { ... }
  if (e.target.classList.contains('delete-comment-btn')) { ... }
});
```

---

## 浏览器兼容性

### 支持特性
- ✅ ES6 (const, let, arrow functions)
- ✅ Promise
- ✅ SVG
- ✅ Flexbox
- ✅ CSS Grid (备用)
- ✅ localStorage API
- ✅ History API

### 测试浏览器
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 安全考虑

### 当前实现（开发环境）
- ⚠️ 密码以明文存储
- ⚠️ 无加密传输
- ⚠️ 所有数据暴露在 localStorage

### 生产环境改进建议
1. 使用 HTTPS 加密传输
2. 实现服务器端验证
3. 使用密钥派生函数（PBKDF2/bcrypt）加密密码
4. 实现 JWT 或 Session Token
5. 添加 CORS 保护
6. 使用 HttpOnly Cookie

---

**技术栈**: HTML5 + CSS3 + Vanilla JavaScript  
**存储方案**: Browser localStorage  
**兼容性**: 现代浏览器  
**最后更新**: 2026-05-06
