/**
 * Enhanced Lightbox Component for FrameGrid Ghost Theme
 * Implements advanced navigation with looping, keyboard shortcuts, and accessibility
 * WCAG 2.1 AA Compliant with comprehensive focus management and screen reader support
 */

// Enhanced navigation with accessibility and focus trapping
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
      imageCache: {},
      screenReaderAnnouncement: "",
      lastFocusedElement: null,
      focusableElements: [],
      currentFocusIndex: 0,
      keyboardDebounceTimer: null,

      init() {
        // Initialize posts data from server-side rendered content
        // This will be populated by the Handlebars template
        this.posts = window.portfolioPosts || [];

        // Preload first few images for better UX
        this.preloadInitialImages();

        // Add enhanced keyboard event listeners
        this.setupKeyboardNavigation();

        // Set up focus management
        this.setupFocusManagement();
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
        // Store the currently focused element for restoration later
        this.lastFocusedElement = document.activeElement;

        this.currentIndex = index;
        this.currentPost = this.posts[index];
        this.lightboxOpen = true;
        this.imageLoading = true;
        this.imageError = false;

        // Add body class to prevent scrolling and hide background content
        document.body.classList.add("lightbox-open");
        this.setBackgroundInert(true);

        // Announce to screen readers
        this.announceToScreenReader(
          `Opening image viewer. Image ${index + 1} of ${this.posts.length}: ${
            this.currentPost?.title || "Portfolio image"
          }. Use arrow keys to navigate, Tab to move between controls, Escape to close.`
        );

        // Focus management for accessibility
        this.$nextTick(() => {
          this.setupFocusTrap();
          const closeButton = this.$refs.closeButton;
          if (closeButton) {
            closeButton.focus();
            this.announceToScreenReader(
              `Image viewer opened. Currently viewing ${
                this.currentPost?.title || `image ${index + 1}`
              }. ${index + 1} of ${this.posts.length} images.`
            );
          }
        });

        // Preload adjacent images for smooth navigation
        this.preloadAdjacentImages(index);
      },

      closeLightbox() {
        this.lightboxOpen = false;
        this.imageLoading = false;
        this.imageError = false;
        this.screenReaderAnnouncement = "";
        document.body.classList.remove("lightbox-open");

        // Restore background content
        this.setBackgroundInert(false);

        // Announce closure to screen readers
        this.announceToScreenReader(
          "Image viewer closed. Returned to gallery."
        );

        // Restore focus to the previously focused element
        this.$nextTick(() => {
          if (
            this.lastFocusedElement &&
            typeof this.lastFocusedElement.focus === "function"
          ) {
            this.lastFocusedElement.focus();
            this.announceToScreenReader(
              `Returned focus to ${
                this.lastFocusedElement.getAttribute("aria-label") ||
                "gallery item"
              }.`
            );
          }
          this.lastFocusedElement = null;
        });
      },

      // Enhanced navigation methods with accessibility announcements
      navigateToImage(direction) {
        if (this.imageLoading || this.posts.length === 0) return;

        let newIndex;
        let announcement = "";

        switch (direction) {
          case "next":
            newIndex =
              this.currentIndex >= this.posts.length - 1
                ? 0
                : this.currentIndex + 1;
            announcement =
              newIndex === 0
                ? "Reached end of gallery, showing first image"
                : "Next image";
            break;
          case "previous":
            newIndex =
              this.currentIndex <= 0
                ? this.posts.length - 1
                : this.currentIndex - 1;
            announcement =
              newIndex === this.posts.length - 1
                ? "Reached beginning of gallery, showing last image"
                : "Previous image";
            break;
          case "first":
            newIndex = 0;
            announcement = "First image";
            break;
          case "last":
            newIndex = this.posts.length - 1;
            announcement = "Last image";
            break;
          default:
            return;
        }

        this.currentIndex = newIndex;
        this.currentPost = this.posts[newIndex];
        this.imageLoading = true;
        this.imageError = false;

        // Comprehensive screen reader announcement
        const fullAnnouncement = `${announcement}: ${
          this.currentPost?.title || `Image ${newIndex + 1}`
        }. ${newIndex + 1} of ${this.posts.length}. ${
          this.currentPost?.excerpt
            ? this.currentPost.excerpt.substring(0, 100)
            : ""
        }`;

        this.announceToScreenReader(fullAnnouncement);

        // Preload adjacent images with circular logic
        this.preloadAdjacentImages(newIndex);
      },

      // Helper methods for ARIA labels
      getPreviousImageIndex() {
        return this.currentIndex <= 0
          ? this.posts.length - 1
          : this.currentIndex - 1;
      },

      getNextImageIndex() {
        return this.currentIndex >= this.posts.length - 1
          ? 0
          : this.currentIndex + 1;
      },

      getPreviousImageTitle() {
        const prevIndex = this.getPreviousImageIndex();
        return this.posts[prevIndex]?.title || `Image ${prevIndex + 1}`;
      },

      getNextImageTitle() {
        const nextIndex = this.getNextImageIndex();
        return this.posts[nextIndex]?.title || `Image ${nextIndex + 1}`;
      },

      // Enhanced keyboard navigation handlers with debouncing
      handleNavigationKey(direction, event) {
        if (!this.lightboxOpen) return;
        event.preventDefault();

        // Clear existing timer
        if (this.keyboardDebounceTimer) {
          clearTimeout(this.keyboardDebounceTimer);
        }

        // Debounce rapid key presses
        this.keyboardDebounceTimer = setTimeout(() => {
          this.navigateToImage(direction);
        }, 50);
      },

      handleEscapeKey(event) {
        if (this.lightboxOpen) {
          event.preventDefault();
          this.closeLightbox();
        }
      },

      handleTabKey(event) {
        if (!this.lightboxOpen) return;
        event.preventDefault();

        this.updateFocusableElements();
        if (this.focusableElements.length === 0) return;

        this.currentFocusIndex =
          (this.currentFocusIndex + 1) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex].focus();

        // Announce what element is now focused
        const focusedElement = this.focusableElements[this.currentFocusIndex];
        const ariaLabel =
          focusedElement.getAttribute("aria-label") ||
          focusedElement.textContent ||
          focusedElement.tagName.toLowerCase();
        this.announceToScreenReader(`Focused on ${ariaLabel}`);
      },

      handleShiftTabKey(event) {
        if (!this.lightboxOpen) return;
        event.preventDefault();

        this.updateFocusableElements();
        if (this.focusableElements.length === 0) return;

        this.currentFocusIndex =
          this.currentFocusIndex <= 0
            ? this.focusableElements.length - 1
            : this.currentFocusIndex - 1;
        this.focusableElements[this.currentFocusIndex].focus();

        // Announce what element is now focused
        const focusedElement = this.focusableElements[this.currentFocusIndex];
        const ariaLabel =
          focusedElement.getAttribute("aria-label") ||
          focusedElement.textContent ||
          focusedElement.tagName.toLowerCase();
        this.announceToScreenReader(`Focused on ${ariaLabel}`);
      },

      setupFocusTrap() {
        this.updateFocusableElements();
        this.currentFocusIndex = 0;

        // Set up proper ARIA attributes for focus trapping
        const modal = this.$refs.lightboxModal;
        if (modal) {
          modal.setAttribute("data-focus-trapped", "true");
          modal.setAttribute("aria-hidden", "false");
        }
      },

      updateFocusableElements() {
        const modal = this.$refs.lightboxModal;
        if (!modal) return;

        // Get all focusable elements within the lightbox
        const focusableSelectors = [
          "button:not([disabled])",
          "a[href]",
          '[tabindex="0"]',
          '[role="button"]:not([aria-disabled="true"])',
        ].join(", ");

        this.focusableElements = Array.from(
          modal.querySelectorAll(focusableSelectors)
        ).filter((el) => {
          // Only include visible elements
          const style = window.getComputedStyle(el);
          return (
            (style.display !== "none" &&
              style.visibility !== "hidden" &&
              !el.hasAttribute("aria-hidden")) ||
            el.getAttribute("aria-hidden") === "false"
          );
        });

        // Update current focus index based on currently focused element
        const currentlyFocused = document.activeElement;
        const focusIndex = this.focusableElements.indexOf(currentlyFocused);
        if (focusIndex >= 0) {
          this.currentFocusIndex = focusIndex;
        }
      },

      trapFocus() {
        this.setupFocusTrap();
      },

      setupKeyboardNavigation() {
        // Enhanced keyboard navigation with comprehensive accessibility
        document.addEventListener(
          "keydown",
          (event) => {
            if (!this.lightboxOpen) return;

            switch (event.key) {
              case "ArrowLeft":
                event.preventDefault();
                this.handleNavigationKey("previous", event);
                break;
              case "ArrowRight":
                event.preventDefault();
                this.handleNavigationKey("next", event);
                break;
              case " ":
                // Space bar navigation only if not focused on a button
                if (!event.target.matches('button, [role="button"], a')) {
                  event.preventDefault();
                  this.handleNavigationKey("next", event);
                }
                break;
              case "Home":
                event.preventDefault();
                this.handleNavigationKey("first", event);
                break;
              case "End":
                event.preventDefault();
                this.handleNavigationKey("last", event);
                break;
              case "Escape":
                this.handleEscapeKey(event);
                break;
              case "Tab":
                if (event.shiftKey) {
                  this.handleShiftTabKey(event);
                } else {
                  this.handleTabKey(event);
                }
                break;
              case "Enter":
                // Handle Enter key on focused elements
                if (
                  event.target.matches(
                    ".lightbox-nav, .lightbox-close, .error-retry-btn, .lightbox-tag"
                  )
                ) {
                  event.preventDefault();
                  event.target.click();
                }
                break;
            }
          },
          true
        );
      },

      setupFocusManagement() {
        // Set up focus event listeners for better accessibility
        document.addEventListener("focusin", (event) => {
          if (!this.lightboxOpen) return;

          // Ensure focus stays within the lightbox
          const modal = this.$refs.lightboxModal;
          if (modal && !modal.contains(event.target)) {
            event.preventDefault();
            this.updateFocusableElements();
            if (this.focusableElements.length > 0) {
              this.focusableElements[0].focus();
            }
          }
        });
      },

      setBackgroundInert(inert) {
        // Set background content as inert to prevent interaction
        const mainContent = document.querySelector(
          "main, .site-main, body > div:not(.lightbox-modal)"
        );
        if (mainContent) {
          if (inert) {
            mainContent.setAttribute("aria-hidden", "true");
            mainContent.setAttribute("inert", "");
            // Disable all interactive elements in background
            const interactiveElements = mainContent.querySelectorAll(
              "button, a, input, select, textarea, [tabindex]"
            );
            interactiveElements.forEach((el) => {
              el.setAttribute("tabindex", "-1");
              el.classList.add("inert-background");
            });
          } else {
            mainContent.removeAttribute("aria-hidden");
            mainContent.removeAttribute("inert");
            // Re-enable interactive elements
            const interactiveElements =
              mainContent.querySelectorAll(".inert-background");
            interactiveElements.forEach((el) => {
              el.removeAttribute("tabindex");
              el.classList.remove("inert-background");
            });
          }
        }
      },

      handleImageLoad() {
        this.imageLoading = false;
        this.imageError = false;

        // Announce successful image load
        this.announceToScreenReader(
          `Image loaded successfully. ${
            this.currentPost?.title || `Image ${this.currentIndex + 1}`
          }. ${
            this.currentPost?.excerpt
              ? this.currentPost.excerpt.substring(0, 80) + "..."
              : ""
          }`
        );
      },

      handleImageError() {
        this.imageLoading = false;
        this.imageError = true;

        // Announce image loading error
        this.announceToScreenReader(
          `Error loading image: ${
            this.currentPost?.title || `Image ${this.currentIndex + 1}`
          }. Please try again or use navigation to view other images.`
        );
      },

      retryImageLoad() {
        this.imageError = false;
        this.imageLoading = true;

        this.announceToScreenReader("Retrying image load...");

        // Force reload the image
        const img = this.$refs.lightboxModal?.querySelector(".lightbox-image");
        if (img) {
          const src = img.src;
          img.src = "";
          setTimeout(() => {
            img.src = src;
          }, 100);
        }
      },

      // Enhanced screen reader announcements with live regions
      announceToScreenReader(message) {
        this.screenReaderAnnouncement = message;

        // Also update the live region directly for immediate announcement
        const liveRegion = document.getElementById("lightbox-announcements");
        if (liveRegion) {
          liveRegion.textContent = message;

          // Clear after a delay to allow for multiple announcements
          setTimeout(() => {
            if (liveRegion.textContent === message) {
              liveRegion.textContent = "";
            }
          }, 1000);
        }
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
          (() => {
            try {
              const urlHost = new URL(imageUrl).host;
              const allowedHosts = ["images.unsplash.com", "cdn.example.com"];
              return allowedHosts.includes(urlHost);
            } catch (e) {
              return false; // Invalid URL
            }
          })()
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
        // Enhanced circular preloading - preload 2 images in each direction
        const totalPosts = this.posts.length;
        if (totalPosts <= 1) return;

        const indicesToPreload = [];

        // Calculate indices to preload (2 before, 2 after current)
        for (let i = -2; i <= 2; i++) {
          if (i === 0) continue; // Skip current image

          let index = currentIndex + i;
          // Handle circular logic
          if (index < 0) {
            index = totalPosts + index;
          } else if (index >= totalPosts) {
            index = index - totalPosts;
          }

          indicesToPreload.push(index);
        }

        // Preload calculated images
        indicesToPreload.forEach((index) => {
          const post = this.posts[index];
          if (post?.feature_image) {
            this.preloadImage(post);
          }
        });
      },

      preloadImage(post) {
        const imageUrl = this.getLightboxImageUrl(post);
        if (imageUrl && !this.imageCache[imageUrl]) {
          const img = new Image();
          img.onload = () => {
            this.imageCache[imageUrl] = true;
          };
          img.onerror = () => {
            this.imageCache[imageUrl] = false;
          };
          img.src = imageUrl;
        }
      },

      async loadMore() {
        if (this.loading) return;

        this.loading = true;
        this.announceToScreenReader("Loading more images...");

        try {
          // Check if fetch is supported (IE11+ support)
          if (typeof fetch === "undefined") {
            throw new Error("Fetch API not supported");
          }

          // Implement infinite scroll loading with Ghost Content API
          const nextPage = "{{pagination.next}}";
          if (nextPage) {
            const response = await fetch(`${nextPage}?formats=html,json`);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Add new posts to the array and update the grid
            if (data.posts) {
              const newPosts = data.posts.map((post) => ({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                url: post.url,
                feature_image: post.feature_image,
                date: new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                primary_tag: post.primary_tag?.name || "",
              }));

              this.posts.push(...newPosts);
              this.announceToScreenReader(
                `Loaded ${newPosts.length} more images. Total: ${this.posts.length} images.`
              );

              // Preload some of the new images
              this.preloadNewImages(newPosts.slice(0, 2));
            }
          }
        } catch (error) {
          console.error("Error loading more posts:", error);
          this.announceToScreenReader(
            "Error loading more images. Please try again."
          );
        } finally {
          this.loading = false;
        }
      },

      preloadNewImages(newPosts) {
        newPosts.forEach((post) => {
          if (post.feature_image) {
            this.preloadImage(post);
          }
        });
      },
    }));
  });
}

// Initialize the enhanced lightbox navigation
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceLightboxNavigation);
} else {
  enhanceLightboxNavigation();
}
