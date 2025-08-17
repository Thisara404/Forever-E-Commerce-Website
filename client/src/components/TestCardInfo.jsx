// client/src/components/TestCardInfo.jsx
import React, { useState } from 'react';

const TestCardInfo = ({ onUseTestCard }) => {
  const [showTestCards, setShowTestCards] = useState(false);
  
  const testCards = [
    {
      name: 'Visa (Success)',
      number: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
      description: 'Always succeeds'
    },
    {
      name: 'Visa (Decline)',
      number: '4000000000000002',
      expiry: '12/25', 
      cvc: '123',
      description: 'Always declined'
    },
    {
      name: 'Visa (Insufficient Funds)',
      number: '4000000000009995',
      expiry: '12/25',
      cvc: '123', 
      description: 'Insufficient funds'
    },
    {
      name: 'Mastercard (Success)',
      number: '5555555555554444',
      expiry: '12/25',
      cvc: '123',
      description: 'Always succeeds'
    }
  ];

  const isDevelopment = import.meta.env.MODE === 'development';
  const isTestKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_');

  if (!isDevelopment || !isTestKey) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-yellow-800 font-medium">🧪 Test Mode</span>
          <span className="ml-2 text-sm text-yellow-600">
            No real money will be charged
          </span>
        </div>
        <button
          onClick={() => setShowTestCards(!showTestCards)}
          className="text-yellow-800 text-sm underline hover:no-underline"
        >
          {showTestCards ? 'Hide' : 'Show'} Test Cards
        </button>
      </div>
      
      {showTestCards && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-yellow-800">Test Credit Cards:</p>
          {testCards.map((card, index) => (
            <div key={index} className="bg-white p-3 rounded border text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{card.name}</p>
                  <p className="text-gray-600">
                    {card.number} • {card.expiry} • {card.cvc}
                  </p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
                <button
                  onClick={() => onUseTestCard && onUseTestCard(card)}
                  className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
          <div className="text-xs text-yellow-600 mt-2">
            💡 These cards only work in test mode. Use any future expiry date and any CVC.
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCardInfo;