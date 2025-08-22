import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useProducts, useAuth } from '../hooks/useReduxSelectors';
import { assets } from '../assets/assets';
import RelatedProduts from '../components/RelatedProduts';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const Product = () => {
  const { productID } = useParams();
  const dispatch = useDispatch();
  const { products } = useProducts();
  const { token } = useAuth();
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const currency = 'LKR';

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productID) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ 
        itemId: productData._id, 
        size, 
        quantity: 1 
      })).unwrap();
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productID, products]);

  return productData ? (
    <div className='border-t pt-10 space-y-12'>
      {/* Product Section */}
      <div className='grid lg:grid-cols-2 gap-12'>
        {/* Product Images */}
        <div className='space-y-4'>
          {/* Main Image */}
          <div className='aspect-square overflow-hidden rounded-lg border'>
            <img 
              className='w-full h-full object-cover' 
              src={image} 
              alt={productData.name} 
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className='grid grid-cols-4 gap-3'>
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => setImage(item)}
                className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                  image === item ? 'border-primary' : 'border-muted hover:border-muted-foreground'
                }`}
              >
                <img 
                  src={item} 
                  alt={`${productData.name} ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold mb-3'>{productData.name}</h1>
            
            {/* Rating */}
            <div className='flex items-center gap-2 mb-4'>
              <div className="flex items-center">
                {[...Array(4)].map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star" className="w-4 h-4" />
                ))}
                <img src={assets.star_dull_icon} alt="star" className="w-4 h-4" />
              </div>
              <span className='text-sm text-muted-foreground'>(122 reviews)</span>
            </div>

            <p className='text-3xl font-bold text-primary mb-4'>
              {currency} {productData.price}
            </p>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className='text-muted-foreground leading-relaxed'>
              {productData.description}
            </p>
          </div>

          {/* Size Selection */}
          <div className='space-y-3'>
            <h3 className="font-semibold">Select Size</h3>
            <div className='flex flex-wrap gap-2'>
              {productData.sizes.map((item, index) => (
                <Button
                  key={index}
                  variant={item === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(item)}
                  className="min-w-12"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <Button 
            onClick={handleAddToCart} 
            size="lg"
            className='w-full sm:w-auto'
          >
            Add to Cart
          </Button>

          <Separator />

          {/* Product Features */}
          <div className="space-y-3">
            <h3 className="font-semibold">Product Features</h3>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>100% Original product</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">🚚</Badge>
                <span>Cash on delivery available</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">↩️</Badge>
                <span>Easy return and exchange policy within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Section */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Button variant="default" size="sm">Description</Button>
            <Button variant="ghost" size="sm">Reviews (122)</Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4 text-muted-foreground'>
          <p>
            Elevate your everyday style with our Classic Cotton Crewneck T-Shirt — a wardrobe essential designed for comfort and versatility. Crafted from soft, breathable 100% cotton, this tee features a relaxed fit, reinforced stitching, and a timeless crew neckline.
          </p>
          <p>
            Stay cozy without compromising on style. Our Essential Fleece Pullover Hoodie is made with a soft cotton-blend fleece that keeps you warm and comfortable all day. Designed with a relaxed fit, spacious front pocket, and adjustable drawstring hood — it's your go-to layer for chilly days, casual outings, or lounging at home.
          </p>
        </CardContent>
      </Card>

      {/* Related Products */}
      <RelatedProduts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <span className="ml-3 text-muted-foreground">Loading product...</span>
    </div>
  )
}

export default Product;
