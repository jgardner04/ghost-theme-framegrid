/**
 * FrameGrid Ghost Theme - Masonry Layout Integration
 * Integrates Masonry.js with Alpine.js for responsive portfolio grid
 */

/**
 * Alpine.js component for Masonry layout management
 */
document.addEventListener("alpine:init", () => {
  Alpine.data("masonryGrid", () => ({
    // Component state
    masonry: null,
    isInitialized: false,
    isLoading: true,
    loadedImages: 0,
    totalImages: 0,
    resizeTimeout: null,

    // Initialize the component
    init() {
      this.$nextTick(() => {
        this.setupMasonry();
      });
    },

    // Setup masonry layout
    async setupMasonry() {
      try {
        // Wait for Masonry library to be available
        if (typeof Masonry === "undefined") {
          await this.loadMasonryLibrary();
        }

        // Count total images for loading progress
        this.totalImages = this.$el.querySelectorAll("img").length;

        if (this.totalImages === 0) {
          this.isLoading = false;
          this.initializeMasonry();
          return;
        }

        // Wait for images to load before initializing masonry
        await this.waitForImages();
        this.initializeMasonry();
      } catch (error) {
        console.error("Failed to setup masonry:", error);
        this.isLoading = false;
        // Fallback to CSS Grid layout (already in place)
      }
    },

    // Load Masonry library dynamically
    loadMasonryLibrary() {
      return new Promise((resolve, reject) => {
        if (typeof Masonry !== "undefined") {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "/assets/built/vendor/masonry.pkgd.min.js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load Masonry library"));
        document.head.appendChild(script);
      });
    },

    // Wait for all images to load
    waitForImages() {
      return new Promise((resolve) => {
        const images = this.$el.querySelectorAll("img");

        if (images.length === 0) {
          resolve();
          return;
        }

        let loadedCount = 0;
        const checkComplete = () => {
          loadedCount++;
          this.loadedImages = loadedCount;

          if (loadedCount >= images.length) {
            this.isLoading = false;
            resolve();
          }
        };

        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener("load", checkComplete);
            img.addEventListener("error", checkComplete); // Count errors as "loaded" to prevent hanging
          }
        });
      });
    },

    // Initialize Masonry instance
    initializeMasonry() {
      // Only initialize masonry on multi-column layouts
      if (!this.shouldUseMasonry()) {
        this.isInitialized = false;
        return;
      }

      try {
        this.masonry = new Masonry(this.$el, {
          itemSelector: ".masonry-item",
          columnWidth: ".masonry-item",
          gutter: this.getGutterSize(),
          percentPosition: true,
          transitionDuration: "0.3s",
          stagger: 30,
          fitWidth: false,
        });

        this.isInitialized = true;
        this.setupResizeHandler();

        // Trigger layout after initialization
        this.$nextTick(() => {
          this.masonry.layout();
        });

        console.log("Masonry initialized successfully");
      } catch (error) {
        console.error("Failed to initialize masonry:", error);
        this.isInitialized = false;
      }
    },

    // Check if masonry should be used based on screen size
    shouldUseMasonry() {
      return window.innerWidth >= 768; // Only use masonry on tablet and desktop
    },

    // Get appropriate gutter size based on screen size
    getGutterSize() {
      if (window.innerWidth <= 640) {
        return 6; // Mobile
      } else if (window.innerWidth <= 768) {
        return 8; // Tablet
      }
      return 10; // Desktop
    },

    // Setup responsive resize handler
    setupResizeHandler() {
      window.addEventListener("resize", () => {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
          this.handleResize();
        }, 250); // Debounce resize events
      });
    },

    // Handle window resize
    handleResize() {
      const shouldUse = this.shouldUseMasonry();

      if (shouldUse && !this.isInitialized) {
        // Initialize masonry if we switched to multi-column
        this.initializeMasonry();
      } else if (!shouldUse && this.isInitialized) {
        // Destroy masonry if we switched to single column
        this.destroyMasonry();
      } else if (this.isInitialized) {
        // Update gutter size and relayout
        this.masonry.options.gutter = this.getGutterSize();
        this.masonry.layout();
      }
    },

    // Add new items to masonry (for infinite scroll)
    addItems(newItems) {
      if (!this.isInitialized || !this.masonry) {
        return;
      }

      try {
        // Wait for new images to load
        const images = newItems.querySelectorAll("img");
        let loadedCount = 0;

        const checkComplete = () => {
          loadedCount++;
          if (loadedCount >= images.length) {
            // Add items to masonry and layout
            this.masonry.appended(newItems);
            this.masonry.layout();
          }
        };

        if (images.length === 0) {
          this.masonry.appended(newItems);
          this.masonry.layout();
          return;
        }

        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener("load", checkComplete);
            img.addEventListener("error", checkComplete);
          }
        });
      } catch (error) {
        console.error("Failed to add items to masonry:", error);
      }
    },

    // Relayout masonry (useful after content changes)
    relayout() {
      if (this.isInitialized && this.masonry) {
        this.masonry.layout();
      }
    },

    // Destroy masonry instance
    destroyMasonry() {
      if (this.masonry) {
        this.masonry.destroy();
        this.masonry = null;
        this.isInitialized = false;
      }
    },

    // Cleanup on component destroy
    destroy() {
      this.destroyMasonry();

      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
    },

    // Get loading progress percentage
    get loadingProgress() {
      if (this.totalImages === 0) return 100;
      return Math.round((this.loadedImages / this.totalImages) * 100);
    },

    // Check if loading is complete
    get isLoadingComplete() {
      return !this.isLoading && this.loadedImages >= this.totalImages;
    },
  }));
});

/**
 * Global masonry utilities
 */
window.MasonryUtils = {
  // Reinitialize all masonry grids on the page
  reinitializeAll() {
    const grids = document.querySelectorAll("[x-data*='masonryGrid']");
    grids.forEach((grid) => {
      const component = Alpine.$data(grid);
      if (component && typeof component.setupMasonry === "function") {
        component.setupMasonry();
      }
    });
  },

  // Add items to a specific masonry grid
  addItemsToGrid(gridElement, newItems) {
    const component = Alpine.$data(gridElement);
    if (component && typeof component.addItems === "function") {
      component.addItems(newItems);
    }
  },

  // Relayout all masonry grids
  relayoutAll() {
    const grids = document.querySelectorAll("[x-data*='masonryGrid']");
    grids.forEach((grid) => {
      const component = Alpine.$data(grid);
      if (component && typeof component.relayout === "function") {
        component.relayout();
      }
    });
  },
};

/**
 * Auto-initialize masonry on DOM ready for any existing grids
 */
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure Alpine.js is fully initialized
  setTimeout(() => {
    window.MasonryUtils.reinitializeAll();
  }, 100);
});

//# sourceMappingURL=masonry.js.map
