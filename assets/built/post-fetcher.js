/**
 * Enhanced Post Fetching Service for Ghost
 * Handles API calls with filtering, sorting, pagination, and caching
 */

class PostFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Fetch posts with advanced filtering and sorting
   * @param {Object} options - Fetch options
   * @param {string} options.category - Category filter (wildlife, landscape, etc.)
   * @param {string} options.sort - Sort option (newest, oldest, alphabetical, etc.)
   * @param {number} options.year - Year filter
   * @param {boolean} options.featured - Featured posts only
   * @param {number} options.page - Page number for pagination
   * @param {number} options.limit - Posts per page
   * @param {boolean} options.useCache - Whether to use cached results
   * @returns {Promise<Object>} - Posts data with pagination info
   */
  async fetchPosts(options = {}) {
    const {
      category = null,
      sort = "newest",
      year = null,
      featured = false,
      page = 1,
      limit = 12,
      useCache = true,
    } = options;

    // Generate cache key
    const cacheKey = this.generateCacheKey(options);

    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      // Remove expired cache entry
      this.cache.delete(cacheKey);
    }

    try {
      // Build Ghost API URL
      const apiUrl = this.buildApiUrl(options);

      // Fetch with retry logic
      const response = await this.fetchWithRetry(apiUrl);
      const data = await response.json();

      // Process and enhance the data
      const processedData = this.processPostData(data, options);

      // Cache the result
      if (useCache) {
        this.cache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now(),
        });
      }

      return processedData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new PostFetchError(
        `Failed to fetch posts: ${error.message}`,
        error
      );
    }
  }

  /**
   * Build Ghost API URL with filters and parameters
   * @private
   */
  buildApiUrl(options) {
    const { category, sort, year, featured, page, limit } = options;

    // Base API endpoint
    let url = "/ghost/api/v3/content/posts/";
    const params = new URLSearchParams();

    // Build filter string
    const filters = ["tag:hash-portfolio"];

    if (category) {
      filters.push(`tag:${category}`);
    }

    if (featured) {
      filters.push("featured:true");
    }

    if (year) {
      filters.push(`published_at:>='${year}-01-01'`);
      filters.push(`published_at:<'${parseInt(year) + 1}-01-01'`);
    }

    // Add filter parameter
    if (filters.length > 0) {
      params.set("filter", filters.join("+"));
    }

    // Add sorting
    const sortOrder = this.getSortOrder(sort);
    if (sortOrder) {
      params.set("order", sortOrder);
    }

    // Add pagination
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    // Include additional fields
    params.set("include", "tags,authors");
    params.set(
      "fields",
      "id,title,excerpt,feature_image,published_at,url,featured,primary_tag"
    );

    return url + "?" + params.toString();
  }

  /**
   * Convert sort option to Ghost API order parameter
   * @private
   */
  getSortOrder(sort) {
    const sortMap = {
      newest: "published_at desc",
      oldest: "published_at asc",
      alphabetical: "title asc",
      "reverse-alphabetical": "title desc",
      featured: "featured desc,published_at desc",
    };

    return sortMap[sort] || sortMap["newest"];
  }

  /**
   * Process and enhance post data
   * @private
   */
  processPostData(data, options) {
    if (!data.posts) {
      throw new Error("Invalid response format from Ghost API");
    }

    // Enhance posts with additional computed properties
    const enhancedPosts = data.posts.map((post) => ({
      ...post,
      // Add formatted date
      formattedDate: this.formatDate(post.published_at),
      // Add year for filtering
      year: new Date(post.published_at).getFullYear(),
      // Add optimized image URLs
      optimizedImages: this.generateOptimizedImages(post.feature_image),
      // Add category info
      categoryInfo: this.extractCategoryInfo(post),
    }));

    return {
      posts: enhancedPosts,
      pagination: {
        ...data.meta.pagination,
        hasNext: data.meta.pagination.next !== null,
        hasPrev: data.meta.pagination.prev !== null,
        nextUrl: data.meta.pagination.next,
        prevUrl: data.meta.pagination.prev,
      },
      totalCount: data.meta.pagination.total,
      currentPage: data.meta.pagination.page,
      totalPages: data.meta.pagination.pages,
    };
  }

  /**
   * Generate optimized image URLs for different screen sizes
   * @private
   */
  generateOptimizedImages(featureImage) {
    if (!featureImage) return null;

    const sizes = {
      thumb: 300,
      small: 600,
      medium: 1000,
      large: 1600,
      xlarge: 2400,
    };

    const optimized = {};

    for (const [size, width] of Object.entries(sizes)) {
      optimized[size] = this.getOptimizedImageUrl(featureImage, width);
    }

    // Generate srcset for responsive images
    optimized.srcset = [
      `${optimized.small} 600w`,
      `${optimized.medium} 1000w`,
      `${optimized.large} 1600w`,
      `${optimized.xlarge} 2400w`,
    ].join(", ");

    return optimized;
  }

  /**
   * Get optimized image URL for specific width
   * @private
   */
  getOptimizedImageUrl(imageUrl, width) {
    if (!imageUrl) return "";

    // Handle Ghost's image transformation
    if (imageUrl.includes("/content/images/")) {
      return imageUrl.replace(
        "/content/images/",
        `/content/images/size/w${width}/`
      );
    }

    // Handle external images
    try {
      const url = new URL(imageUrl);
      const allowedDomains = ["unsplash.com"];
      if (allowedDomains.includes(url.hostname)) {
        url.searchParams.set("w", width.toString());
        url.searchParams.set("q", "80");
        return url.toString();
      }
    } catch (e) {
      // Invalid URL, return original
    }

    return imageUrl;
  }

  /**
   * Extract category information from post
   * @private
   */
  extractCategoryInfo(post) {
    const portfolioTags = ["wildlife", "landscape", "underwater", "cityscape"];
    const categoryTag = post.tags?.find((tag) =>
      portfolioTags.includes(tag.slug)
    );

    return {
      category: categoryTag?.slug || "other",
      categoryName: categoryTag?.name || "Portfolio",
      categoryColor: this.getCategoryColor(categoryTag?.slug),
    };
  }

  /**
   * Get theme color for category
   * @private
   */
  getCategoryColor(category) {
    const colors = {
      wildlife: "green",
      landscape: "blue",
      underwater: "teal",
      cityscape: "slate",
    };

    return colors[category] || "gray";
  }

  /**
   * Format date for display
   * @private
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Generate cache key from options
   * @private
   */
  generateCacheKey(options) {
    const keyParts = [
      options.category || "all",
      options.sort || "newest",
      options.year || "all",
      options.featured ? "featured" : "all",
      options.page || 1,
      options.limit || 12,
    ];

    return keyParts.join("-");
  }

  /**
   * Fetch with retry logic
   * @private
   */
  async fetchWithRetry(url, attempt = 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Cache-Control": "max-age=300", // 5 minutes cache
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (attempt < this.retryAttempts) {
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Preload next page for improved UX
   */
  async preloadNextPage(currentOptions) {
    const nextPageOptions = {
      ...currentOptions,
      page: (currentOptions.page || 1) + 1,
    };

    try {
      await this.fetchPosts(nextPageOptions);
    } catch (error) {
      // Silently handle preload errors
      console.warn("Failed to preload next page:", error);
    }
  }

  /**
   * Clear cache (useful for forced refresh)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Custom error class for post fetching errors
 */
class PostFetchError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "PostFetchError";
    this.originalError = originalError;
  }
}

// Create global instance
window.postFetcher = new PostFetcher();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PostFetcher, PostFetchError };
}

//# sourceMappingURL=post-fetcher.js.map
