import React from 'react';
import { assets } from '../assets/assets';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-40">
      <div className='container mx-auto px-4 py-10'>
        <div className='grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 text-sm'>
          {/* Company Info */}
          <div className="space-y-4">
            <img src={assets.logo} className='mb-5 w-32' alt="Forever Logo" />
            <p className='w-full md:w-2/3 text-muted-foreground leading-relaxed'>
              Discover timeless style and effortless fashion with our carefully curated collections. 
              Designed for every moment, made for you.
            </p>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                📘
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                🐦
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                📷
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className='text-lg font-semibold text-foreground'>COMPANY</h3>
            <ul className='space-y-2'>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                  Home
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                  About us
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                  Delivery
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                  Privacy policy
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className='text-lg font-semibold text-foreground'>GET IN TOUCH</h3>
            <div className='space-y-2 text-muted-foreground'>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>+94-78-98-54-096</span>
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span>
                <span>thisarad28@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="text-center">
          <p className='text-sm text-muted-foreground'>
            Copyright 2025@ forever.com - All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
