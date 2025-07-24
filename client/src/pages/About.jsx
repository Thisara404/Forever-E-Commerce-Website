import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-normal gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to Forever. 
            Where timeless style meets everyday comfort. 
            At Forever, we believe fashion should do more than just follow trends — it should reflect who you are. 
            Our mission is simple: to create clothing that feels good, looks great, and lasts beyond the season. 
            From classic staples to modern essentials, every piece in our collection is designed with attention to detail, quality craftsmanship, and a deep love for effortless style. 
            Whether you're dressing for work, play, or everything in between, Forever has something made just for you. 
            We’re more than a brand — we’re a mindset. Rooted in simplicity. Inspired by you. Built to last.
            Wear it your way. Make it Forever.</p>
          <p>At Forever, we don’t just sell clothes — we create style that moves with you.
            Born from the idea that great fashion should be effortless, our brand is all about clean lines, bold vibes, and pieces that feel as good as they look. 
            Whether you're dressing up, chilling out, or making a statement, Forever is here to fit your mood, your moment, and your lifestyle.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At Forever, our mission is to create timeless fashion that empowers individuality, inspires confidence, and stands the test of time. We believe in crafting high-quality clothing that not only looks good but feels right — for you and for the world around you.

We’re here to redefine everyday style with purpose — blending modern design, comfort, and conscious choices to build a wardrobe that’s made to last.

Style that’s yours. Quality that’s forever.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>At Forever, we stand by the quality of every stitch, fabric, and finish.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Premium materials. Careful craftsmanship. Quality you can trust.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Let me know if you’d like a slightly warmer, bolder, or more professional variation!</p>
        </div>
      </div>

      <NewsLetterBox/>
      
    </div>
  )
}

export default About
