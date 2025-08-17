import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showSearch: false,
  search: '',
  loading: false,
  // Add search history
  searchHistory: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      
      // Add to search history if it's a meaningful search
      if (action.payload.trim().length > 2) {
        const history = state.searchHistory.filter(
          item => item !== action.payload.trim()
        );
        state.searchHistory = [action.payload.trim(), ...history].slice(0, 5);
      }
    },
    clearSearch: (state) => {
      state.search = '';
      state.showSearch = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
  },
});

export const { 
  setShowSearch, 
  setSearch, 
  clearSearch, 
  setLoading,
  clearSearchHistory 
} = uiSlice.actions;

export default uiSlice.reducer;