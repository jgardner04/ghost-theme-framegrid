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

### Project Structure

```markdown
ghost-theme-framegrid/
├── assets/ # CSS, JS, and image assets
├── partials/ # Handlebars partial templates
├── locales/ # Translation files
├── templates/ # Page-specific templates
├── package.json # Theme configuration and dependencies
├── routes.yaml # Custom Ghost routing
└── gulpfile.js # Build configuration
```

### Available Scripts

- `npm run dev` - Start development with live reload
- `npm run build` - Build for production
- `npm run zip` - Create theme zip file for upload
- `npm run test` - Run GScan validation
- `npm run lint` - Lint Handlebars templates

### Development Workflow

1. **Ghost CLI Setup**

   ```bash
   # Install Ghost CLI globally
   npm install ghost-cli@latest -g

   # Create new Ghost installation for development
   mkdir ghost-local && cd ghost-local
   ghost install local
   ```

2. **Theme Development**

   ```bash
   cd content/themes/framegrid
   npm run dev
   ```

3. **Theme Validation**

   ```bash
   # Validate theme compliance
   gscan .

   # Or use npm script
   npm run test
   ```

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
