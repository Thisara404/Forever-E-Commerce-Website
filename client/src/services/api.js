const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove auth token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Base fetch with auth
  async fetchWithAuth(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      let errorMessage = 'API request failed';
      
      try {
        const errorData = await response.json();
        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(err => err.msg).join(', ');
        } else {
          errorMessage = errorData.message || errorMessage;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth APIs
  async register(userData) {
    return this.fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Product APIs
  async getProducts(params = {}) {
    // Clean up params - remove empty values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const queryString = new URLSearchParams(cleanParams).toString();
    console.log('🔍 API Request:', `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`);
    
    return this.fetchWithAuth(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.fetchWithAuth(`/products/${id}`);
  }

  // Cart APIs
  async getCart() {
    return this.fetchWithAuth('/cart');
  }

  async addToCart(productId, size, quantity = 1) {
    return this.fetchWithAuth('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, size, quantity }),
    });
  }

  async updateCartItem(productId, size, quantity) {
    return this.fetchWithAuth('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, size, quantity }),
    });
  }

  async removeFromCart(productId, size) {
    return this.fetchWithAuth('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId, size }),
    });
  }

  // Order APIs
  async createOrder(orderData) {
    return this.fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.fetchWithAuth('/orders');
  }

  async getOrder(orderId) {
    return this.fetchWithAuth(`/orders/${orderId}`);
  }

  // Payment APIs
  async createPayHerePayment(orderId, amount) {
    return this.fetchWithAuth('/payments/payhere/create-payment', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, currency: 'LKR' }),
    });
  }

  async createStripePayment(orderId, amount) {
    console.log('🔄 Creating Stripe payment intent...');
    
    return this.fetchWithAuth('/payments/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ 
        orderId, 
        amount: Number(amount),
        currency: 'lkr'
      }),
    });
  }

  async processCODOrder(orderId) {
    return this.fetchWithAuth('/payments/cod/process', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async createStripePaymentIntent(data) {
    return this.fetchWithAuth('/payments/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmStripePayment(data) {
    return this.fetchWithAuth('/payments/stripe/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();