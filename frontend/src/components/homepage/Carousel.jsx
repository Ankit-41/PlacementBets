'use client'

import React from 'react'
import Slider from 'react-slick'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const carouselData = [
  {
    title: 'NBA - 3rd Quarter Payout',
    subtitle: 'Insurance For Bad Beats',
    promo: 'HOT',
    buttonText: 'Bet Now',
    image: '/placeholder.svg?height=200&width=300',
    odds: '+150',
    bgColor: 'bg-gradient-to-r from-blue-600 to-blue-800'
  },
  {
    title: 'NFL - Double Winnings',
    subtitle: 'Rams vs. Vikings',
    promo: 'NEW',
    buttonText: 'Bet Now',
    image: '/event_image.jpg?height=200&width=300',
    odds: '-110',
    bgColor: 'bg-gradient-to-r from-green-600 to-green-800'
  },
  {
    title: 'MLB - Early Payout',
    subtitle: 'Yankees vs. Red Sox',
    promo: 'BOOST',
    buttonText: 'Bet Now',
    image: '/placeholder.svg?height=200&width=300',
    odds: '+200',
    bgColor: 'bg-gradient-to-r from-red-600 to-red-800'
  },
  {
    title: 'UFC - Knockout Special',
    subtitle: 'McGregor vs. Poirier',
    promo: 'EXCLUSIVE',
    buttonText: 'Bet Now',
    image: '/placeholder.svg?height=200&width=300',
    odds: '+300',
    bgColor: 'bg-gradient-to-r from-purple-600 to-purple-800'
  }
]

const CustomArrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
      direction === 'prev' ? '-left-4' : '-right-4'
    } bg-white bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full shadow-lg transition-all duration-200`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="text-white h-6 w-6" />
    ) : (
      <ChevronRight className="text-white h-6 w-6" />
    )}
  </button>
)

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: <CustomArrow direction="prev" />,
  nextArrow: <CustomArrow direction="next" />,
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
  swipe: true,
  autoplay: true,
  autoplaySpeed: 5000,
}

export default function EnhancedCarousel() {
  return (
    <div className="relative px-6 py-8 mx-auto max-w-[1400px]">
      <style jsx global>{`
        .slick-dots li button:before {
          color: #ffffff;
        }
        .slick-dots li.slick-active button:before {
          color: #fbbf24;
        }
      `}</style>
      <Slider {...sliderSettings}>
        {carouselData.map((item, index) => (
          <div key={index} className="px-2">
            <Card className={`h-80 ${item.bgColor} rounded-xl overflow-hidden shadow-2xl relative group transition-all duration-300 transform hover:scale-105`}>
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-white bg-yellow-500 px-2 py-1 rounded-full">
                      {item.promo}
                    </span>
                    <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400 transition-colors">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-200 mb-4">{item.subtitle}</p>
                </div>
                <div className="flex justify-between items-end">
                  <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 transition-colors">
                    {item.buttonText}
                  </Button>
                  <span className="text-3xl font-bold text-white">{item.odds}</span>
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover z-[-1]" />
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  )
}