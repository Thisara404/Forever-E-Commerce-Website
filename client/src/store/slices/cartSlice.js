import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

const initialState = {
  items: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Fetch cart from server
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return { items: {} }; // Return empty cart if not authenticated
      }

      const response = await ApiService.getCart();
      const backendCart = response.data.items || [];
      
      // Convert backend cart format to frontend format
      const frontendCart = {};
      let invalidItemsCount = 0;

      backendCart.forEach(item => {
        if (item.productId && item.productId._id && item.size && item.quantity > 0) {
          const productId = item.productId._id;
          if (!frontendCart[productId]) {
            frontendCart[productId] = {};
          }
          frontendCart[productId][item.size] = item.quantity;
        } else {
          invalidItemsCount++;
        }
      });

      if (invalidItemsCount > 0) {
        console.warn(`⚠️ Found ${invalidItemsCount} invalid cart items`);
      }
      
      return { items: frontendCart };
    } catch (error) {
      // If cart fetch fails, return empty cart instead of error
      console.warn('Cart fetch failed, using empty cart:', error.message);
      return { items: {} };
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ itemId, size, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        toast.error('Please login to add items to cart');
        throw new Error('Not authenticated');
      }

      if (!size) {
        toast.error('Select Product Size');
        throw new Error('Size required');
      }

      await ApiService.addToCart(itemId, size, quantity);
      toast.success('Item added to cart');
      
      return { itemId, size, quantity };
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, size, quantity }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        toast.error('Please login to update cart');
        throw new Error('Not authenticated');
      }

      await ApiService.updateCartItem(itemId, size, quantity);
      
      return { itemId, size, quantity };
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartOnServer = createAsyncThunk(
  'cart/clearCartOnServer',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return; // No need to clear server cart if not authenticated
      }

      await ApiService.clearCart();
      return {};
    } catch (error) {
      console.warn('Failed to clear cart on server:', error.message);
      return {}; // Return empty cart even if server clear fails
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = {};
      state.error = null;
      state.lastUpdated = Date.now();
    },
    updateLocalCart: (state, action) => {
      const { itemId, size, quantity } = action.payload;
      
      if (quantity === 0) {
        if (state.items[itemId] && state.items[itemId][size]) {
          delete state.items[itemId][size];
          if (Object.keys(state.items[itemId]).length === 0) {
            delete state.items[itemId];
          }
        }
      } else {
        if (!state.items[itemId]) {
          state.items[itemId] = {};
        }
        state.items[itemId][size] = quantity;
      }
      state.lastUpdated = Date.now();
    },
    // New reducer to reset cart state completely
    resetCartState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.items = {};
        state.loading = false;
        state.error = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { itemId, size, quantity } = action.payload;
        if (!state.items[itemId]) {
          state.items[itemId] = {};
        }
        if (state.items[itemId][size]) {
          state.items[itemId][size] += quantity;
        } else {
          state.items[itemId][size] = quantity;
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, size, quantity } = action.payload;
        if (quantity === 0) {
          if (state.items[itemId] && state.items[itemId][size]) {
            delete state.items[itemId][size];
            if (Object.keys(state.items[itemId]).length === 0) {
              delete state.items[itemId];
            }
          }
        } else {
          if (!state.items[itemId]) {
            state.items[itemId] = {};
          }
          state.items[itemId][size] = quantity;
        }
        state.lastUpdated = Date.now();
      })
      .addCase(clearCartOnServer.fulfilled, (state) => {
        state.items = {};
        state.lastUpdated = Date.now();
      });
  },
});

export const { clearCart, updateLocalCart, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;