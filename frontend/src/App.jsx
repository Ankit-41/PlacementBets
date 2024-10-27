// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Header from './components/homepage/Header';
import HomePage from './components/homepage/HomePage';
import Leaderboard from './components/LeaderBoard/LeaderBoard';
import ActiveBets from './components/ActiveBets/ActiveBets';
import ExpiredBets from './components/ExpiredBets/ExpiredBets';
import MyBets from './components/MyBets/MyBets';
import LandingPage from './components/Aaiye/LandingPage';
import LimitedActiveBets from './components/Aaiye/LimitedActiveBets';
// import LandingPage from './components/Aaiye/LandingPage';
// Footer (assuming FooterDescription is the footer)
import FooterDescription from './components/homepage/FooterDescription';

import './App.css'; // Global styles

function App() {
  return (
    <Router>
      <div className="App">
        <LandingPage />
        {/* Header appears on all pages */}
        <Header />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/activebets" element={<ActiveBets />} />
          <Route path="/expiredbets" element={<ExpiredBets />} />
          <Route path="/mybets" element={<MyBets />} />
          <Route path="/limitedactivebets" element={<LimitedActiveBets />} />
          {/* Add more routes as needed */}
        </Routes>

        {/* Footer appears on all pages */}
        <FooterDescription />
      </div>
    </Router>
  );
}

export default App;
