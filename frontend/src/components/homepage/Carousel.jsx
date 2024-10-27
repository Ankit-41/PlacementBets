import React from 'react';
import Slider from 'react-slick';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselData = [
  {
    title: 'NBA - 3rd Quarter Payout',
    subtitle: 'Insurance For Bad Beats',
    promo: 'Promo',
    buttonText: 'Bet Now',
    image: '/event_image.jpg',
    bgColor: 'bg-gray-800'
  },
  {
    title: 'NBA - 3rd Quarter Payout',
    subtitle: 'Insurance For Bad Beats',
    promo: 'Promo',
    buttonText: 'Bet Now',
    image: '/event_image.jpg',
    bgColor: 'bg-gray-800'
  },
  {
    title: 'NBA - 3rd Quarter Payout',
    subtitle: 'Insurance For Bad Beats',
    promo: 'Promo',
    buttonText: 'Bet Now',
    image: '/event_image.jpg',
    bgColor: 'bg-gray-800'
  },
  {
    title: 'NFL - Double Winnings',
    subtitle: 'Rams vs. Vikings',
    promo: 'Promo',
    buttonText: 'Bet Now',
    image: '/event_image.jpg',
    bgColor: 'bg-gray-800'
  }
];

const CustomArrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
      direction === 'prev' ? '-left-12' : '-right-12'
    } hover:scale-110 transition-transform duration-200 bg-gray-900 p-3 rounded-full shadow-lg`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="text-yellow-400 h-6 w-6 hover:text-yellow-500 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={direction === 'prev' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

const sliderSettings = {
  dots: false,
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
};

export default function Carousel() {
  return (
    <div className="relative px-3 sm:px-2 py-0 mx-auto max-w-[1400px]">
      <style jsx global>{`
        .slick-track {
          margin-left: 0;
          margin-right: 0;
        }
        .slick-prev,
        .slick-next {
          z-index: 10;
        }
        .slick-prev {
          left: -48px;
        }
        .slick-next {
          right: -48px;
        }
        .slick-prev:before,
        .slick-next:before {
          display: none;
        }
        .slick-list {
          margin: 0 -8px;
        }
        .slick-slide > div {
          margin: 0 8px;
        }
      `}</style>
      <Slider {...sliderSettings}>
        {carouselData.map((item, index) => (
          <div key={index} className="px-2">
            <Card className="h-64 flex bg-gray-800 bg-opacity-80 p-4 rounded-xl overflow-hidden shadow-2xl relative">
              <div className="flex flex-grow space-x-4">
                <div className="flex flex-col justify-center space-y-2 w-2/3">
                  <span className="text-sm font-medium text-yellow-500 bg-yellow-700 px-2 py-1 rounded-md inline-block">
                    {item.promo}
                  </span>
                  <h2 className="text-lg font-bold text-gray-200">{item.title}</h2>
                  <p className="text-sm text-gray-300">{item.subtitle}</p>
                  <Button className="mt-4 w-max bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                    {item.buttonText}
                  </Button>
                </div>
                <div className="w-1/3 flex justify-end">
                  <img src={item.image} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}