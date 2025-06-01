/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.hbs",
    "./partials/**/*.hbs",
    "./assets/js/**/*.js",
    // Include any other template files
    "./locales/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        // Ghost theme accent color (customizable via Ghost Admin)
        accent: "var(--accent-color, #3B82F6)",
        // Ghost font colors
        "gh-heading": "var(--gh-color-heading, #15171A)",
        "gh-body": "var(--gh-color-body, #394047)",
        "gh-secondary": "var(--gh-color-secondary, #738A94)",
      },
      fontFamily: {
        // Use Ghost's custom font variables
        "gh-heading":
          'var(--gh-font-heading, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif)',
        "gh-body":
          'var(--gh-font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif)',
      },
      spacing: {
        // Ghost content card spacing
        "ghost-card": "2rem",
      },
      gridTemplateColumns: {
        // Dynamic grid columns based on Ghost custom setting
        "ghost-grid": "repeat(var(--grid-columns, 3), 1fr)",
      },
      maxWidth: {
        // Ghost content widths
        "ghost-content": "800px",
        "ghost-wide": "1200px",
      },
      screens: {
        // Photography-focused responsive breakpoints
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [
    // Add typography plugin for better content styling
    require("@tailwindcss/typography"),
    // Add forms plugin for better form styling
    require("@tailwindcss/forms"),
    // Add aspect ratio plugin for responsive images
    require("@tailwindcss/aspect-ratio"),
  ],
  // Enable dark mode support
  darkMode: ["class", '[data-theme="dark"]'],
  // Optimize for production
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
