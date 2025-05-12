# 🌟 Fajar Geran's Portfolio Website

A modern, responsive personal portfolio website with anime-inspired interactive elements. This project showcases professional skills and projects through an immersive user experience.

![Portfolio Preview](/images/Screenshot%20from%202025-05-04%2001-51-12.png)

## ✨ Features

- **Interactive 3D Welcome Card**: Rotate and interact with a fully 3D welcome card
- **Anime-Style Animations**: Dynamic entrance/exit animations inspired by anime opening sequences
- **Parallax Layered Background**: Multi-layer depth effect that responds to mouse movement
- **Multi-language Support**: Full localization in English, Indonesian, and Japanese
- **Performance Optimized**: Automatic detection of device capabilities with quality/performance toggle
- **Responsive Design**: Optimized experience across all devices and screen sizes
- **Zero Dependencies**: Built with vanilla JavaScript for optimal performance and loading speed

## 🎬 Animation Highlights

- **3D Card Rotation**: Interactive card that responds to mouse movements in 3D space
- **Anime Exit Sequence**: 360° rotation with motion blur and lens flare effects
- **Staggered Content Reveal**: Elements appear sequentially for a cinematic feel
- **Particle Effects**: Floating particles add visual interest and depth
- **Twinkling Star Background**: Dynamic background elements create an immersive environment

## 🚀 Live Demo

[Visit the live website](#) _(Coming soon)_

## 🛠️ Tech Stack

### Frontend

- HTML5, CSS3, JavaScript (ES6+)
- CSS Variables and Custom Properties for theming
- CSS 3D Transforms and Animations
- Canvas API for advanced animations

### Tools & Techniques

- LocalStorage for user preferences
- SweetAlert2 for enhanced notifications
- i18n implementation for multi-language support
- Performance optimization techniques

## 💻 Installation & Setup

1. Clone this repository

   ```bash
   git clone https://github.com/grnlogic/portfolio.git
   cd portfolio
   ```

2. No build steps required! Simply open the project in your preferred browser:

   ```bash
   # Using Python's built-in HTTP server
   python -m http.server 8000

   # Or with Node's http-server (if installed)
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

## 🧠 Project Structure

```
portfolio/
├── css/                  # Stylesheets
│   ├── welcome-card.css  # 3D card animations
│   ├── particles.css     # Particle effects
│   └── parallax-bg.css   # Parallax background effects
├── js/                   # JavaScript files
│   ├── welcome-card.js   # Interactive 3D card logic
│   ├── anime-particles.js # Anime-style particle animations
│   └── parallax-bg.js    # Parallax background effects
├── images/               # Image assets
└── index.html            # Main entry point
```

## 📱 Optimizations

The portfolio includes built-in optimizations:

- Automatic detection of low-performance devices
- Performance/Quality toggle for user preference
- Reduced animation complexity on mobile devices
- Lazy loading of non-critical resources
- Throttled event handlers for smooth performance

## 🔧 Customization

To customize for your own use:

1. Replace personal information in `index.html`
2. Update images in the `images/` directory
3. Modify color scheme in CSS variables (located in `style.css`)
4. Update project descriptions and links

## 📝 License

MIT License - Feel free to use and modify for your own portfolio

## 🔗 Contact

- GitHub: [grnlogic](https://github.com/grnlogic)
- Email: 237006079@student.unsil.ac.id
- Portfolio: [Coming Soon](#)

---

<p align="center">Made with ❤️ and inspired by anime aesthetics</p>
