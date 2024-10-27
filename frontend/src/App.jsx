import React from 'react';
import HomePage from './components/homepage/HomePage';
import Leaderboard from './components/LeaderBoard/LeaderBoard';
import ActiveBets from './components/ActiveBets/ActiveBets';
import LandingPage from './components/Aaiye/LandingPage';
import ExpiredBets from './components/ExpiredBets/ExpiredBets';
import MyBets from './components/MyBets/MyBets';

import './App.css';  // If you need to include any global styles

function App() {
  return (
    <div className="App">
      {/* <LandingPage /> */}
      <HomePage />

    
      {/* <Leaderboard /> */}
      {/* <ActiveBets /> */}
    </div>
  );
}

export default App;
