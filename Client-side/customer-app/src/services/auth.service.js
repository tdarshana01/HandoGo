// API Service for Authentication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://service-production-8a3c.up.railway.app';

class AuthService {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response data
   */
  async login(email, password, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(role ? { email, password, role } : { email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response data
   */
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Get current user
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get auth token
   * @returns {string|null} Auth token or null
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Response data
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Response data
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
