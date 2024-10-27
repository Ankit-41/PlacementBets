import React, { useState } from 'react';
import Header from './Header';
import Carousel from './Carousel';
import BetTypes from './BetTypes';
import LiveBets from './LiveBets';
import FooterDescription from './FooterDescription';
import Leaderboard from '../LeaderBoard/LeaderBoard';
import ActiveBets from '../ActiveBets/ActiveBets';
import ExpiredBets from '../ExpiredBets/ExpiredBets';
import MyBets from '../MyBets/MyBets';
// import MyBets from './MyBets';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Header */}
      <Header />

      {/* Added BetTypes below Header */}
      <BetTypes activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-grow p-6 space-y-8">
        {activeTab === 'home' ? (
          <>
            <Carousel />
            <LiveBets />
          </>
        ) : (
          <>
            {activeTab === 'activebets' && <ActiveBets />}
            {activeTab === 'expiredbets' && <ExpiredBets />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'mybets' && <MyBets />}
          </>
        )}
      </main>

      {/* Footer */}
      <FooterDescription />
    </div>
  );
}
