import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await ApiService.login({ email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      sessionStorage.setItem('token', response.token);
      ApiService.setToken(response.token);
      
      toast.success('Login successful');
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await ApiService.register(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      sessionStorage.setItem('token', response.token);
      ApiService.setToken(response.token);
      
      toast.success('Registration successful');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.fetchWithAuth('/auth/profile');
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear storage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      ApiService.removeToken();
      
      toast.success('Logged out successfully');
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      // Check for stored token
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (storedToken && storedToken.length > 10 && storedToken.includes('.')) {
        state.token = storedToken;
        state.isAuthenticated = true;
        ApiService.setToken(storedToken);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        if (action.payload?.includes('401') || action.payload?.includes('unauthorized')) {
          // Auto logout on token expiry
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          ApiService.removeToken();
        }
      });
  },
});

export const { logout, setToken, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;