import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { clearCart, resetCartState, clearCartOnServer } from '../store/slices/cartSlice';
import { setShowSearch } from '../store/slices/uiSlice';
import { useAuth, useCart, useUI } from '../hooks/useReduxSelectors';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
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
      await dispatch(clearCartOnServer()).unwrap();
    } catch (error) {
      console.warn('Failed to clear cart on server during logout');
    }
    
    dispatch(resetCartState());
    dispatch(logout());
    navigate('/');
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
    }
    dispatch(setShowSearch(!showSearch));
  };

  return (
    <nav className='flex items-center justify-between py-5 font-medium border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'>
      <Link to='/'>
        <img src={assets.logo} className='w-36' alt="Forever Logo" />
      </Link>

      {/* Desktop Navigation */}
      <ul className='hidden sm:flex gap-5 text-sm text-muted-foreground'>
        <NavLink to='/' className='flex flex-col items-center gap-1 group'>
          <p className="group-hover:text-foreground transition-colors">HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-foreground hidden group-hover:block transition-all' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 group'>
          <p className="group-hover:text-foreground transition-colors">COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-foreground hidden group-hover:block transition-all' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1 group'>
          <p className="group-hover:text-foreground transition-colors">ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-foreground hidden group-hover:block transition-all' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1 group'>
          <p className="group-hover:text-foreground transition-colors">CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-foreground hidden group-hover:block transition-all' />
        </NavLink>
      </ul>

      {/* Desktop Actions */}
      <div className='flex items-center gap-6'>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSearchClick}
          className="w-5 h-5 p-0"
        >
          <img src={assets.search_icon} className='w-5 cursor-pointer' alt="Search" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-5 h-5 p-0">
              <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {token ? (
              <>
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <span>📋 My Orders</span>
                </DropdownMenuItem>
                {user && user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <span>⚙️ Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <span>🚪 Logout</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => navigate('/login')}>
                <span>🔐 Login</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <Button variant="ghost" size="sm" className="w-5 h-5 p-0 relative">
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
            {getCartCount() > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getCartCount()}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setVisible(true)} 
          className='w-5 sm:hidden p-0'
        >
          <img src={assets.menu_icon} className='w-5 cursor-pointer' alt="Menu" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-background transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-muted-foreground h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer border-b'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back" />
            <p className="font-medium">Back</p>
          </div>
          
          <div className="flex-1 py-4">
            <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/'>
              <span>🏠 HOME</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/collection'>
              <span>👗 COLLECTION</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/about'>
              <span>ℹ️ ABOUT</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/contact'>
              <span>📞 CONTACT</span>
            </NavLink>
            
            <Separator className="my-4" />
            
            {token ? (
              <>
                <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/orders'>
                  <span>📋 MY ORDERS</span>
                </NavLink>
                <button onClick={handleLogout} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors w-full text-left text-destructive'>
                  <span>🚪 LOGOUT</span>
                </button>
              </>
            ) : (
              <NavLink onClick={() => setVisible(false)} className='flex items-center py-3 pl-6 border-b hover:bg-muted/50 transition-colors' to='/login'>
                <span>🔐 LOGIN</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;