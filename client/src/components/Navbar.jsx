import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { clearCart, resetCartState, clearCartOnServer } from '../store/slices/cartSlice'; // Add clearCartOnServer
import { setShowSearch } from '../store/slices/uiSlice';
import { useAuth, useCart, useUI } from '../hooks/useReduxSelectors';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Replace Context with Redux hooks
  const { user, token } = useAuth();
  const { cartItems } = useCart();
  const { showSearch } = useUI();

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error('Error calculating cart count:', error);
        }
      }
    }
    return totalCount;
  };

  const handleLogout = async () => {
    try {
      // Clear cart on server first
      await dispatch(clearCartOnServer()).unwrap();
    } catch (error) {
      console.warn('Failed to clear cart on server during logout');
    }
    
    // Clear local cart state
    dispatch(resetCartState());
    
    // Logout user
    dispatch(logout());
    
    // Navigate to home
    navigate('/');
    
    // Close mobile menu
    setVisible(false);
  };

  const handleProfileClick = () => {
    if (token) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
  };

  const handleSearchClick = () => {
    if (location.pathname !== '/collection') {
      navigate('/collection');
      setTimeout(() => {
        dispatch(setShowSearch(true));
      }, 100);
    } else {
      dispatch(setShowSearch(true));
    }
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      
      <Link to='/'>
        <img src={assets.logo} className='w-36' alt="" />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img 
          onClick={handleSearchClick} 
          src={assets.search_icon} 
          className='w-5 cursor-pointer' 
          alt="" 
        />

        <div className='group relative'>
          <img 
            onClick={handleProfileClick} 
            className='w-5 cursor-pointer' 
            src={assets.profile_icon} 
            alt="" 
          />
          {/* Profile dropdown */}
          {token && (
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                {user && user.role === 'admin' && (
                  <p onClick={() => navigate('/admin')} className='cursor-pointer hover:text-black'>Admin</p>
                )}
                <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          
          {token ? (
            <>
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/orders'>MY ORDERS</NavLink>
              <p onClick={handleLogout} className='py-2 pl-6 border cursor-pointer'>LOGOUT</p>
            </>
          ) : (
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/login'>LOGIN</NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar;