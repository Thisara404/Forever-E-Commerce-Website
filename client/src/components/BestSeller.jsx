import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useReduxSelectors';
import Title from './Title';
import ProductItem from './ProductItem';
import { Card, CardContent } from './ui/card';

const BestSeller = () => {
  const { products, loading } = useProducts();
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const bestProducts = products.filter((item) => item.bestseller);
      setBestSeller(bestProducts.slice(0, 5));
    }
  }, [products]);

  if (loading) {
    return (
      <div className='my-10'>
        <div className='text-center text-3xl py-8'>
          <Title text1={'BEST'} text2={'SELLERS'}/>
        </div>
        <div className='flex justify-center items-center h-40'>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading bestsellers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='my-10 space-y-8'>
      <div className='text-center space-y-4'>
        <div className='text-3xl py-4'>
          <Title text1={'BEST'} text2={'SELLERS'}/>
        </div>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl'>
          Our Best Sellers are loved for a reason. These top-rated products are flying off the shelves and making waves with real users. Tried, tested, and trusted — shop the gear everyone's talking about.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <ProductItem 
              key={item._id || index} 
              id={item._id} 
              name={item.name} 
              image={item.image} 
              price={item.price}
            />
          ))
        ) : (
          <Card className='col-span-full'>
            <CardContent className='text-center py-16'>
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">No Bestsellers Yet</h3>
              <p className="text-muted-foreground">
                Check back soon for our most popular products!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default BestSeller;
