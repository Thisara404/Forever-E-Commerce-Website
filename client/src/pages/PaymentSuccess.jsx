import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart, clearCartOnServer } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Clear cart on server first
        await dispatch(clearCartOnServer()).unwrap();
      } catch (error) {
        console.warn('Failed to clear cart on server:', error);
      }
      
      // Clear local cart
      dispatch(clearCart());
      
      // Show success message
      toast.success('Payment completed successfully!');
    };

    handlePaymentSuccess();
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <CardTitle className="text-2xl text-green-800">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-green-700">
              Your order has been confirmed and payment processed successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly.
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Redirecting to orders page in:
            </p>
            <div className="text-2xl font-bold text-primary">
              {countdown}s
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/orders')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            View My Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;