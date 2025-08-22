// client/src/components/TestCardInfo.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const TestCardInfo = ({ onUseTestCard }) => {
  const testCards = [
    {
      number: '4242424242424242',
      brand: 'Visa',
      type: 'Success',
      description: 'Payment will succeed',
      color: 'bg-green-50 border-green-200'
    },
    {
      number: '4000000000000002',
      brand: 'Visa',
      type: 'Declined',
      description: 'Payment will be declined',
      color: 'bg-red-50 border-red-200'
    },
    {
      number: '5555555555554444',
      brand: 'Mastercard',
      type: 'Success',
      description: 'Payment will succeed',
      color: 'bg-green-50 border-green-200'
    },
    {
      number: '4000000000009995',
      brand: 'Visa',
      type: 'Insufficient Funds',
      description: 'Card will be declined for insufficient funds',
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🧪</span>
          Test Card Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use these test card numbers to simulate different payment scenarios in development mode.
        </p>
        
        <div className="grid gap-3">
          {testCards.map((card, index) => (
            <Card key={index} className={`${card.color} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm font-medium">
                        {card.number}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {card.brand}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUseTestCard && onUseTestCard(card)}
                  >
                    Use Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Additional Test Details:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use any valid expiry date (e.g., 12/25)</li>
              <li>• Use any 3-digit CVC (e.g., 123)</li>
              <li>• Use any valid ZIP code (e.g., 12345)</li>
              <li>• These cards only work in test mode</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TestCardInfo;