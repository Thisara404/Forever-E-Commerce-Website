import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setSearch, setShowSearch } from '../store/slices/uiSlice';
import { useUI } from '../hooks/useReduxSelectors';
import { assets } from '../assets/assets';

const SearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { search, showSearch } = useUI();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
      // Clear search when leaving collection page
      if (search) {
        dispatch(setSearch(''));
      }
      dispatch(setShowSearch(false));
    }
  }, [location, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(setShowSearch(true));
    }
  };

  const handleClearSearch = () => {
    dispatch(setSearch(''));
    dispatch(setShowSearch(false));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    dispatch(setSearch(value));
    
    // Auto-enable search when user types
    if (value.trim()) {
      dispatch(setShowSearch(true));
    } else {
      dispatch(setShowSearch(false));
    }
  };

  return visible && showSearch ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <form onSubmit={handleSearchSubmit} className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
        <input 
          value={search} 
          onChange={handleInputChange}
          className='flex-1 outline-none bg-inherit text-sm' 
          type="text" 
          placeholder='Search products...'
          autoFocus
        />
        <img 
          className='w-4 cursor-pointer' 
          src={assets.search_icon} 
          alt="search" 
          onClick={handleSearchSubmit} 
        />
      </form>
      <img 
        onClick={handleClearSearch} 
        className='inline w-3 cursor-pointer ml-3' 
        src={assets.cross_icon} 
        alt="close"
        title="Close search"
      />
    </div>
  ) : null;
}

export default SearchBar;
