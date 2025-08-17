import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCartItem } from '../store/slices/cartSlice';
import { useCart, useProducts } from '../hooks/useReduxSelectors';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { products } = useProducts();
  const [cartData, setCartData] = useState([]);
  
  // Add currency constant
  const currency = 'LKR';

  const updateQuantity = async (itemId, size, quantity) => {
    try {
      await dispatch(updateCartItem({ itemId, size, quantity })).unwrap();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'}/>
      </div>

      <div>
        {cartData.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
            <button 
              onClick={() => navigate('/collection')}
              className='bg-black text-white px-6 py-3 text-sm'
            >
              START SHOPPING
            </button>
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            
            if (!productData) {
              return null; // Skip if product not found
            }

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex item-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency} {productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div> 
                <input 
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === '0') {
                      updateQuantity(item._id, item.size, 0);
                    } else {
                      updateQuantity(item._id, item.size, Number(value));
                    }
                  }} 
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                  type="number" 
                  min={1} 
                  defaultValue={item.quantity}
                />
                <img 
                  onClick={() => updateQuantity(item._id, item.size, 0)} 
                  className='w-4 mr-4 sm:w-5 cursor-pointer' 
                  src={assets.bin_icon} 
                  alt="" 
                />
              </div>
            );
          })
        )}
      </div>

      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <div className='w-full text-end'>
              <button 
                onClick={() => navigate('/place-order')} 
                className='bg-black text-white text-sm my-8 px-8 py-3'
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart;
