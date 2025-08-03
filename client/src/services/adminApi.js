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

      // Add debug logging
      console.log('🔍 Admin API Request:', {
        url: `${API_BASE_URL}${url}`,
        hasToken: !!this.token,
        config
      });

      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      // Add response logging
      console.log('📥 Admin API Response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Admin API Error:', error);
        throw new Error(error.message || 'API request failed');
      }

      const data = await response.json();
      console.log('✅ Admin API Success:', data);
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

  // Product Management APIs
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchWithAuth(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return this.fetchWithAuth('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(productId, productData) {
    return this.fetchWithAuth(`/products/${productId}`, {
      method: 'PUT',
      body: productData,
    });
  }

  async deleteProduct(productId) {
    return this.fetchWithAuth(`/products/${productId}`, {
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
      body: JSON.stringify({ isActive }),
    });
  }

  // Analytics APIs
  async getAnalytics(timeRange = '30d') {
    return this.fetchWithAuth(`/admin/analytics?range=${timeRange}`);
  }
}

export default new AdminApiService();