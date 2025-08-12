import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
            // Hide search bar when not on collection page
            setShowSearch(false);
        }
    }, [location, setShowSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Search functionality is handled automatically by the Collection component
        // through the search state in ShopContext
    };

    const handleClearSearch = () => {
        setSearch('');
        setShowSearch(false);
    };

    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center'>
            <form onSubmit={handleSearchSubmit} className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className='flex-1 outline-none bg-inherit text-sm' 
                    type="text" 
                    placeholder='Search products...'
                    autoFocus
                />
                <img className='w-4 cursor-pointer' src={assets.search_icon} alt="search" onClick={handleSearchSubmit} />
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

export default SearchBar
