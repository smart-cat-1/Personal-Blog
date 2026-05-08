const SESSION_KEY = 'blog_session';
const POSTS_KEY = 'blog_posts';
const USER_PROFILE_KEY = 'user_profile';

// 默认帖子列表
const defaultPosts = [
  {
    id: 1,
    author: 'Hongyu Jin',
    content: 'Hello, everyone. Welcome to my blog!',
    images: [],
    date: '2026-05-01',
    likes: {},
    comments: []
  },
  {
    id: 2,
    author: 'Hongyu Jin',
    content: 'I made a personal portfolio, but rather than a portfolio, it feels more like a casual \'self-introduction\' style website. I designed an attractive layout and interesting details. Oh, and I also created a light and dark mode toggle button, right at the top right corner. Anyway, if you want to get to know me better, feel free to take a look. You can visit my code repository at "https://github.com/smart-cat-1/Personal-Portfolio" or go directly to the website at "https://smart-cat-1.github.io/Personal-Portfolio/". I think you probably need to copy the website into your browser\'s search bar.',
    images: ['../../assets/images/Screenshot111.png'],
    date: '2026-05-04',
    likes: {},
    comments: []
  }
];