import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import ApiService from '../services/api';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'Sri Lanka',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const { navigate, cartItems, products, getCartAmount, delivery_fee, user, token } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!token) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Prepare order items
      const orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = products.find(product => product._id === items);
            if (itemInfo) {
              orderItems.push({
                productId: itemInfo._id,
                size: item,
                quantity: cartItems[items][item]
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error('No valid items in cart');
        return;
      }

      // Prepare order data
      const orderData = {
        items: orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: method
      };

      // Create order
      const orderResponse = await ApiService.createOrder(orderData);
      const orderId = orderResponse.data._id;
      const totalAmount = getCartAmount() + delivery_fee;

      toast.success('Order created successfully');

      // Handle payment based on method
      if (method === 'cod') {
        // Process COD order
        await ApiService.processCODOrder(orderId);
        toast.success('Order confirmed! You can pay on delivery.');
        navigate('/orders');
      } else if (method === 'stripe') {
        // Handle Stripe payment
        const paymentResponse = await ApiService.createStripePayment(orderId, totalAmount);
        // Redirect to Stripe checkout or handle payment intent
        // You'll need to implement Stripe Elements here
        console.log('Stripe payment intent:', paymentResponse);
      } else if (method === 'payhere') {
        // Handle PayHere payment
        const paymentResponse = await ApiService.createPayHerePayment(orderId, totalAmount);
        
        // Create PayHere payment form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.paymentUrl;

        // Add all payment data as hidden inputs
        Object.keys(paymentResponse.paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paymentResponse.paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* left side*/}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='firstName' 
            value={formData.firstName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='First name'
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='lastName' 
            value={formData.lastName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Last name'
          />
        </div>
        <input 
          required 
          onChange={onChangeHandler} 
          name='email' 
          value={formData.email}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="email" 
          placeholder='Email address'
        />
        <input 
          required 
          onChange={onChangeHandler} 
          name='street' 
          value={formData.street}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="text" 
          placeholder='Street'
        />
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='city' 
            value={formData.city}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='City'
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='state' 
            value={formData.state}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='zipcode' 
            value={formData.zipcode}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="number" 
            placeholder='Zipcode'
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='country' 
            value={formData.country}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Country'
          />
        </div>
        <input 
          required 
          onChange={onChangeHandler} 
          name='phone' 
          value={formData.phone}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="number" 
          placeholder='Phone'
        />
      </div>

      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* payment method selection*/}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('payhere')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'payhere' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>PAYHERE</p>
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button 
              type='submit'
              disabled={loading}
              className={`bg-black text-white px-16 py-3 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
