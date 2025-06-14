//! FrameGrid Ghost Theme - Member Authentication System
//! Uses Alpine.js with Ghost's native Members API and Portal system
//! Follows Ghost 5.0+ best practices for member authentication

document.addEventListener("alpine:init", () => {
  // Main member authentication Alpine.js component
  Alpine.data("memberAuth", () => ({
    // Member state
    isAuthenticated: false,
    currentMember: null,
    memberTier: null,
    memberSubscriptions: [],

    // UI state
    showSignIn: false,
    showSignUp: false,
    showAccount: false,
    isLoading: false,
    errorMessage: "",
    successMessage: "",

    // Form data
    signInForm: {
      email: "",
      password: "",
    },
    signUpForm: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },

    // Component initialization
    init() {
      this.checkMemberStatus();
      this.setupGhostPortalEvents();

      // Listen for Ghost portal events
      window.addEventListener("portal-ready", () => {
        this.checkMemberStatus();
      });
    },

    // Check current member authentication status
    checkMemberStatus() {
      // Use Ghost's global member object if available
      if (window.ghost && window.ghost.member) {
        this.isAuthenticated = true;
        this.currentMember = window.ghost.member;
        this.memberTier = this.getCurrentMemberTier();
        this.memberSubscriptions = window.ghost.member.subscriptions || [];
      } else {
        // Fallback: check if @member is available from Handlebars context
        this.isAuthenticated =
          document.body.classList.contains("member-logged-in");
        if (this.isAuthenticated) {
          this.getMemberData();
        }
      }
    },

    // Get current member tier information
    getCurrentMemberTier() {
      if (!this.currentMember || !this.currentMember.subscriptions)
        return "free";

      const activeSubscriptions = this.currentMember.subscriptions.filter(
        (sub) => sub.status === "active"
      );
      if (activeSubscriptions.length === 0) return "free";

      // Return the highest tier subscription
      const tiers = activeSubscriptions.map((sub) => sub.tier?.name || "paid");
      if (tiers.includes("premium")) return "premium";
      if (tiers.includes("workshop")) return "workshop";
      return "paid";
    },

    // Setup Ghost portal event listeners
    setupGhostPortalEvents() {
      // Listen for portal events from Ghost
      window.addEventListener("portal-ready", (event) => {
        console.log("Ghost Portal ready:", event.detail);
      });

      window.addEventListener("portal-signin", (event) => {
        this.handleSignInSuccess(event.detail);
      });

      window.addEventListener("portal-signup", (event) => {
        this.handleSignUpSuccess(event.detail);
      });

      window.addEventListener("portal-signout", () => {
        this.handleSignOut();
      });
    },

    // Sign in using Ghost's portal system
    async signIn() {
      if (!this.validateSignInForm()) return;

      this.isLoading = true;
      this.errorMessage = "";

      try {
        // Use Ghost's portal for authentication
        if (window.ghost && window.ghost.portal) {
          await window.ghost.portal.signin({
            email: this.signInForm.email,
            password: this.signInForm.password,
          });
        } else {
          // Fallback: trigger Ghost portal manually
          this.triggerGhostPortal("signin", {
            email: this.signInForm.email,
          });
        }
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
        console.error("Sign in error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Sign up using Ghost's portal system
    async signUp() {
      if (!this.validateSignUpForm()) return;

      this.isLoading = true;
      this.errorMessage = "";

      try {
        // Use Ghost's portal for registration
        if (window.ghost && window.ghost.portal) {
          await window.ghost.portal.signup({
            email: this.signUpForm.email,
            name: this.signUpForm.name,
            password: this.signUpForm.password,
          });
        } else {
          // Fallback: trigger Ghost portal manually
          this.triggerGhostPortal("signup", {
            email: this.signUpForm.email,
            name: this.signUpForm.name,
          });
        }
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
        console.error("Sign up error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Sign out
    async signOut() {
      this.isLoading = true;

      try {
        if (window.ghost && window.ghost.portal) {
          await window.ghost.portal.signout();
        } else {
          // Fallback: redirect to Ghost's signout endpoint
          window.location.href = `${window.location.origin}/members/signout/`;
        }
      } catch (error) {
        console.error("Sign out error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Trigger Ghost portal manually (fallback method)
    triggerGhostPortal(action, data = {}) {
      const portalUrl = `#/portal/${action}`;
      const params = new URLSearchParams(data).toString();
      const finalUrl = params ? `${portalUrl}?${params}` : portalUrl;

      // Trigger portal via URL hash
      window.location.hash = finalUrl;

      // Also try direct portal trigger if available
      if (window.portal) {
        window.portal.open(action, data);
      }
    },

    // Form validation
    validateSignInForm() {
      if (!this.signInForm.email || !this.signInForm.password) {
        this.errorMessage = "Please fill in all required fields.";
        return false;
      }

      if (!this.isValidEmail(this.signInForm.email)) {
        this.errorMessage = "Please enter a valid email address.";
        return false;
      }

      return true;
    },

    validateSignUpForm() {
      if (
        !this.signUpForm.email ||
        !this.signUpForm.name ||
        !this.signUpForm.password
      ) {
        this.errorMessage = "Please fill in all required fields.";
        return false;
      }

      if (!this.isValidEmail(this.signUpForm.email)) {
        this.errorMessage = "Please enter a valid email address.";
        return false;
      }

      if (this.signUpForm.password.length < 8) {
        this.errorMessage = "Password must be at least 8 characters long.";
        return false;
      }

      if (this.signUpForm.password !== this.signUpForm.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return false;
      }

      return true;
    },

    // Email validation helper
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Success handlers
    handleSignInSuccess(memberData) {
      this.isAuthenticated = true;
      this.currentMember = memberData;
      this.memberTier = this.getCurrentMemberTier();
      this.closeAllModals();
      this.successMessage =
        "Welcome back! You have been signed in successfully.";
      this.clearForms();

      // Reload page to update member-specific content
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },

    handleSignUpSuccess(memberData) {
      this.isAuthenticated = true;
      this.currentMember = memberData;
      this.memberTier = "free"; // New members start as free
      this.closeAllModals();
      this.successMessage =
        "Account created successfully! Welcome to our community.";
      this.clearForms();

      // Reload page to update member-specific content
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },

    handleSignOut() {
      this.isAuthenticated = false;
      this.currentMember = null;
      this.memberTier = null;
      this.memberSubscriptions = [];
      this.closeAllModals();
      this.successMessage = "You have been signed out successfully.";

      // Reload page to update content
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },

    // UI state management
    openSignIn() {
      this.showSignIn = true;
      this.showSignUp = false;
      this.showAccount = false;
      this.clearMessages();
    },

    openSignUp() {
      this.showSignUp = true;
      this.showSignIn = false;
      this.showAccount = false;
      this.clearMessages();
    },

    openAccount() {
      if (this.isAuthenticated) {
        this.showAccount = true;
        this.showSignIn = false;
        this.showSignUp = false;
        this.clearMessages();
      } else {
        this.triggerGhostPortal("account");
      }
    },

    closeAllModals() {
      this.showSignIn = false;
      this.showSignUp = false;
      this.showAccount = false;
    },

    clearForms() {
      this.signInForm = { email: "", password: "" };
      this.signUpForm = {
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      };
    },

    clearMessages() {
      this.errorMessage = "";
      this.successMessage = "";
    },

    // Helper methods
    getErrorMessage(error) {
      if (typeof error === "string") return error;
      if (error.message) return error.message;
      if (error.errors && error.errors.length > 0) {
        return error.errors[0].message || "An error occurred";
      }
      return "An unexpected error occurred. Please try again.";
    },

    // Member data fetching (fallback when Ghost object not available)
    async getMemberData() {
      try {
        const response = await fetch("/members/api/session/");
        if (response.ok) {
          const data = await response.json();
          this.currentMember = data;
          this.memberTier = this.getCurrentMemberTier();
        }
      } catch (error) {
        console.warn("Could not fetch member data:", error);
      }
    },

    // Access control helpers
    hasAccess(requiredTier) {
      if (!this.isAuthenticated) return false;

      const tierHierarchy = {
        free: 0,
        paid: 1,
        workshop: 2,
        premium: 3,
      };

      const userTierLevel = tierHierarchy[this.memberTier] || 0;
      const requiredTierLevel = tierHierarchy[requiredTier] || 0;

      return userTierLevel >= requiredTierLevel;
    },

    // Member info getters
    get memberName() {
      return this.currentMember?.name || this.currentMember?.email || "Member";
    },

    get memberEmail() {
      return this.currentMember?.email || "";
    },

    get memberAvatar() {
      return this.currentMember?.avatar || null;
    },

    get isFreeMember() {
      return !this.isAuthenticated || this.memberTier === "free";
    },

    get isPaidMember() {
      return (
        this.isAuthenticated &&
        ["paid", "workshop", "premium"].includes(this.memberTier)
      );
    },

    get hasWorkshopAccess() {
      return this.hasAccess("workshop");
    },

    get hasPremiumAccess() {
      return this.hasAccess("premium");
    },
  }));

  // Member portal dashboard component
  Alpine.data("memberPortal", () => ({
    // Portal state
    showPortal: false,
    showAccountSettings: false,
    activeSettingsTab: "profile",

    // Loading states
    isRefreshing: false,
    isUpdatingProfile: false,
    isChangingPassword: false,
    isUpdatingPreferences: false,

    // Messages
    settingsSuccessMessage: "",
    settingsErrorMessage: "",

    // Forms
    profileForm: {
      name: "",
      email: "",
      bio: "",
    },

    passwordForm: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    preferencesForm: {
      emailNewsletter: true,
      emailWorkshops: true,
      emailNewContent: false,
      publicProfile: false,
      activityTracking: true,
    },

    // Stats and activity data
    stats: {
      viewed: 0,
      collections: 0,
      downloads: 0,
      workshops: 0,
    },

    recentActivity: [],

    init() {
      this.loadMemberData();
      this.loadStats();
      this.loadRecentActivity();
    },

    // Get member auth data from main component
    get memberAuth() {
      const memberAuthElement = document.querySelector(
        '[x-data*="memberAuth"]'
      );
      return memberAuthElement?.__x?.$data;
    },

    // Member data getters from auth component
    get memberName() {
      return this.memberAuth?.memberName || "Member";
    },

    get memberEmail() {
      return this.memberAuth?.memberEmail || "";
    },

    get memberAvatar() {
      return this.memberAuth?.memberAvatar;
    },

    get memberInitials() {
      const name = this.memberName;
      if (name === "Member") return "M";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },

    get memberTier() {
      return this.memberAuth?.memberTier || "free";
    },

    get memberTierDisplayName() {
      const tierNames = {
        free: "Free Member",
        paid: "Paid Member",
        workshop: "Workshop Member",
        premium: "Premium Member",
      };
      return tierNames[this.memberTier] || "Member";
    },

    get hasWorkshopAccess() {
      return this.memberAuth?.hasWorkshopAccess || false;
    },

    get hasPremiumAccess() {
      return this.memberAuth?.hasPremiumAccess || false;
    },

    get nextBillingDate() {
      // Mock data - would come from Ghost member API
      return "Dec 15, 2024";
    },

    get memberSince() {
      // Mock data - would come from Ghost member API
      return "Jan 2024";
    },

    // Portal management
    openPortal() {
      this.showPortal = true;
    },

    closePortal() {
      this.showPortal = false;
    },

    openAccountSettings() {
      this.showAccountSettings = true;
      this.loadMemberData();
    },

    closeAccountSettings() {
      this.showAccountSettings = false;
      this.clearSettingsMessages();
    },

    // Data loading
    loadMemberData() {
      if (this.memberAuth) {
        this.profileForm.name = this.memberAuth.memberName;
        this.profileForm.email = this.memberAuth.memberEmail;
        this.profileForm.bio = this.memberAuth.currentMember?.bio || "";
      }
    },

    loadStats() {
      // Mock stats - would be loaded from actual user data
      this.stats = {
        viewed: 1247,
        collections: 12,
        downloads: 45,
        workshops: 3,
      };
    },

    loadRecentActivity() {
      // Mock activity data - would be loaded from actual user activity
      this.recentActivity = [
        {
          id: 1,
          icon: "📸",
          title: 'Viewed "Aurora Borealis Collection"',
          time: "2 hours ago",
          color: "bg-blue-500",
        },
        {
          id: 2,
          icon: "⬇️",
          title: "Downloaded high-res image",
          time: "1 day ago",
          color: "bg-green-500",
        },
        {
          id: 3,
          icon: "🎥",
          title: 'Watched "Northern Lights Workshop"',
          time: "3 days ago",
          color: "bg-purple-500",
        },
      ];
    },

    // Actions
    async refreshMemberData() {
      this.isRefreshing = true;
      try {
        if (this.memberAuth) {
          await this.memberAuth.getMemberData();
          this.loadMemberData();
          this.loadStats();
          this.loadRecentActivity();
        }
      } catch (error) {
        console.error("Failed to refresh member data:", error);
      } finally {
        this.isRefreshing = false;
      }
    },

    async updateProfile() {
      this.isUpdatingProfile = true;
      this.clearSettingsMessages();

      try {
        // Mock profile update - would use Ghost Members API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.settingsSuccessMessage = "Profile updated successfully!";
      } catch (error) {
        this.settingsErrorMessage =
          "Failed to update profile. Please try again.";
      } finally {
        this.isUpdatingProfile = false;
      }
    },

    async changePassword() {
      this.isChangingPassword = true;
      this.clearSettingsMessages();

      try {
        // Validate passwords match
        if (
          this.passwordForm.newPassword !== this.passwordForm.confirmPassword
        ) {
          throw new Error("New passwords do not match");
        }

        // Mock password change - would use Ghost Members API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.settingsSuccessMessage = "Password changed successfully!";
        this.passwordForm = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      } catch (error) {
        this.settingsErrorMessage =
          error.message || "Failed to change password. Please try again.";
      } finally {
        this.isChangingPassword = false;
      }
    },

    async updatePreferences() {
      this.isUpdatingPreferences = true;
      this.clearSettingsMessages();

      try {
        // Mock preferences update - would use Ghost Members API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.settingsSuccessMessage = "Preferences saved successfully!";
      } catch (error) {
        this.settingsErrorMessage =
          "Failed to save preferences. Please try again.";
      } finally {
        this.isUpdatingPreferences = false;
      }
    },

    upgradeToTier(tier) {
      if (window.ghost && window.ghost.portal) {
        window.ghost.portal.open("upgrade");
      } else {
        window.location.hash = "#/portal/upgrade";
      }
    },

    openCustomerPortal() {
      if (window.ghost && window.ghost.portal) {
        window.ghost.portal.open("account");
      } else {
        window.location.hash = "#/portal/account";
      }
    },

    async cancelSubscription() {
      if (
        confirm(
          "Are you sure you want to cancel your subscription? You will lose access to premium content."
        )
      ) {
        // Would trigger Ghost portal cancellation flow
        this.openCustomerPortal();
      }
    },

    clearSettingsMessages() {
      this.settingsSuccessMessage = "";
      this.settingsErrorMessage = "";
    },
  }));

  // Member content gating component
  Alpine.data("memberGate", (requiredTier = "paid") => ({
    requiredTier,
    showContent: false,
    showUpgrade: false,

    init() {
      this.checkAccess();
    },

    checkAccess() {
      // Check if member authentication component is available
      const memberAuth = this.getMemberAuth();
      if (memberAuth) {
        this.showContent = memberAuth.hasAccess(this.requiredTier);
        this.showUpgrade = memberAuth.isAuthenticated && !this.showContent;
      } else {
        // Fallback: check body classes set by Handlebars
        this.showContent = this.checkBodyClasses();
      }
    },

    getMemberAuth() {
      // Try to find the member auth component in the DOM
      const memberAuthElement = document.querySelector(
        '[x-data*="memberAuth"]'
      );
      return memberAuthElement?.__x?.$data;
    },

    checkBodyClasses() {
      // Fallback access check using body classes
      const body = document.body;

      if (!body.classList.contains("member-logged-in")) {
        return false;
      }

      switch (this.requiredTier) {
        case "free":
          return true;
        case "paid":
          return body.classList.contains("member-paid");
        case "workshop":
          return (
            body.classList.contains("member-workshop") ||
            body.classList.contains("member-premium")
          );
        case "premium":
          return body.classList.contains("member-premium");
        default:
          return false;
      }
    },

    requestUpgrade() {
      // Trigger Ghost portal for subscription upgrade
      if (window.ghost && window.ghost.portal) {
        window.ghost.portal.open("upgrade");
      } else {
        window.location.hash = "#/portal/upgrade";
      }
    },
  }));
});

// Global helper functions for Ghost theme integration
window.FrameGridMembers = {
  // Check if current member has access to specific tier
  hasAccess(requiredTier) {
    const memberAuth = document.querySelector('[x-data*="memberAuth"]')?.__x
      ?.$data;
    return memberAuth ? memberAuth.hasAccess(requiredTier) : false;
  },

  // Get current member information
  getCurrentMember() {
    const memberAuth = document.querySelector('[x-data*="memberAuth"]')?.__x
      ?.$data;
    return memberAuth ? memberAuth.currentMember : null;
  },

  // Trigger portal actions programmatically
  openPortal(action = "signin", data = {}) {
    if (window.ghost && window.ghost.portal) {
      window.ghost.portal.open(action, data);
    } else {
      const params = new URLSearchParams(data).toString();
      const finalUrl = params
        ? `#/portal/${action}?${params}`
        : `#/portal/${action}`;
      window.location.hash = finalUrl;
    }
  },
};

// Initialize member authentication when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Add member-specific body classes for CSS targeting
  if (window.ghost && window.ghost.member) {
    document.body.classList.add("member-logged-in");

    const member = window.ghost.member;
    if (member.subscriptions && member.subscriptions.length > 0) {
      const activeSubscriptions = member.subscriptions.filter(
        (sub) => sub.status === "active"
      );
      activeSubscriptions.forEach((sub) => {
        if (sub.tier) {
          document.body.classList.add(`member-${sub.tier.name.toLowerCase()}`);
        } else {
          document.body.classList.add("member-paid");
        }
      });
    } else {
      document.body.classList.add("member-free");
    }
  }
});
