import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

const StripePayment = ({ orderId, amount, onSuccess, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const testCards = [
    { number: '4242424242424242', type: 'Visa - Success' },
    { number: '4000000000000002', type: 'Visa - Declined' },
    { number: '5555555555554444', type: 'Mastercard - Success' },
    { number: '4000000000009995', type: 'Visa - Insufficient Funds' },
  ];

  useEffect(() => {
    setPaymentReady(true);
  }, []);

  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };

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

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 5) {
      setZip(value);
    }
  };

  const fillTestCard = (testCard) => {
    setCardNumber(formatCardNumber(testCard.number));
    setExpiryDate('12/25');
    setCvc('123');
    setZip('12345');
  };

  const handleSubmit = async () => {
    if (!validateCardNumber(cardNumber)) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    if (!expiryDate || expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (!cvc || cvc.length < 3) {
      toast.error('Please enter a valid CVC');
      return;
    }

    setProcessing(true);

    try {
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      
      const paymentData = {
        orderId,
        amount: Math.round(amount * 100),
        cardNumber: cleanCardNumber,
        expiryMonth: expiryDate.split('/')[0],
        expiryYear: '20' + expiryDate.split('/')[1],
        cvc,
        zip
      };

      console.log('Processing payment with data:', paymentData);

      const response = await ApiService.processStripePayment(paymentData);
      
      if (response.success) {
        toast.success('Payment successful!');
        onSuccess();
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>💳 Payment Details</span>
          <Badge variant="outline">Test Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Amount to pay: LKR {amount?.toLocaleString() || '0'}</strong>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              disabled={processing}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                disabled={processing}
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC *</Label>
              <Input
                id="cvc"
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                disabled={processing}
                className="font-mono"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              type="text"
              value={zip}
              onChange={handleZipChange}
              placeholder="12345"
              disabled={processing}
            />
          </div>
        </div>

        {/* Test Card Information */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            <p className="font-medium text-blue-800 mb-2">Test Cards (Click to fill):</p>
            <div className="space-y-2">
              {testCards.map((card, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCard(card)}
                  className="w-full justify-start text-xs h-auto p-2"
                  disabled={processing}
                >
                  <div className="text-left">
                    <div className="font-mono">{card.number}</div>
                    <div className="text-blue-600">{card.type}</div>
                  </div>
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={processing || !paymentReady}
            className="flex-1"
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
          </Button>
          
          <Button
            onClick={onCancel}
            disabled={processing}
            variant="outline"
          >
            Cancel
          </Button>
        </div>

        {/* Debug Information */}
        <Alert className="bg-muted">
          <AlertDescription>
            <p className="font-medium mb-1">Debug Info:</p>
            <div className="space-y-1 text-xs">
              <p>Payment Ready: {paymentReady ? '✅' : '⏳'}</p>
              <p>Card Valid: {cardNumber && validateCardNumber(cardNumber) ? '✅' : '❌'}</p>
              <p>Form Complete: {cardNumber && expiryDate && cvc ? '✅' : '❌'}</p>
              <p>Processing: {processing ? '⏳' : '✅'}</p>
              <p>Order ID: {orderId || 'Not provided'}</p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default StripePayment;