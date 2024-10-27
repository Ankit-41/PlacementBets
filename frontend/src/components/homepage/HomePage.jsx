// HomePage.jsx
import React from 'react';
import Carousel from './Carousel';
import LiveBets from './LiveBets';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Main Content for HomePage */}
      <main className="flex-grow p-6 space-y-8">
    
        <Carousel />
        <LiveBets />
      </main>
    </div>
  );
}
