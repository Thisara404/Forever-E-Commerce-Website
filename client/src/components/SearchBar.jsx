import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { setSearch, setShowSearch } from '../store/slices/uiSlice';
import { useUI } from '../hooks/useReduxSelectors';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const SearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { showSearch, search } = useUI();
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  if (location.pathname.includes('collection') && showSearch) {
    return (
      <Card className='border-0 border-t border-b rounded-none bg-muted/50'>
        <div className='text-center py-6'>
          <div className='inline-flex items-center justify-center border rounded-full px-5 py-2 mx-3 bg-background shadow-sm'>
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className='flex-1 outline-none bg-inherit text-sm border-0 shadow-none'
              type="text"
              placeholder='Search products...'
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setShowSearch(false))}
              className="ml-2 h-auto p-1"
            >
              <img 
                className='w-4 cursor-pointer' 
                src={assets.cross_icon} 
                alt="Close search" 
              />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return null;
}

export default SearchBar;
