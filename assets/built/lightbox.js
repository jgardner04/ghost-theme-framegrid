/**
 * Enhanced Lightbox Component for FrameGrid Ghost Theme
 * Implements advanced navigation with looping, keyboard shortcuts, and accessibility
 */

// Enhanced navigation with looping support
function enhanceLightboxNavigation() {
  // Wait for Alpine.js to be available
  document.addEventListener("alpine:init", () => {
    // Store reference to the original portfolioGrid component
    const originalPortfolioGrid = Alpine._x_dataStack;

    // Enhance the existing Alpine.js component
    Alpine.data("portfolioGrid", () => ({
      lightboxOpen: false,
      currentIndex: 0,
      loading: false,
      imageLoading: false,
      imageError: false,
      posts: [],
      currentPost: null,
      imageCache: new Map(),

      init() {
        // Initialize posts data from server-side rendered content
        // This will be populated by the Handlebars template
        this.posts = window.portfolioPosts || [];

        // Preload first few images for better UX
        this.preloadInitialImages();

        // Add enhanced keyboard event listeners
        this.setupKeyboardNavigation();
      },

      initMasonry() {
        // Initialize masonry layout
        this.$nextTick(() => {
          this.updateMasonryLayout();
        });
      },

      updateMasonryLayout() {
        // CSS Grid handles the masonry layout automatically
        // This method can be extended for more complex masonry logic
      },

      openLightbox(index) {
        this.currentIndex = index;
        this.currentPost = this.posts[index];
        this.lightboxOpen = true;
        this.imageLoading = true;
        this.imageError = false;

        // Add body class to prevent scrolling
        document.body.classList.add("lightbox-open");

        // Focus management for accessibility
        this.$nextTick(() => {
          const closeButton = document.querySelector(".lightbox-close");
          if (closeButton) closeButton.focus();
        });

        // Preload adjacent images for smooth navigation
        this.preloadAdjacentImages(index);
      },

      closeLightbox() {
        this.lightboxOpen = false;
        this.imageLoading = false;
        this.imageError = false;
        document.body.classList.remove("lightbox-open");
      },

      // Enhanced navigation with looping support
      nextImage() {
        if (!this.imageLoading && this.posts.length > 0) {
          // Implement looping: if at last image, go to first
          const nextIndex =
            this.currentIndex >= this.posts.length - 1
              ? 0
              : this.currentIndex + 1;
          this.navigateToImage(nextIndex);
        }
      },

      previousImage() {
        if (!this.imageLoading && this.posts.length > 0) {
          // Implement looping: if at first image, go to last
          const prevIndex =
            this.currentIndex <= 0
              ? this.posts.length - 1
              : this.currentIndex - 1;
          this.navigateToImage(prevIndex);
        }
      },

      // New navigation methods for keyboard shortcuts
      goToFirstImage() {
        if (!this.imageLoading && this.posts.length > 0) {
          this.navigateToImage(0);
        }
      },

      goToLastImage() {
        if (!this.imageLoading && this.posts.length > 0) {
          this.navigateToImage(this.posts.length - 1);
        }
      },

      handleEnterKey(event) {
        // Handle Enter key on focused navigation buttons
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains("lightbox-nav")) {
          event.preventDefault();
          activeElement.click();
        }
      },

      setupKeyboardNavigation() {
        // Enhanced keyboard navigation with debouncing
        let keyboardDebounce = null;

        document.addEventListener("keydown", (event) => {
          if (!this.lightboxOpen) return;

          // Clear existing debounce
          if (keyboardDebounce) {
            clearTimeout(keyboardDebounce);
          }

          // Debounce rapid key presses
          keyboardDebounce = setTimeout(() => {
            switch (event.key) {
              case "ArrowLeft":
                event.preventDefault();
                this.previousImage();
                break;

              case "ArrowRight":
                event.preventDefault();
                this.nextImage();
                break;

              case "Escape":
                event.preventDefault();
                this.closeLightbox();
                break;

              case " ": // Space bar
                event.preventDefault();
                this.nextImage();
                break;

              case "Home":
                event.preventDefault();
                this.goToFirstImage();
                break;

              case "End":
                event.preventDefault();
                this.goToLastImage();
                break;

              case "Enter":
                this.handleEnterKey(event);
                break;
            }
          }, 50); // 50ms debounce
        });
      },

      navigateToImage(index) {
        this.currentIndex = index;
        this.currentPost = this.posts[index];
        this.imageLoading = true;
        this.imageError = false;

        // Preload adjacent images with circular logic
        this.preloadAdjacentImages(index);
      },

      handleImageLoad() {
        this.imageLoading = false;
        this.imageError = false;
      },

      handleImageError() {
        this.imageLoading = false;
        this.imageError = true;
      },

      getLightboxImageUrl(post) {
        if (!post?.feature_image) return "";

        // Use appropriate size based on screen size and pixel ratio
        const isMobile = window.innerWidth <= 768;
        const isHighDPI = window.devicePixelRatio > 1;

        // Choose optimal size
        let size = "xl"; // 2400px default
        if (isMobile && !isHighDPI) {
          size = "l"; // 1600px for mobile
        } else if (isMobile && isHighDPI) {
          size = "xl"; // 2400px for high-DPI mobile
        }

        // Ghost img_url helper equivalent for client-side
        return this.getGhostImageUrl(post.feature_image, size);
      },

      getLightboxImageSrcset(post) {
        if (!post?.feature_image) return "";

        // Generate responsive srcset for optimal loading
        const baseUrl = post.feature_image;
        return [
          `${this.getGhostImageUrl(baseUrl, "l")} 1600w`,
          `${this.getGhostImageUrl(baseUrl, "xl")} 2400w`,
        ].join(", ");
      },

      getGhostImageUrl(imageUrl, size) {
        if (!imageUrl) return "";

        // Size mappings from package.json config
        const sizes = {
          xs: 300,
          s: 600,
          m: 1000,
          l: 1600,
          xl: 2400,
        };

        const width = sizes[size] || sizes["xl"];

        // Handle Ghost's image transformation URL pattern
        if (imageUrl.includes("/content/images/")) {
          // For local Ghost installations
          return imageUrl.replace(
            "/content/images/",
            `/content/images/size/w${width}/`
          );
        } else if (
          imageUrl.includes("images.unsplash.com") ||
          imageUrl.includes("cdn.")
        ) {
          // For external images, append size parameter
          const separator = imageUrl.includes("?") ? "&" : "?";
          return `${imageUrl}${separator}w=${width}`;
        }

        // Fallback: return original URL
        return imageUrl;
      },

      preloadInitialImages() {
        // Preload first 3 images for better initial experience
        const imagesToPreload = this.posts.slice(0, 3);
        imagesToPreload.forEach((post) => {
          if (post.feature_image) {
            this.preloadImage(post);
          }
        });
      },

      preloadAdjacentImages(currentIndex) {
        // Enhanced preloading with circular navigation support
        const totalPosts = this.posts.length;
        if (totalPosts <= 1) return;

        // Calculate adjacent indices with circular logic
        const prevIndex = currentIndex <= 0 ? totalPosts - 1 : currentIndex - 1;
        const nextIndex = currentIndex >= totalPosts - 1 ? 0 : currentIndex + 1;

        // Preload previous and next images with circular logic
        [prevIndex, nextIndex].forEach((index) => {
          const post = this.posts[index];
          if (post?.feature_image) {
            this.preloadImage(post);
          }
        });

        // Also preload one more in each direction for smoother navigation
        if (totalPosts > 3) {
          const prevPrevIndex = prevIndex <= 0 ? totalPosts - 1 : prevIndex - 1;
          const nextNextIndex = nextIndex >= totalPosts - 1 ? 0 : nextIndex + 1;

          [prevPrevIndex, nextNextIndex].forEach((index) => {
            const post = this.posts[index];
            if (post?.feature_image) {
              this.preloadImage(post);
            }
          });
        }
      },

      preloadImage(post) {
        const imageUrl = this.getLightboxImageUrl(post);
        if (imageUrl && !this.imageCache.has(imageUrl)) {
          const img = new Image();
          img.onload = () => {
            this.imageCache.set(imageUrl, true);
          };
          img.onerror = () => {
            this.imageCache.set(imageUrl, false);
          };
          img.src = imageUrl;
        }
      },

      async loadMore() {
        if (this.loading) return;

        this.loading = true;
        try {
          // This will be handled by the template's pagination
          // Implementation depends on Ghost's Content API setup
          console.log("Load more functionality available in template");
        } catch (error) {
          console.error("Error loading more posts:", error);
        } finally {
          this.loading = false;
        }
      },
    }));
  });
}

// Initialize enhanced navigation when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceLightboxNavigation);
} else {
  enhanceLightboxNavigation();
}

//# sourceMappingURL=lightbox.js.map
