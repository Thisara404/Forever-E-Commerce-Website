import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useReduxSelectors';
import Title from './Title';
import ProductItem from './ProductItem';

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
          <div className='text-gray-500'>Loading bestsellers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Our Best Sellers are loved for a reason. These top-rated gadgets are flying off the shelves and making waves with real users. Tried, tested, and trusted — shop the gear everyone's talking about.
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
          <div className='col-span-full text-center text-gray-500 py-8'>
            No bestsellers available
          </div>
        )}
      </div>
    </div>
  )
}

export default BestSeller
