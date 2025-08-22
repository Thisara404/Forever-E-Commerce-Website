import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-destructive text-6xl mb-4">✗</div>
          <CardTitle className="text-2xl text-destructive">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Your payment was cancelled. Your order is still pending and you can try again whenever you're ready.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/place-order')}
              className="w-full"
              variant="destructive"
            >
              Try Payment Again
            </Button>
            <Button 
              onClick={() => navigate('/cart')}
              variant="outline"
              className="w-full"
            >
              Back to Cart
            </Button>
            <Button 
              onClick={() => navigate('/orders')}
              variant="ghost"
              className="w-full"
            >
              View My Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;