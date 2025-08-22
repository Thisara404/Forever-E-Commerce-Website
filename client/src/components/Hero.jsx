import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Import hero images
import heroImg2 from "../assets/456.jpg";
import heroImg3 from "../assets/457.jpg";
import heroImg4 from "../assets/g1.png";
import heroImg5 from "../assets/g2.png";
import heroImg6 from "../assets/g3.png";

const heroImages = [heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShopNow = () => {
    navigate('/collection');
  };

  return (
    <Card className="border-0 shadow-none bg-gradient-to-r from-background to-muted/50">
      <div className="flex flex-col sm:flex-row items-center min-h-[80vh]">
        {/* Hero Left Side */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-center sm:text-left space-y-6 px-6">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-8 md:w-11 h-[2px] bg-foreground"></div>
              <Badge variant="outline" className="font-medium text-sm">
                OUR BESTSELLERS
              </Badge>
            </div>

            <h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
              Latest Arrivals
            </h1>

            <p className="text-muted-foreground text-lg max-w-md">
              Discover our newest collection of trendy and stylish fashion pieces.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Button 
                onClick={handleShopNow}
                size="lg" 
                className="font-semibold hover:scale-105 transition-transform"
              >
                SHOP NOW
              </Button>
              <div className="w-8 md:w-11 h-[1px] bg-foreground"></div>
            </div>
          </div>
        </div>

        {/* Hero Right Side */}
        <div className="w-full sm:w-1/2 relative overflow-hidden">
          {isLoading ? (
            <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <img
                className="w-full h-auto object-cover transition-opacity duration-500 ease-in-out rounded-lg shadow-lg"
                src={heroImages[currentImageIndex]}
                alt={`Hero ${currentImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = assets.hero_img || "/placeholder-hero.jpg";
                }}
              />

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-primary scale-110"
                        : "bg-primary/30 hover:bg-primary/60"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Hero;
