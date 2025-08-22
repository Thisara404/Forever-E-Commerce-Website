import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import StripePayment from '../components/StripePayment';
import { assets } from '../assets/assets';
import ApiService from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { useAuth, useCart, useProducts } from '../hooks/useReduxSelectors';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

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
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useAuth();
  const { cartItems, getCartAmount } = useCart();
  const { products } = useProducts();

  const delivery_fee = 10;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleStripeSuccess = () => {
    setShowStripePayment(false);
    dispatch(clearCart());
    navigate('/orders');
    toast.success('Payment successful! Order confirmed.');
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
      setCurrentOrderId(orderId);

      // Handle payment based on method
      if (method === 'cod') {
        await ApiService.processCODOrder(orderId);
        dispatch(clearCart());
        toast.success('Order confirmed! You can pay on delivery.');
        navigate('/orders');
      } else if (method === 'stripe') {
        setShowStripePayment(true);
      } else if (method === 'payhere') {
        const paymentResponse = await ApiService.createPayHerePayment(orderId, totalAmount);
        dispatch(clearCart());
        
        // Create PayHere payment form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.paymentUrl;

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

  const handleStripeCancel = () => {
    setShowStripePayment(false);
    toast.info('Payment cancelled. You can try again from your orders page.');
    navigate('/orders');
  };

  // Show Stripe payment modal
  if (showStripePayment && currentOrderId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <StripePayment
          orderId={currentOrderId}
          amount={getCartAmount() + delivery_fee}
          onSuccess={handleStripeSuccess}
          onCancel={handleStripeCancel}
        />
      </div>
    );
  }

  return (
    <div className='border-t pt-8 space-y-8'>
      <div className="text-center">
        <div className='text-3xl font-bold tracking-tight mb-2'>
          <Title text1={'CHECKOUT'} text2={'DETAILS'} />
        </div>
        <p className="text-muted-foreground">
          Complete your order details and choose payment method
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className='grid lg:grid-cols-2 gap-8'>
        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚚 Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name='firstName' 
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  placeholder='First name'
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name='lastName' 
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  placeholder='Last name'
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name='email' 
                type="email"
                value={formData.email}
                onChange={onChangeHandler}
                placeholder='Email address'
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                name='street' 
                value={formData.street}
                onChange={onChangeHandler}
                placeholder='Street address'
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name='city' 
                  value={formData.city}
                  onChange={onChangeHandler}
                  placeholder='City'
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name='state' 
                  value={formData.state}
                  onChange={onChangeHandler}
                  placeholder='State'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <Label htmlFor="zipcode">Zip Code *</Label>
                <Input
                  id="zipcode"
                  name='zipcode' 
                  type="number"
                  value={formData.zipcode}
                  onChange={onChangeHandler}
                  placeholder='Zip code'
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name='country' 
                  value={formData.country}
                  onChange={onChangeHandler}
                  placeholder='Country'
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name='phone' 
                type="tel"
                value={formData.phone}
                onChange={onChangeHandler}
                placeholder='Phone number'
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary and Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <CartTotal />

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💳 Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='space-y-3'>
                {/* Stripe */}
                <div 
                  onClick={() => setMethod('stripe')} 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    method === 'stripe' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    method === 'stripe' ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <img className='h-6' src={assets.stripe_logo} alt="Stripe" />
                  <span className="text-sm font-medium">Credit/Debit Card</span>
                </div>

                {/* PayHere */}
                <div 
                  onClick={() => setMethod('payhere')} 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    method === 'payhere' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    method === 'payhere' ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <img className='h-6' src={assets.razorpay_logo} alt="PayHere" />
                  <span className="text-sm font-medium">PayHere</span>
                </div>

                {/* Cash on Delivery */}
                <div 
                  onClick={() => setMethod('cod')} 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    method === 'cod' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    method === 'cod' ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </div>
              </div>

              <Separator />

              <Button 
                type="submit" 
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
