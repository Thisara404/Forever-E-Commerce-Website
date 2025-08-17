import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

// Simplified auth initialization
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting auth initialization...');
      
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        console.log('ℹ️ No stored authentication found');
        return { success: false, token: null, user: null };
      }
      
      try {
        const user = JSON.parse(userString);
        
        // Basic validation
        if (!user || !user.id || !user.name || !user.email) {
          console.warn('⚠️ Invalid user data, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return { success: false, token: null, user: null };
        }
        
        console.log('✅ Auth restored from localStorage:', { 
          user: user.name, 
          role: user.role 
        });
        
        return { success: true, token, user };
        
      } catch (parseError) {
        console.error('❌ Error parsing user data:', parseError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: false, token: null, user: null };
      }
      
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      return { success: false, token: null, user: null };
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login...');
      
      const response = await ApiService.login(credentials);
      
      if (response?.success && response?.data) {
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error('Invalid response: missing token or user data');
        }
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ Login successful');
        return { token, user };
      }
      
      throw new Error(response?.message || 'Login failed');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('📝 Attempting registration...');
      
      const response = await ApiService.register(userData);
      
      if (response?.success && response?.data) {
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error('Invalid response: missing token or user data');
        }
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ Registration successful');
        return { token, user };
      }
      
      throw new Error(response?.message || 'Registration failed');
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true; // Keep initialized true
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🚪 User logged out');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    // Add this to manually set initialized if needed
    setInitialized: (state) => {
      state.initialized = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = null;
        
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearAuthError, setInitialized } = authSlice.actions;
export default authSlice.reducer;