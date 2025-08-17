import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear cart on successful payment
    dispatch(clearCart());
    
    // Show success message
    toast.success('Payment completed successfully!');
    
    // Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-green-100 p-8 rounded-lg max-w-md">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h1>
        <p className="text-green-700 mb-4">
          Your order has been confirmed and payment processed successfully.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Redirecting to orders page in 3 seconds...
        </p>
        <button 
          onClick={() => navigate('/orders')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;