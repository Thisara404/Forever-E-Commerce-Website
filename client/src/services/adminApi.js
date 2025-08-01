const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
  }

  async fetchWithAuth(url, options = {}) {
    const config = {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Dashboard APIs
  async getDashboardStats() {
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
      body: productData, // FormData
    });
  }

  async updateProduct(productId, productData) {
    return this.fetchWithAuth(`/products/${productId}`, {
      method: 'PUT',
      body: productData, // FormData
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