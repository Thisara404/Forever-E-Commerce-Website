import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const ProductItem = ({ id, image, name, price }) => {
  const currency = 'LKR';

  return (
    <Link onClick={() => scrollTo(0, 0)} to={`/product/${id}`}>
      <Card className="group cursor-pointer overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="overflow-hidden">
          <img 
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out" 
            src={image[0]} 
            alt={name}
          />
        </div>
        <CardContent className="p-3">
          <p className="text-sm text-gray-700 mb-1 line-clamp-2">{name}</p>
          <p className="text-sm font-medium text-gray-900">{currency}{price}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductItem;
