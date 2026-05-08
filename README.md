# Personal-Blog

A clean and elegant personal blog system built with pure frontend technologies, supporting user registration, login, blog posting, comment interactions, and more.

## Features

- **User System**: Supports user registration and login with data stored in local storage
- **Blog Publishing**: Supports publishing text content and multiple images (up to 4)
- **Image Preview**: Preview images before publishing with delete option
- **Image Viewing**: Click images for fullscreen viewing
- **Like System**: Users can like blog posts
- **Comment System**: Supports commenting on blog posts
- **Admin Features**: Administrators can delete posts and comments
- **Responsive Design**: Adapts to different screen sizes
- **Beautiful UI**: Modern interface design

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage (client-side storage)
- **Styling**: Custom CSS, no framework dependencies
- **Interactions**: Vanilla JavaScript, no third-party libraries

## Project Structure

```
Personal-Blog/
├── index.html                 # Login page
├── main/
│   ├── html/
│   │   └── blog.html          # Main blog page
│   ├── css/
│   │   ├── layout.css         # Page layout styles
│   │   ├── components.css     # Component styles
│   │   └── blog.css           # Blog-specific style overrides
│   └── js/
│       ├── config.js          # Configuration file
│       ├── utils.js           # Utility functions
│       ├── render.js          # Rendering functions
│       ├── events.js          # Event handlers
│       └── index.js           # Login page logic
├── assets/
│   └── images/                # Image assets
│       ├── me.jpg             # User avatar
│       ├── flower2.jpg        # Background image
│       └── default-avatar.jpg # Default avatar
├── test/                      # Test-related files
└── README.md                  # Project documentation
```

## Installation and Running

### Requirements

- Modern browser (ES6+ support)
- No server required, runs directly in browser

### Running Steps

1. **Clone the project**
   ```bash
   git clone https://github.com/smart-cat-1/Personal-Blog.git
   cd Personal-Blog
   ```

2. **Start local server**
   ```bash
   # Use Python to start HTTP server
   python -m http.server 8000

   # Or use other methods to start server
   ```

3. **Access the application**
   Open browser and visit `http://localhost:8000`

4. **First time usage**
   - Click "Register" to create a new account
   - Or login with preset accounts:
     - Username: admin, Password: admin123 (Administrator)
     - Username: user, Password: user123 (Regular User)

## Usage Guide

### User Registration and Login

1. Enter username and password on the login page
2. New users click "Register" to sign up
3. After login, enter the main blog page

### Publishing Blogs

1. Click the publish area at the top of the blog page
2. Enter blog content
3. Optionally upload up to 4 images
4. Click "Publish" to post

### Image Upload

- Supports drag-and-drop or click to select images
- Preview and delete images before publishing
- Click published images for fullscreen viewing

### Interaction Features

- Click heart icon to like posts
- Enter comments in the comment box and send
- Administrators can delete inappropriate content

### Profile Management

- View and edit profile in the right sidebar
- Supports avatar upload

## Development Notes

### Code Structure

- **config.js**: Application configuration and preset data
- **utils.js**: General utility functions
- **render.js**: Page rendering logic
- **events.js**: User interaction event handling

### Styling Organization

- **layout.css**: Page layout and global styles
- **components.css**: Reusable component styles
- **blog.css**: Blog page specific style overrides

### Data Storage

The project uses browser LocalStorage for data storage:

- User information
- Blog posts
- Comments
- Like records

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

Issues and Pull Requests are welcome to improve the project!

1. Fork this project
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Submit Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Author

**Hongyu Jin** - [GitHub](https://github.com/smart-cat-1)

## Acknowledgments

- Thanks to all contributors and users
- Inspired by modern blog platforms' user experience design