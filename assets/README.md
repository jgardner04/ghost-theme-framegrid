# Assets Directory - Developer Guide

This directory contains all theme assets for the FrameGrid Ghost theme. This document explains the asset architecture, build process, and development workflow.

## 📁 Directory Structure

```
assets/
├── css/
│   ├── src/
│   │   └── main.css          # Tailwind CSS source file
│   ├── main.css              # Compiled CSS (generated)
│   └── main.css.map          # Source map (generated)
├── built/                    # Production-ready assets (generated)
│   ├── main.css             # Minified CSS
│   ├── main.css.map         # Production source map
│   ├── main.js              # Compiled JavaScript
│   └── main.js.map          # JS source map
├── fonts/                   # Web fonts
├── images/                  # Theme images and graphics
└── js/
    └── main.js              # JavaScript source files
```

**🚨 Important**: Files in `built/` and compiled CSS files are **automatically generated**. Do not edit them directly!

## 🏗️ Build System Architecture

### CSS Processing Pipeline

```
assets/css/src/main.css (Tailwind source)
         ↓
    PostCSS Processing
         ↓
    Tailwind CSS compilation
         ↓
    Autoprefixer
         ↓
    assets/css/main.css (development)
         ↓
    CSSnano (production only)
         ↓
    assets/built/main.css (production)
```

### JavaScript Processing Pipeline

```
assets/js/main.js (source)
         ↓
    Copy to built/
         ↓
    Source map generation
         ↓
    assets/built/main.js
```

## 🛠️ Development Workflow

### 1. **CSS Development**

Edit only the source file:

```bash
# Edit this file
assets/css/src/main.css

# These are automatically generated:
assets/css/main.css          # ← Generated by gulp
assets/built/main.css        # ← Generated by gulp
```

### 2. **Tailwind CSS Usage**

The theme uses Tailwind's **component layer** for custom components:

```css
/* assets/css/src/main.css */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* Theme custom variables */
:root {
  --accent-color: #3b82f6;
  --grid-columns: 3;
  --masonry-gap: 10px;
}

/* Custom components */
@layer components {
  .masonry-portfolio {
    display: grid;
    grid-template-columns: repeat(var(--masonry-columns, 3), 1fr);
    grid-auto-rows: auto;
    gap: var(--masonry-gap, 10px);
  }

  .masonry-item {
    break-inside: avoid;
    position: relative;
  }
}

/* Responsive utilities */
@media (max-width: 768px) {
  .masonry-portfolio {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 3. **JavaScript Development**

```javascript
// assets/js/main.js

// Alpine.js components for reactive functionality
document.addEventListener("alpine:init", () => {
  Alpine.data("lightbox", () => ({
    isOpen: false,
    currentImage: null,

    openLightbox(imageSrc, imageAlt) {
      this.currentImage = { src: imageSrc, alt: imageAlt };
      this.isOpen = true;
    },

    closeLightbox() {
      this.isOpen = false;
      this.currentImage = null;
    },
  }));
});
```

## ⚙️ Build Commands

### Development Mode

```bash
# Start development server with file watching
npm run dev

# What this does:
# - Compiles CSS from src/ to both css/ and built/
# - Copies JS to built/ with source maps
# - Starts live reload server
# - Watches for file changes
```

### Production Build

```bash
# Build optimized assets for production
npm run build

# What this does:
# - Compiles and minifies CSS
# - Copies and processes JavaScript
# - Generates source maps
# - Optimizes for performance
```

### Asset Validation

```bash
# Test the theme (includes asset validation)
npm run test

# Lint assets
npm run lint
```

## 🎨 CSS Architecture Guidelines

### 1. **Use CSS Custom Properties**

```css
:root {
  --primary-color: #000;
  --secondary-color: #666;
  --grid-gap: 10px;
}

.component {
  color: var(--primary-color);
  gap: var(--grid-gap);
}
```

### 2. **Component Organization**

```css
/* Group related styles in @layer components */
@layer components {
  /* Component base */
  .masonry-portfolio {
    /* ... */
  }

  /* Component variants */
  .masonry-tight {
    gap: 5px;
  }
  .masonry-loose {
    gap: 20px;
  }

  /* Component states */
  .masonry-item:hover {
    /* ... */
  }
}
```

### 3. **Responsive Design**

```css
/* Mobile-first approach */
.component {
  /* Mobile styles (default) */
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .component {
    /* Tablet and up */
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop and up */
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🚀 Performance Best Practices

### 1. **CSS Performance**

- Use Tailwind's utility classes for common styles
- Create components for repeated patterns
- Leverage CSS custom properties for theming
- Minimize use of complex selectors

### 2. **JavaScript Performance**

- Use Alpine.js for reactive components
- Prefer vanilla JS for performance-critical code
- Implement progressive enhancement
- Minimize DOM manipulation

### 3. **Image Optimization**

- Use Ghost's built-in image optimization
- Implement responsive images with srcset
- Lazy load images below the fold
- Compress images appropriately

## 🔧 Customization Guide

### Adding New Components

1. **Create the CSS component:**

```css
/* assets/css/src/main.css */
@layer components {
  .new-component {
    /* Component styles */
  }
}
```

2. **Add JavaScript functionality:**

```javascript
// assets/js/main.js
Alpine.data("newComponent", () => ({
  // Component logic
}));
```

3. **Use in templates:**

```handlebars
{{! partials/new-component.hbs }}
<div x-data="newComponent" class="new-component">
  <!-- Component markup -->
</div>
```

### Modifying Existing Styles

1. **Find the component** in `assets/css/src/main.css`
2. **Edit the source file** (never edit compiled files)
3. **Test with** `npm run dev`
4. **Build for production** with `npm run build`

## 🐛 Troubleshooting

### Build Issues

**CSS not compiling:**

```bash
# Check for syntax errors
npm run build

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind classes not working:**

```bash
# Ensure Tailwind config is correct
npx tailwindcss --help

# Check PostCSS configuration
cat postcss.config.js
```

**Live reload not working:**

```bash
# Restart development server
npm run dev

# Check if livereload port is available (35729)
lsof -i :35729
```

### File Structure Issues

**Assets not found in Ghost:**

- Ensure `npm run build` has been run
- Check that files exist in `assets/built/`
- Verify Ghost is looking in the correct theme directory

**Source maps missing:**

- Ensure development build: `npm run dev`
- Check gulp configuration in `gulpfile.js`

## 📚 References

- [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [PostCSS Documentation](https://postcss.org/)
- [Gulp Documentation](https://gulpjs.com/)

## 🤝 Contributing to Assets

When contributing to the theme's assets:

1. **Never edit generated files** (`built/`, compiled CSS)
2. **Follow the CSS architecture** (use @layer components)
3. **Test responsive behavior** on multiple screen sizes
4. **Validate CSS** with `npm run lint`
5. **Test performance** after changes
6. **Document new components** in this README

---

**Remember**: Always work with source files and let the build system handle compilation!
