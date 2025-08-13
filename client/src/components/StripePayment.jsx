import React, { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ orderId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await ApiService.createStripePayment(orderId, amount);
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error(error.message || 'Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [orderId, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    const card = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        toast.error(error.message);
        setPaymentStep('form');
        setCardError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await ApiService.confirmStripePayment(paymentIntent.id, orderId);
        setPaymentStep('success');
        setTimeout(() => {
          toast.success('Payment successful!');
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#6b7280',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
      complete: {
        color: '#059669',
        iconColor: '#059669',
      },
    },
    hidePostalCode: true,
  };

  // Processing Step
  if (paymentStep === 'processing') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-xl font-bold">Processing Payment</h3>
          <p className="text-blue-100 mt-2">Please wait while we process your payment securely...</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            This may take a few seconds. Please don't close this window.
          </p>
        </div>
      </div>
    );
  }

  // Success Step
  if (paymentStep === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Payment Successful!</h3>
          <p className="text-green-100 mt-2">Your order has been confirmed</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">Redirecting you to your orders...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Secure Payment</h3>
            <p className="text-blue-100 text-sm mt-1">Complete your purchase</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">SSL Secured</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Order Total</span>
          <span className="text-2xl font-bold text-gray-900">LKR {amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Includes shipping & taxes
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Card Details */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Card Information
          </label>
          <div className={`border-2 rounded-xl p-4 transition-all duration-200 ${
            cardError 
              ? 'border-red-300 bg-red-50' 
              : cardComplete 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300 focus-within:border-blue-500'
          }`}>
            <CardElement 
              options={cardElementOptions} 
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {cardError}
            </div>
          )}
          {cardComplete && !cardError && (
            <div className="mt-2 flex items-center text-green-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Card details are valid
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Your payment is secure</p>
              <p className="text-xs text-blue-600 mt-1">
                We use bank-level encryption to protect your card details. Your information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!stripe || loading || !cardComplete}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
              !stripe || loading || !cardComplete
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Pay LKR {amount.toLocaleString()}</span>
              </div>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Payment
          </button>
        </div>

        {/* Payment Methods */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <span className="text-xs font-medium">Powered by</span>
            <svg className="h-6" viewBox="0 0 60 25" fill="currentColor">
              <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04.8-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-8.78.76c0 1.8.18 2.24 1.4 2.24v3.12a9.88 9.88 0 0 1-1.26.08 2.64 2.64 0 0 1-2.77-1.96l-.08-.16c-.69 1.17-2.2 2.12-4.21 2.12-2.7 0-4.79-1.50-4.79-4.68 0-3.24 2.08-4.37 4.79-4.37 1.99 0 3.52.87 4.21 2.04v-.16c0-1.31-.92-2.38-3.05-2.38-1.85 0-3.22.43-4.58 1.09V7.27c1.36-.6 2.94-.99 4.79-.99 4.25 0 5.75 2.53 5.75 4.84l-.01 8.91z"/>
            </svg>
          </div>
        </div>
      </form>
    </div>
  );
};

const StripePayment = ({ orderId, amount, onSuccess, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md animate-in zoom-in duration-300">
        <Elements stripe={stripePromise}>
          <StripePaymentForm 
            orderId={orderId} 
            amount={amount} 
            onSuccess={onSuccess} 
            onCancel={onCancel} 
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripePayment;