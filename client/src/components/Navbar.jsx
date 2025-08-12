import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, user, token, logout, navigate } = useContext(ShopContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    if (token) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
  };

  const handleSearchClick = () => {
    // If not on collection page, navigate there first, then show search
    if (location.pathname !== '/collection') {
      navigate('/collection');
      // Small delay to ensure navigation completes before showing search
      setTimeout(() => {
        setShowSearch(true);
      }, 100);
    } else {
      setShowSearch(true);
    }
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'><img src={assets.logo} alt="logo" className='w-36'/></Link>

      <ul className='hidden sm:flex gap-5 text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>  
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        {/* ADMIN ACCESS - Show only for admin users */}
        {user && user.role === 'admin' && (
          <NavLink to='/admin' className='flex flex-col items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-md transition-all hover:from-blue-600 hover:to-purple-700'>
            <p className="text-sm font-semibold">⚡ ADMIN</p>
          </NavLink>
        )}
      </ul>

      <div className='flex items-center gap-6'>
        <img 
          onClick={handleSearchClick} 
          src={assets.search_icon} 
          alt="search" 
          className='w-5 cursor-pointer hover:opacity-70 transition-opacity'
          title="Search products"
        />

        <div className='group relative'>
          <img 
            onClick={handleProfileClick}
            src={assets.profile_icon} 
            alt="" 
            className='w-5 cursor-pointer'
          />
          {token && (
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>
                  {user ? `Hi, ${user.name}` : 'My Profile'}
                </p>
                <Link to='/orders' className='cursor-pointer hover:text-black'>
                  Orders
                </Link>
                {/* ADMIN PANEL ACCESS in dropdown */}
                {user && user.role === 'admin' && (
                  <Link to='/admin' className='cursor-pointer hover:text-black text-blue-600 font-semibold border-t pt-2'>
                    🔧 Admin Panel
                  </Link>
                )}
                <p onClick={handleLogout} className='cursor-pointer hover:text-black'>
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="cart" className='w-5 min-w-5' />
          <p className='absolute right-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img 
          onClick={() => setVisible(true)} 
          src={assets.menu_icon} 
          alt="menu" 
          className='w-5 cursor-pointer sm:hidden' 
        />
      </div>

      {/* Sidebar Menu for small screens */}
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
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/orders'>ORDERS</NavLink>
              {/* ADMIN ACCESS in mobile menu */}
              {user && user.role === 'admin' && (
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-blue-50 text-blue-600 font-semibold' to='/admin'>
                  🔧 ADMIN PANEL
                </NavLink>
              )}
              <div onClick={() => { setVisible(false); handleLogout(); }} className='py-2 pl-6 border cursor-pointer'>LOGOUT</div>
            </>
          ) : (
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/login'>LOGIN</NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;