const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async fetchWithAuth(url, options = {}) {
    try {
      // Always get fresh token
      this.token = localStorage.getItem('token');
      
      const config = {
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      };

      // Don't set Content-Type for FormData - browser will set it with boundary
      if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
      } else if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      console.log('🔍 Admin API Request:', {
        url: `${API_BASE_URL}${url}`,
        hasToken: !!this.token,
        method: options.method || 'GET',
        bodyType: options.body instanceof FormData ? 'FormData' : typeof options.body
      });

      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      console.log('📥 Admin API Response:', {
        status: response.status,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Admin API Success');
      return data;
    } catch (error) {
      console.error('❌ Admin API Fetch Error:', error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardStats() {
    console.log('📊 Calling getDashboardStats...');
    return this.fetchWithAuth('/admin/dashboard/stats');
  }

  // Product Management APIs - Using admin routes
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchWithAuth(`/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return this.fetchWithAuth('/admin/products', {
      method: 'POST',
      body: productData, // FormData object
    });
  }

  async updateProduct(productId, productData) {
    return this.fetchWithAuth(`/admin/products/${productId}`, {
      method: 'PUT',
      body: productData, // FormData object
    });
  }

  async deleteProduct(productId) {
    return this.fetchWithAuth(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Order Management APIs
  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchWithAuth(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.fetchWithAuth(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderStatus: status }),
    });
  }

  // User Management APIs
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchWithAuth(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateUserStatus(userId, isActive) {
    return this.fetchWithAuth(`/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });
  }

  // Analytics APIs
  async getAnalytics(timeRange = '30d') {
    return this.fetchWithAuth(`/admin/analytics?range=${timeRange}`);
  }
}

export default new AdminApiService();