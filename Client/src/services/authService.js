import api from "../api/fetchApi.js";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
const authService = {
  /**
   * Sign up a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.password - Password
   * @param {string} [userData.name] - User's name
   * @returns {Promise} API response with user data
   */
  signup: (userData) => api.post("/auth/signup", userData),

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise} API response with user data
   */
  login: (credentials) => api.post("/auth/login", credentials),

  /**
   * Get current user info
   * @returns {Promise} API response with user data
   */
  getCurrentUser: () => api.get("/auth/me"),

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: () => api.get("/auth/logout"),
};

export default authService;
