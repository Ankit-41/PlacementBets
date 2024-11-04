// components/homepage/HomePage.jsx
import React from 'react';
import Carousel from './Carousel';
import LiveBets from './LiveBets';
export default function HomePage() {
  return (
    <div className="flex-grow p-6 space-y-8">
      <Carousel />
      <LiveBets />
      
    </div>
  );
}