const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Update the fetchWithAuth function and auth methods

const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const fullUrl = `${baseURL}${url}`;
    
    console.log('🌐 API Request:', {
      url: fullUrl,
      method: options.method || 'GET',
      hasToken: !!token,
      hasBody: !!options.body
    });

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(fullUrl, config);
    
    console.log('📡 API Response Status:', {
      status: response.status,
      ok: response.ok,
      url: fullUrl
    });

    // Always try to parse JSON response
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error('Invalid response format from server');
    }

    console.log('📥 API Response Data:', data);

    if (!response.ok) {
      // Handle HTTP error responses
      const errorMessage = data.message || `HTTP Error: ${response.status}`;
      console.error('❌ API Error Response:', {
        status: response.status,
        message: errorMessage,
        data
      });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('❌ API Fetch Error:', error);
    throw error;
  }
};

// Update auth methods
const login = async (credentials) => {
  try {
    console.log('🔐 Login request:', { email: credentials.email });
    
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    console.log('✅ Login response:', response);
    return response;
  } catch (error) {
    console.error('❌ Login API error:', error);
    throw error;
  }
};

const register = async (userData) => {
  try {
    console.log('📝 Register request:', { 
      name: userData.name, 
      email: userData.email 
    });
    
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('✅ Register response:', response);
    return response;
  } catch (error) {
    console.error('❌ Register API error:', error);
    throw error;
  }
};

const getUserProfile = async () => {
  try {
    const response = await fetchWithAuth('/auth/profile');
    return response;
  } catch (error) {
    console.error('❌ Get profile API error:', error);
    throw error;
  }
};

// Product APIs
const getProducts = async (params = {}) => {
  // Clean up params - remove empty values
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});

  const queryString = new URLSearchParams(cleanParams).toString();
  console.log('🔍 API Request:', `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`);
  
  return fetchWithAuth(`/products${queryString ? `?${queryString}` : ''}`);
};

const getProduct = async (id) => {
  return fetchWithAuth(`/products/${id}`);
};

// Cart APIs
const getCart = async () => {
  return fetchWithAuth('/cart');
};

const addToCart = async (productId, size, quantity = 1) => {
  return fetchWithAuth('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, size, quantity }),
  });
};

const updateCartItem = async (productId, size, quantity) => {
  return fetchWithAuth('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, size, quantity }),
  });
};

const removeFromCart = async (productId, size) => {
  return fetchWithAuth('/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify({ productId, size }),
  });
};

// Order APIs
const createOrder = async (orderData) => {
  return fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

const getUserOrders = async () => {
  return fetchWithAuth('/orders');
};

const getOrder = async (orderId) => {
  return fetchWithAuth(`/orders/${orderId}`);
};

// Payment APIs
const createPayHerePayment = async (orderId, amount) => {
  return fetchWithAuth('/payments/payhere/create-payment', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount, currency: 'LKR' }),
  });
};

const createStripePayment = async (orderId, amount) => {
  console.log('🔄 Creating Stripe payment intent...');
  
  return fetchWithAuth('/payments/stripe/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ 
      orderId, 
      amount: Number(amount),
      currency: 'lkr'
    }),
  });
};

const processCODOrder = async (orderId) => {
  return fetchWithAuth('/payments/cod/process', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
};

const createStripePaymentIntent = async (data) => {
  return fetchWithAuth('/payments/stripe/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const confirmStripePayment = async (data) => {
  return fetchWithAuth('/payments/stripe/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Make sure to export all methods
export default {
  fetchWithAuth,
  login,
  register,
  getUserProfile,
  getProducts,
  getProduct,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  createOrder,
  getUserOrders,
  getOrder,
  createPayHerePayment,
  createStripePayment,
  processCODOrder,
  createStripePaymentIntent,
  confirmStripePayment,
};