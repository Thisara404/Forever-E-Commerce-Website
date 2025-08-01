import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-red-100 p-8 rounded-lg max-w-md">
        <div className="text-red-600 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Cancelled</h1>
        <p className="text-red-700 mb-4">
          Your payment was cancelled. Your order is still pending.
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/place-order')}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;