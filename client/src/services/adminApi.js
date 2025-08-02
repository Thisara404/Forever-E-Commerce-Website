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
    // Always get fresh token
    this.token = localStorage.getItem('token');
    
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

    console.log('🔗 Admin API request:', `${API_BASE_URL}${url}`);
    console.log('🔑 Token available:', this.token ? 'Yes' : 'No');
    console.log('📤 Request config:', config);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'API request failed');
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Fetch Error:', error);
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