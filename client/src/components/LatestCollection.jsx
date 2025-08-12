import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products, loading, navigate } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Sort by date (newest first) and take first 10
            const sortedProducts = [...products]
                .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                .slice(0, 10);
            setLatestProducts(sortedProducts);
        }
    }, [products]); // Add products as dependency

    const handleExploreMore = () => {
        navigate('/collection');
    };

    if (loading) {
        return (
            <div className='my-10'>
                <div className='text-center py-8 text-3xl'>
                    <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
                </div>
                <div className='flex justify-center items-center h-40'>
                    <div className='text-gray-500'>Loading latest products...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover our Latest Collection – a perfect blend of innovation and style. Handpicked just for you, these fresh arrivals are designed to upgrade your everyday tech and elevate your lifestyle. Don't miss what's trending right now.
                </p>
            </div>

            {/* Rendering products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.length > 0 ? (
                    latestProducts.map((item, index) => (
                        <ProductItem 
                            key={item._id || index} 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price}
                        />
                    ))
                ) : (
                    <div className='col-span-full text-center text-gray-500 py-8'>
                        No products available
                    </div>
                )}
            </div>

            {/* Explore More Button */}
            {latestProducts.length > 0 && (
                <div className='text-center mt-10'>
                    <button 
                        onClick={handleExploreMore}
                        className='bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-300 border border-black hover:border-gray-800'
                    >
                        EXPLORE MORE
                    </button>
                </div>
            )}
        </div>
    )
}

export default LatestCollection
