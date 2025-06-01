/**
 * FrameGrid Ghost Theme - Main JavaScript
 */

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("FrameGrid theme loaded");

  // Initialize any non-Alpine functionality here
  initializeTheme();
});

/**
 * Initialize theme functionality
 */
function initializeTheme() {
  // Add any theme-specific initialization here

  // Example: Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Example: Lazy loading for images (if not using native loading="lazy")
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Copy to clipboard functionality (used by Alpine.js components)
 */
window.copyToClipboard = function (text) {
  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Link copied to clipboard");
        // You could show a toast notification here
        return true;
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        return false;
      });
  } else {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (result) {
        console.log("Link copied to clipboard");
      }
      return result;
    } catch (err) {
      console.error("Failed to copy: ", err);
      return false;
    }
  }
};

/**
 * Alpine.js data and methods
 */
document.addEventListener("alpine:init", () => {
  // Global Alpine.js store for theme state
  Alpine.store("theme", {
    // Add any global theme state here
    lightboxOpen: false,
    currentImage: null,

    openLightbox(imageSrc, imageAlt) {
      this.currentImage = { src: imageSrc, alt: imageAlt };
      this.lightboxOpen = true;
      document.body.style.overflow = "hidden";
    },

    closeLightbox() {
      this.lightboxOpen = false;
      this.currentImage = null;
      document.body.style.overflow = "";
    },
  });

  // Global Alpine.js methods
  Alpine.magic("clipboard", () => {
    return (text) => window.copyToClipboard(text);
  });
});

/**
 * Handle keyboard events for accessibility
 */
document.addEventListener("keydown", function (e) {
  // Close lightbox on Escape key
  if (e.key === "Escape") {
    const store = Alpine.store("theme");
    if (store && store.lightboxOpen) {
      store.closeLightbox();
    }
  }
});

/**
 * Performance optimization: Preload critical resources
 */
function preloadCriticalResources() {
  // Preload critical CSS if not already loaded
  const criticalCSS = document.querySelector('link[href*="main.css"]');
  if (criticalCSS && !criticalCSS.hasAttribute("data-preloaded")) {
    criticalCSS.setAttribute("data-preloaded", "true");
  }
}

// Initialize performance optimizations
preloadCriticalResources();
