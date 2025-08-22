import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

const About = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className='text-center pt-8 border-t'>
        <div className='text-3xl font-bold tracking-tight mb-4'>
          <Title text1={'ABOUT'} text2={'US'}/>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid md:grid-cols-2 gap-12 items-start'>
        <div className="space-y-6">
          <img 
            className='w-full rounded-lg shadow-lg' 
            src={assets.about_img} 
            alt="About Forever" 
          />
        </div>
        
        <div className='space-y-6'>
          <Card>
            <CardContent className="p-6 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Forever. Where timeless style meets everyday comfort. 
                At Forever, we believe fashion should do more than just follow trends — it should reflect who you are. 
                Our mission is simple: to create clothing that feels good, looks great, and lasts beyond the season.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                From classic staples to modern essentials, every piece in our collection is designed with attention to detail, quality craftsmanship, and a deep love for effortless style. 
                Whether you're dressing for work, play, or everything in between, Forever has something made just for you.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                We're more than a brand — we're a mindset. Rooted in simplicity. Inspired by you. Built to last.
                <strong className="text-foreground"> Wear it your way. Make it Forever.</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                At Forever, our mission is to create timeless fashion that empowers individuality, inspires confidence, and stands the test of time. We believe in crafting high-quality clothing that not only looks good but feels right — for you and for the world around you.
              </p>
              <Separator className="my-4" />
              <p className="text-muted-foreground leading-relaxed">
                We're here to redefine everyday style with purpose — blending modern design, comfort, and conscious choices to build a wardrobe that's made to last.
              </p>
              <p className="font-medium text-foreground mt-4">
                Style that's yours. Quality that's forever.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="space-y-8">
        <div className='text-center'>
          <div className='text-2xl font-bold tracking-tight'>
            <Title text1={'WHY'} text2={'CHOOSE US'}/>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                At Forever, we stand by the quality of every stitch, fabric, and finish. Premium materials. Careful craftsmanship. Quality you can trust.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Convenience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Shop with ease and confidence. Fast shipping, easy returns, and customer service that's always here to help.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Exceptional Customer Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Your satisfaction is our priority. We're committed to providing personalized service and support every step of the way.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewsLetterBox/>
    </div>
  )
}

export default About
