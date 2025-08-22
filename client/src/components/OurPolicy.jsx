import React from 'react';
import { assets } from '../assets/assets';
import { Card, CardContent } from './ui/card';

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: 'Easy Exchange Policy',
      description: 'We offer hassle free exchange policy'
    },
    {
      icon: assets.quality_icon,
      title: '7 Days Return Policy',
      description: 'We provide 7 days free return policy'
    },
    {
      icon: assets.support_img,
      title: 'Best Customer Support',
      description: 'We provide 24/7 customer support'
    }
  ];

  return (
    <div className='py-20'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {policies.map((policy, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-muted/30 hover:bg-muted/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={policy.icon} 
                  className='w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300' 
                  alt={policy.title}
                />
              </div>
              <div className="space-y-2">
                <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                  {policy.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {policy.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy;
