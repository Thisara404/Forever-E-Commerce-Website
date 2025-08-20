import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import heroImg2 from "../assets/456.jpg";
import heroImg3 from "../assets/457.jpg";
import heroImg4 from "../assets/g1.png";
import heroImg5 from "../assets/g2.png";
import heroImg6 from "../assets/g3.png";

const heroImages = [ heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img
        className="w-full sm:w-1/2 object-cover transition-opacity duration-500 ease-in-out"
        src={heroImages[currentImageIndex]}
        alt="Hero images"
      />
    </div>
  );
};

export default Hero;
