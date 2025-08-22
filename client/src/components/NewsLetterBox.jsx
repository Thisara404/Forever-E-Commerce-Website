import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'react-toastify';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardContent className="p-8">
        <div className='text-center space-y-6'>
          <div className="space-y-2">
            <h2 className='text-2xl font-bold text-foreground'>
              Subscribe now & get 20% off
            </h2>
            <p className='text-muted-foreground'>
              Stay in the loop! Subscribe and receive 20% off your first purchase as a welcome gift.
            </p>
          </div>
          
          <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto'>
            <Input
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              disabled={loading}
            />
            <Button 
              type='submit' 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Subscribing...' : 'SUBSCRIBE'}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsLetterBox;
