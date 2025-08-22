import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useReduxSelectors';
import Title from './Title';
import ProductItem from './ProductItem';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const LatestCollection = () => {
  const { products, loading } = useProducts();
  const [latestProducts, setLatestProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  const handleExploreMore = () => {
    navigate('/collection');
  };

  if (loading) {
    return (
      <div className='my-10'>
        <div className='text-center text-3xl py-8'>
          <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
        </div>
        <div className='flex justify-center items-center h-40'>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading latest collection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='my-10 space-y-8'>
      <div className='text-center space-y-4'>
        <div className='text-3xl py-4'>
          <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
        </div>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl'>
          Stay ahead of the curve with our newest arrivals. Fresh styles, trending colors, and must-have pieces that define the season.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
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
              <div className="text-6xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground mb-4">
                We're working on adding new products. Check back soon!
              </p>
              <Button variant="outline" onClick={handleExploreMore}>
                Browse Categories
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Explore More Button - Always show when there are products */}
      {latestProducts.length > 0 && (
        <div className="text-center pt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleExploreMore}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Explore More Collections
          </Button>
        </div>
      )}
    </div>
  )
}

export default LatestCollection;
