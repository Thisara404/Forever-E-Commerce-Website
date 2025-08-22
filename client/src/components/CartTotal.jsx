import React from 'react';
import { useCart } from '../hooks/useReduxSelectors';
import Title from './Title';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

const CartTotal = () => {
  const { getCartAmount } = useCart();
  const currency = 'LKR';
  const delivery_fee = 10;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          <Title text1={'CART'} text2={'TOTALS'}/>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{currency} {getCartAmount()}.00</span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span>Shipping Fee</span>
          <span>{currency} {delivery_fee}.00</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default CartTotal;
