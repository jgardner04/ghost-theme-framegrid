# FrameGrid - Nature Photographer Ghost Template

[![Ghost Version](https://img.shields.io/badge/Ghost-5.0+-brightgreen.svg)](https://ghost.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GScan](https://img.shields.io/badge/GScan-passing-brightgreen.svg)](https://gscan.ghost.org/)

> A minimalist Ghost blog template designed specifically for nature photographers who want their imagery to be the primary focus.

![FrameGrid Preview](preview.jpg)

## Overview

FrameGrid is a clean, distraction-free Ghost theme that showcases photography through an elegant masonry grid system while maintaining Ghost's powerful content management capabilities. Built for professional nature photographers, wildlife enthusiasts, and travel photographers, this template emphasizes fast loading, responsive design, and seamless user experience across all devices.

## ✨ Key Features

### 🖼️ **Masonry Portfolio Grid System**

- Responsive 3-column masonry layout with 10px gutters
- Accommodates mixed aspect ratios (2:3, 16:9, panoramic 1:2, 1:3, Xpan crops)
- Infinite scroll loading with Ghost's Content API
- Hover effects with clickable post titles

### 🔍 **Advanced Lightbox Experience**

- Full-size featured image display in overlay
- Post title and excerpt below images
- Touch and keyboard navigation optimized
- Seamless transition from grid to full post

### 📝 **Multi-Layout Blog System**

- Alternating left/right layout for blog posts
- Full-width featured images
- Optimized reading experience for field notes and stories
- Responsive breakpoints for all devices

### 🏷️ **Intelligent Content Categorization**

- **Portfolio Categories**: Wildlife, Landscape, Underwater, Cityscape
- **Location Categories**: Alaska, Kenya, Washington, California, Japan, Italy, Florida, Iceland
- Ghost's native multi-tag system with custom routing
- Single posts can appear in multiple relevant sections

### 👥 **Advanced Members Integration**

- Complete Ghost members system support
- Member tiers for workshop bookings and exclusive content
- Gated gallery access with subscription management
- Newsletter segmentation for different user types

### 🎨 **Ghost Cards Support**

- Full support for Ghost's rich content cards
- Custom styling for Gallery Cards in portfolio posts
- Bookmark Cards for external links
- File Cards for downloadable content

## 🚀 Quick Start

### Prerequisites

- [Ghost CLI](https://ghost.org/docs/ghost-cli/) installed
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jgardner04/ghost-theme-framegrid.git
   cd ghost-theme-framegrid
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Development setup**

   ```bash
   # Start Ghost in development mode
   ghost start --development

   # In another terminal, start theme development
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Install in Ghost**

   ```bash
   # Zip the theme
   npm run zip

   # Upload the zip file in Ghost Admin > Design > Upload theme
   ```

## 🛠️ Development

### Project Architecture

FrameGrid follows Ghost theme development best practices with a **dual-directory structure**:

```markdown
ghost-theme-framegrid/ (DEVELOPMENT)
├── assets/ # Theme assets (CSS, JS, images)
│ ├── css/src/main.css # Tailwind CSS source files
│ ├── built/ # Compiled/minified assets
│ ├── fonts/ # Web fonts
│ ├── images/ # Theme images
│ └── js/ # JavaScript files
├── partials/ # Handlebars partial templates
├── locales/ # Translation files
├── \*.hbs # Template files (index.hbs, post.hbs, etc.)
├── package.json # Theme configuration and dependencies
├── routes.yaml # Custom Ghost routing
├── gulpfile.js # Build configuration
└── ghost-local/ # LOCAL GHOST INSTALLATION (testing only)
└── content/themes/ # Where themes are installed for testing
```

**Important**:

- **Root directory** = Your theme development workspace
- **`ghost-local/`** = Local Ghost installation for testing (excluded from version control)
- This separation allows clean development while providing a proper testing environment

### Available Scripts

- `npm run dev` - Start development with live reload and file watching
- `npm run build` - Build for production (compiles CSS, copies assets)
- `npm run zip` - Create theme zip file for upload to Ghost
- `npm run test` - Run GScan validation to ensure Ghost compatibility
- `npm run lint` - Lint CSS and JavaScript files

### Development Workflow

#### 1. **Initial Setup** (First time only)

```bash
# Clone and setup the theme
git clone https://github.com/jgardner04/ghost-theme-framegrid.git
cd ghost-theme-framegrid
npm install

# Install Ghost CLI globally (if not already installed)
npm install ghost-cli@latest -g

# Create local Ghost installation for testing
mkdir ghost-local && cd ghost-local
ghost install local --db=sqlite3 --development
cd ..
```

#### 2. **Daily Development Workflow**

```bash
# Start Ghost (run from ghost-local directory)
cd ghost-local && ghost start --development

# In another terminal, start theme development (from root)
cd /path/to/ghost-theme-framegrid
npm run dev
```

#### 3. **Asset Building**

The build system automatically:

- Compiles Tailwind CSS from `assets/css/src/main.css`
- Outputs to both `assets/css/main.css` and `assets/built/main.css`
- Processes JavaScript and copies to `assets/built/`
- Watches for changes and rebuilds automatically in dev mode

```bash
# Development build with watching
npm run dev

# Production build (optimized)
npm run build
```

#### 4. **Testing Your Theme**

```bash
# Option A: Manual installation in Ghost Admin
npm run zip
# Upload the generated .zip file in Ghost Admin > Design > Upload theme

# Option B: Direct linking (for development)
ln -s $(pwd) ghost-local/content/themes/framegrid
# Restart Ghost and activate theme in admin
```

#### 5. **Theme Validation**

```bash
# Validate theme against Ghost standards
npm run test

# This runs GScan to check for:
# - Template requirements
# - Ghost version compatibility
# - Best practice compliance
```

### Build System Details

The theme uses **Gulp** with **PostCSS** and **Tailwind CSS**:

- **CSS Processing**: Tailwind CSS → PostCSS → Autoprefixer → Minification
- **JavaScript**: Copy and sourcemap generation
- **File Watching**: Auto-rebuild on changes
- **Live Reload**: Browser refresh on template/asset changes

### File Structure Explained

```markdown
├── assets/css/src/ # Source CSS files
│ └── main.css # Main Tailwind CSS file
├── assets/built/ # Compiled assets (auto-generated)
├── partials/ # Reusable template components
│ ├── components/ # UI components
│ ├── icons/ # SVG icons
│ └── typography/ # Text styling partials
├── locales/ # Translation files
├── default.hbs # Base layout template
├── index.hbs # Homepage template
├── post.hbs # Single post template
├── page.hbs # Static page template
└── package.json # Theme metadata and Ghost config
```

### CSS Architecture (Tailwind + Custom)

The theme uses a **component-based CSS architecture**:

```css
/* assets/css/src/main.css */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* Custom components in @layer components */
@layer components {
  .masonry-portfolio {
    /* Masonry grid styles */
  }
  .masonry-item {
    /* Individual portfolio items */
  }
  /* etc. */
}
```

**Key CSS Features:**

- **CSS Custom Properties** for dynamic theming
- **Responsive design** with mobile-first approach
- **Component organization** following Tailwind best practices
- **Performance optimization** with PurgeCSS

### JavaScript Architecture

The theme uses **Alpine.js** for reactive functionality:

```javascript
// assets/js/main.js
// Lightweight JavaScript for:
// - Lightbox functionality
// - Infinite scroll
// - Theme toggling
// - Mobile navigation
```

**JavaScript Features:**

- **Alpine.js** for reactive components
- **Vanilla JS** for performance-critical features
- **Progressive enhancement** approach
- **Touch and keyboard navigation** support

## 📋 Configuration

### Ghost Admin Settings

Access these settings in **Ghost Admin > Design > Customize**:

- **Grid Columns**: Choose between 2, 3, or 4 columns
- **Accent Color**: Customize the theme accent color
- **Author Bio**: Show/hide author biography
- **Featured Posts**: Number of posts on homepage (default: 6)

### Routes Configuration

The theme includes custom routing in `routes.yaml`:

```yaml
routes:
  /portfolio/: "portfolio"
  /portfolio/wildlife/: "portfolio-wildlife"
  /portfolio/landscape/: "portfolio-landscape"
  /locations/: "locations"

collections:
  /locations/{slug}/:
    permalink: /locations/{slug}/
    template: location
    filter: tag:location
```

### Content Organization

#### Portfolio Categories (Primary Tags)

- `wildlife` - Wildlife photography
- `landscape` - Landscape photography
- `underwater` - Underwater photography
- `cityscape` - Urban and architectural photography

#### Location Tags (Secondary Tags)

- `alaska`, `kenya`, `washington`, `california`
- `japan`, `italy`, `florida`, `iceland`

## 🎯 Usage Guidelines

### Content Creation Best Practices

1. **Featured Images**: Use high-quality images optimized for web (2400px max width)
2. **Post Excerpts**: Write compelling excerpts that appear in lightbox view
3. **Gallery Cards**: Use Ghost Gallery Cards for photo collections
4. **Tags**: Apply both portfolio and location tags for optimal categorization

### Image Optimization

The theme includes optimized image sizes:

- **xs**: 300px (mobile thumbnails)
- **s**: 600px (tablet thumbnails)
- **m**: 1000px (desktop thumbnails)
- **l**: 1600px (lightbox display)
- **xl**: 2400px (full resolution)

### Members and Monetization

1. **Workshop Tier**: Create paid tier for workshop access
2. **Premium Content**: Gate exclusive galleries behind membership
3. **Newsletter**: Use Ghost's native newsletter for updates
4. **Booking System**: Leverage member portal for workshop bookings

## 🎨 Customization

### Color Scheme

The theme uses a minimal color palette:

- **Primary**: Black (#000000) and White (#FFFFFF)
- **Accent**: Baby Blue (#3B82F6) - customizable in Ghost Admin
- **Text**: High contrast grays for optimal readability

### Typography

- **System Fonts**: Optimized for performance and readability
- **Fallback**: Inter font family for enhanced typography
- **Responsive**: Fluid typography scaling across devices

### CSS Customization

Add custom styles in `assets/css/custom.css`:

```css
/* Custom accent color example */
.accent-color {
  color: var(--accent-color, #3b82f6);
}

/* Custom grid spacing */
.masonry-grid {
  gap: var(--grid-gap, 10px);
}
```

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- iOS Safari 14+
- Android Chrome 88+

## 📈 Performance

- **Load Time**: <3 seconds on 3G networks
- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: Ghost's native CDN integration
- **Lazy Loading**: Implemented for optimal performance
- **AMP Support**: Automatic AMP page generation

## 🔧 Technical Requirements

### Ghost Compatibility

- **Ghost Version**: 5.0+ (backward compatible to 4.0)
- **Node.js**: 16.x or higher
- **Ghost Features**: Content API, Members API, Admin API

### Hosting Requirements

- **Ghost Pro**: Fully compatible
- **Self-hosted**: Node.js environment required
- **CDN**: Works with Ghost's native CDN and external CDNs

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests and validation (`npm run test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Reporting Issues

Please use the [GitHub issue tracker](https://github.com/yourusername/ghost-theme-framegrid/issues) to report bugs or request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ghost](https://ghost.org/) for the amazing CMS platform
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework
- [Alpine.js](https://alpinejs.dev/) for lightweight JavaScript framework
- Photography community for inspiration and feedback

## 📞 Support

- **Documentation**: [Theme Documentation](docs/)
- **Community**: [Ghost Forum](https://forum.ghost.org/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ghost-theme-framegrid/issues)
- **Email**: [jonathan@jonathangardner.io](jonathan@jonathangardner.io)

---

Made with ❤️ for nature photographers using Ghost CMS
