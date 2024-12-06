// components/skeletons/CarouselCardSkeleton.jsx
'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Slider from 'react-slick'
import { cn } from "@/lib/utils"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export function CarouselCardSkeleton({ className }) {
  return (
    <div className={cn("px-2", className)}>
      <Card className="h-64 md:h-80 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 rounded-xl overflow-hidden shadow-2xl relative">
        <CardContent className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10">
          <div>
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <div className="h-5 w-20 bg-gray-600 rounded-xl animate-pulse"></div>
            </div>
            <div className="h-7 md:h-8 w-48 bg-gray-600 rounded animate-pulse mb-1 md:mb-2"></div>
            <div className="h-4 md:h-5 w-32 bg-gray-600 rounded animate-pulse mb-2 md:mb-4"></div>
            
            <div className="flex items-center mb-1 md:mb-2">
              <div className="h-4 w-4 bg-gray-600 rounded animate-pulse mr-2"></div>
              <div className="h-4 w-36 bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-600 rounded animate-pulse mr-2"></div>
              <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-2 md:mt-4">
            <div className="h-8 md:h-10 w-full bg-gray-600 rounded animate-pulse"></div>
          </div>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute top-0 right-0 h-16 w-16 md:h-24 md:w-24 m-5">
          <div className="w-full h-full bg-gray-600 rounded animate-pulse"></div>
        </div>
      </Card>
    </div>
  )
}

export function CarouselSkeleton({ count = 4 }) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    swipe: false
  }

  return (
    <div className="relative px-4 py-6 mx-auto max-w-[1200px]">
      <style jsx global>{`
        .slick-dots li button:before {
          color: #ffffff;
        }
        .slick-dots li.slick-active button:before {
          color: #10b981;
        }
      `}</style>
      <Slider {...sliderSettings}>
        {Array.from({ length: count }).map((_, index) => (
          <CarouselCardSkeleton key={index} />
        ))}
      </Slider>
    </div>
  )
}