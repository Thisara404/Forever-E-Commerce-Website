import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

const Contact = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className='text-center pt-10 border-t'>
        <div className='text-3xl font-bold tracking-tight mb-4'>
          <Title text1={'CONTACT'} text2={'US'} />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get in touch with us for any questions, concerns, or career opportunities
        </p>
      </div>

      {/* Main Content */}
      <div className='grid md:grid-cols-2 gap-12 items-start'>
        <div>
          <img 
            className='w-full rounded-lg shadow-lg' 
            src={assets.contact_img} 
            alt="Contact us" 
          />
        </div>
        
        <div className='space-y-6'>
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📍 Our Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Address</h4>
                <p className='text-muted-foreground'>
                  54709 Willms Station <br /> 
                  Suite 350, Washington, USA
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>📞 Tel: (415) 555-0132</p>
                  <p>✉️ Email: admin@forever.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Careers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💼 Careers at Forever
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className='text-muted-foreground'>
                Join our team and help us create fashion that lasts. We're always looking for passionate individuals who share our vision.
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Explore Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🕒 Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewsLetterBox/>
    </div>
  )
}

export default Contact;
