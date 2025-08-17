import React, { useState, useEffect } from 'react';

const StripePayment = ({ orderId, amount, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentReady, setPaymentReady] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');

  // Simulate Stripe initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validate card number (simple Luhn algorithm check)
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Test card patterns
  const testCards = [
    { number: '4242 4242 4242 4242', type: 'Visa - Success' },
    { number: '4000 0000 0000 0002', type: 'Visa - Declined' },
    { number: '4000 0000 0000 9995', type: 'Visa - Insufficient Funds' },
    { number: '5555 5555 5555 4444', type: 'Mastercard - Success' }
  ];

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
      setError(null);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setZip(value);
    }
  };

  const handleSubmit = async () => {
    if (processing) return;

    // Validation
    if (!cardNumber || !expiryDate || !cvc) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setError('Please enter a valid card number');
      return;
    }

    if (expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (cvc.length < 3) {
      setError('Please enter a valid CVC');
      return;
    }

    setProcessing(true);
    setError(null);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for test card scenarios
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      
      if (cleanCardNumber === '4000000000000002') {
        throw new Error('Your card was declined');
      } else if (cleanCardNumber === '4000000000009995') {
        throw new Error('Your card has insufficient funds');
      } else if (cleanCardNumber === '4000000000000069') {
        throw new Error('Your card has expired');
      }

      // Simulate successful payment
      console.log('Payment successful!', {
        orderId,
        amount,
        cardLast4: cleanCardNumber.slice(-4)
      });

      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const fillTestCard = (testCard) => {
    setCardNumber(testCard.number);
    setExpiryDate('12/34');
    setCvc('123');
    setZip('12345');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Secure Payment</h3>
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            SSL Secured
          </div>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Test Mode</p>
              <p className="text-xs text-yellow-600">No real money will be charged</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-lg font-semibold mb-2">
            <span>Order Total</span>
            <span>LKR {amount?.toLocaleString() || '0'}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 1234 1234 1234"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={processing}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={processing}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC *
              </label>
              <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={processing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={zip}
              onChange={handleZipChange}
              placeholder="12345"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={processing}
            />
          </div>
        </div>

        {/* Test Card Information */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-medium text-blue-800 mb-2">Test Cards (Click to fill):</p>
          <div className="space-y-2">
            {testCards.map((card, index) => (
              <button
                key={index}
                onClick={() => fillTestCard(card)}
                className="block w-full text-left p-2 text-xs bg-white rounded border hover:bg-blue-50 transition-colors"
                disabled={processing}
              >
                <div className="font-mono">{card.number}</div>
                <div className="text-blue-600">{card.type}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={processing || !paymentReady}
            className={`flex-1 py-3 px-4 rounded font-medium transition-colors ${
              processing || !paymentReady
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : !paymentReady ? (
              'Loading...'
            ) : (
              `Pay LKR ${amount?.toLocaleString() || '0'}`
            )}
          </button>
          
          <button
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Debug Information */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium text-gray-700 mb-1">Debug Info:</p>
          <div className="space-y-1 text-gray-600">
            <p>Payment Ready: {paymentReady ? '✅' : '⏳'}</p>
            <p>Card Valid: {cardNumber && validateCardNumber(cardNumber) ? '✅' : '❌'}</p>
            <p>Form Complete: {cardNumber && expiryDate && cvc ? '✅' : '❌'}</p>
            <p>Processing: {processing ? '⏳' : '✅'}</p>
            <p>Order ID: {orderId || 'Not provided'}</p>
          </div>
        </div>

        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <p><strong>Note:</strong> This is a mock Stripe integration for testing. In production, replace this with actual Stripe Elements.</p>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;