import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return { items: {} };
      }
      
      const response = await ApiService.getCart();
      const backendCart = response.data;
      
      const frontendCart = {};
      let invalidItemsCount = 0;
      
      if (backendCart && backendCart.items && Array.isArray(backendCart.items)) {
        backendCart.items.forEach(item => {
          if (item && item.productId && item.size && item.quantity) {
            const productId = item.productId._id || item.productId;
            
            if (!frontendCart[productId]) {
              frontendCart[productId] = {};
            }
            frontendCart[productId][item.size] = item.quantity;
          } else {
            invalidItemsCount++;
          }
        });
      }
      
      if (invalidItemsCount > 0) {
        console.warn(`⚠️ Found ${invalidItemsCount} invalid cart items`);
      }
      
      return { items: frontendCart };
    } catch (error) {
      return rejectWithValue(error.message);
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

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = {};
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.items = {};
        state.loading = false;
        state.error = action.payload;
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
      });
  },
});

export const { clearCart, updateLocalCart } = cartSlice.actions;
export default cartSlice.reducer;