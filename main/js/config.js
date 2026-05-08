const SESSION_KEY = 'blog_session';
const POSTS_KEY = 'blog_posts';
const USER_PROFILE_KEY = 'user_profile';

// 默认帖子列表
const defaultPosts = [
  {
    id: 1,
    author: 'Hongyu Jin',
    content: 'Hello, I have arrived here!',
    images: [],
    date: '2026-05-05',
    likes: {},
    comments: ['Welcome!']
  },
  {
    id: 2,
    author: 'Hongyu Jin',
    content: 'Today sharing a landscape picture.',
    images: ['https://picsum.photos/seed/blog/600/300'],
    date: '2026-05-04',
    likes: {},
    comments: []
  },
  {
    id: 3,
    author: 'Hongyu Jin',
    content: 'Welcome to this community!',
    images: [],
    date: '2026-05-07',
    likes: {},
    comments: []
  }
];