# Contributing to FrameGrid Ghost Theme

Thank you for your interest in contributing to FrameGrid! This document provides guidelines for contributing to the theme development.

## 🚀 Quick Start for Contributors

### 1. **Development Environment Setup**

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/ghost-theme-framegrid.git
cd ghost-theme-framegrid

# Install dependencies
npm install

# Set up local Ghost installation for testing
mkdir ghost-local && cd ghost-local
ghost install local --db=sqlite3 --development
cd ..
```

### 2. **Development Workflow**

```bash
# Start Ghost (terminal 1)
cd ghost-local && ghost start --development

# Start theme development (terminal 2)
npm run dev

# Your theme will be available at:
# http://localhost:2368 (Ghost site)
# http://localhost:2368/ghost/ (Ghost admin)
```

## 📁 Project Architecture Understanding

### **Dual Directory Structure**

- **Root directory** (`/`) = Theme development workspace
- **`ghost-local/`** = Local Ghost installation for testing only
- **Never edit files in `ghost-local/`** - it's for testing only

### **Asset Architecture**

```
assets/
├── css/src/main.css      # ← EDIT THIS (Tailwind source)
├── css/main.css          # ← Generated by build
├── built/                # ← Generated by build
├── js/main.js           # ← Edit for JavaScript
└── images/              # ← Static assets
```

**🚨 Critical**: Only edit source files. Never edit generated files in `built/` or compiled CSS.

## 🛠️ Development Best Practices

### **CSS Development (Tailwind)**

1. **Edit only the source file:**

   ```css
   /* assets/css/src/main.css - EDIT THIS FILE */
   @layer components {
     .masonry-portfolio {
       display: grid;
       grid-template-columns: repeat(var(--masonry-columns, 3), 1fr);
       /* ... */
     }
   }
   ```

2. **Use CSS custom properties for theming:**

   ```css
   :root {
     --masonry-gap: 10px;
     --masonry-columns: 3;
   }
   ```

3. **Follow component-based architecture:**

   ```css
   @layer components {
     /* Base component */
     .component-name {
       /* ... */
     }

     /* Variants */
     .component-name--variant {
       /* ... */
     }

     /* States */
     .component-name:hover {
       /* ... */
     }
   }
   ```

### **JavaScript Development (Alpine.js)**

1. **Use Alpine.js for reactive components:**

   ```javascript
   // assets/js/main.js
   Alpine.data("componentName", () => ({
     property: "value",
     method() {
       // Component logic
     },
   }));
   ```

2. **Progressive enhancement approach:**
   ```javascript
   // Ensure base functionality works without JavaScript
   // Then enhance with Alpine.js
   ```

### **Handlebars Templates**

1. **Use semantic HTML:**

   ```handlebars
   <article class="masonry-item" itemscope itemtype="http://schema.org/Article">
     {{#if feature_image}}
       <img src="{{img_url feature_image size="m"}}" alt="{{title}}" />
     {{/if}}
   </article>
   ```

2. **Follow Ghost helpers properly:**

   ```handlebars
   {{!-- Responsive images --}}
   {{img_url feature_image size='s'}}

   {{!-- Proper loops --}}
   {{#foreach posts}}
     {{> "partials/card"}}
   {{/foreach}}
   ```

3. **Use partials for reusable components:**
   ```handlebars
   {{!-- partials/masonry-portfolio.hbs --}}
   <div class="masonry-portfolio">
     {{#foreach posts}}
       {{> "partials/masonry-item"}}
     {{/foreach}}
   </div>
   ```

## 🧪 Testing Requirements

### **Before Submitting**

1. **Validate theme compliance:**

   ```bash
   npm run test  # Runs GScan validation
   ```

2. **Test responsive design:**

   - Mobile (≤640px)
   - Tablet (641px-768px)
   - Desktop (≥769px)

3. **Test in Ghost:**

   ```bash
   # Test theme installation
   npm run zip
   # Upload in Ghost Admin > Design > Upload theme
   ```

4. **Browser testing:**
   - Chrome 88+
   - Firefox 85+
   - Safari 14+
   - Edge 88+

### **Performance Testing**

1. **Lighthouse audit** (aim for 95+ scores)
2. **Test image loading** with various sizes
3. **Test JavaScript functionality** across devices

## 📝 Code Style Guidelines

### **CSS**

- Use **2 spaces** for indentation
- Follow **Tailwind CSS** conventions
- Use **kebab-case** for class names
- **Group related styles** in components

### **JavaScript**

- Use **2 spaces** for indentation
- Follow **modern ES6+** syntax
- Use **camelCase** for variables/functions
- **Comment complex logic**

### **Handlebars**

- Use **2 spaces** for indentation
- **Comment complex logic** with `{{!-- --}}`
- Use **semantic HTML5** elements
- Follow **Ghost helper** conventions

## 🔄 Contribution Process

### **1. Before Starting**

1. **Check existing issues** for duplicate work
2. **Create an issue** for new features/bugs
3. **Discuss approach** in the issue before coding

### **2. Development Process**

1. **Create feature branch:**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. **Make your changes** following guidelines above

3. **Test thoroughly:**

   ```bash
   npm run test    # GScan validation
   npm run build   # Production build test
   npm run dev     # Development testing
   ```

4. **Commit with descriptive messages:**

   ```bash
   git commit -m "feat(masonry): add responsive image loading

   - Implement lazy loading for masonry grid images
   - Add responsive srcset for various screen sizes
   - Update Alpine.js lightbox component
   - Add proper alt text handling

   Closes #123"
   ```

### **3. Submission**

1. **Create Pull Request** with:

   - Clear description of changes
   - Screenshots/demos if UI changes
   - Test results (GScan, browser testing)
   - Reference to related issues

2. **Respond to review feedback** promptly

3. **Ensure CI passes** (all automated tests)

## 🐛 Bug Reports

When reporting bugs, include:

1. **Ghost version** you're testing with
2. **Browser and version**
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Screenshots** if visual issue
6. **Console errors** if JavaScript related

### **Bug Report Template**

```markdown
**Bug Description:**
Brief description of the issue

**Environment:**

- Ghost Version: 5.x.x
- Browser: Chrome 120
- Device: Desktop/Mobile
- Theme Version: 1.x.x

**Steps to Reproduce:**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable, add screenshots

**Additional Context:**
Any other context about the problem
```

## 🚀 Feature Requests

For new features:

1. **Check if it fits** the theme's photography focus
2. **Consider Ghost compatibility** (current + future versions)
3. **Think about performance** impact
4. **Provide use cases** and examples

## 🏷️ Git Conventions

### **Commit Message Format**

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/styling changes (not affecting functionality)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, etc.

**Scopes:**

- `masonry`: Masonry grid system
- `lightbox`: Image lightbox functionality
- `responsive`: Responsive design
- `alpine`: Alpine.js components
- `css`: Styling changes
- `js`: JavaScript changes
- `build`: Build system changes

### **Branch Naming**

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

## 📚 Resources

### **Ghost Documentation**

- [Ghost Theme Development](https://ghost.org/docs/themes/)
- [Ghost Handlebars Helpers](https://ghost.org/docs/themes/helpers/)
- [Ghost Content API](https://ghost.org/docs/content-api/)

### **Technology Stack**

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Alpine.js](https://alpinejs.dev/)
- [PostCSS](https://postcss.org/)
- [Gulp](https://gulpjs.com/)

### **Tools**

- [GScan](https://gscan.ghost.org/) - Theme validation
- [Ghost CLI](https://ghost.org/docs/ghost-cli/) - Development setup

## 🤝 Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs/features
- **Email**: [jonathan@jonathangardner.io](mailto:jonathan@jonathangardner.io)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for contributing to FrameGrid! 🙏**

Every contribution helps make this theme better for nature photographers worldwide.
