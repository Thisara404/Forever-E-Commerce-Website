import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCartItem } from '../store/slices/cartSlice';
import { useCart, useProducts } from '../hooks/useReduxSelectors';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { products } = useProducts();
  const [cartData, setCartData] = useState([]);
  
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
    <div className='border-t pt-14 space-y-8'>
      <div className='text-center'>
        <div className='text-3xl font-bold tracking-tight mb-2'>
          <Title text1={'YOUR'} text2={'CART'}/>
        </div>
        <p className="text-muted-foreground">
          Review your items and proceed to checkout
        </p>
      </div>

      <div>
        {cartData.length === 0 ? (
          <Card>
            <CardContent className='text-center py-16'>
              <div className="text-6xl mb-4">🛒</div>
              <h3 className='text-xl font-semibold mb-2'>Your cart is empty</h3>
              <p className='text-muted-foreground mb-6'>
                Looks like you haven't added any items to your cart yet
              </p>
              <Button 
                onClick={() => navigate('/collection')}
                size="lg"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              
              if (!productData) {
                return null;
              }

              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className='grid grid-cols-[auto_1fr_auto_auto] gap-6 items-center'>
                      {/* Product Image and Info */}
                      <div className='flex items-start gap-4'>
                        <img 
                          className='w-20 h-20 object-cover rounded-md' 
                          src={productData.image[0]} 
                          alt={productData.name}
                        />
                        <div className="space-y-1">
                          <h4 className='font-medium text-sm sm:text-base line-clamp-2'>
                            {productData.name}
                          </h4>
                          <div className='flex items-center gap-3 text-sm'>
                            <span className="font-medium">{currency} {productData.price}</span>
                            <span className='px-2 py-1 bg-muted rounded text-xs'>
                              Size: {item.size}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Qty:</label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || value === '0') {
                              updateQuantity(item._id, item.size, 0);
                            } else {
                              updateQuantity(item._id, item.size, Number(value));
                            }
                          }}
                          className="w-20 h-9"
                        />
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Separator className="my-8" />

            {/* Cart Total and Checkout */}
            <div className='flex justify-end'>
              <div className='w-full sm:w-[450px] space-y-6'>
                <CartTotal />
                <Button 
                  onClick={() => navigate('/place-order')} 
                  size="lg"
                  className='w-full'
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart;
