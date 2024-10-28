// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/homepage/Header';
import HomePage from './components/homepage/HomePage';
import Leaderboard from './components/LeaderBoard/LeaderBoard';
import ActiveBets from './components/ActiveBets/ActiveBets';
import ExpiredBets from './components/ExpiredBets/ExpiredBets';
import MyBets from './components/MyBets/MyBets';
import LandingPage from './components/Aaiye/LandingPage';
import FooterDescription from './components/homepage/FooterDescription';
import { useAuth } from './contexts/AuthContext';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <FooterDescription />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/home" element={
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          } />
          
          <Route path="/leaderboard" element={
            <ProtectedLayout>
              <Leaderboard />
            </ProtectedLayout>
          } />
          
          <Route path="/activebets" element={
            <ProtectedLayout>
              <ActiveBets />
            </ProtectedLayout>
          } />
          
          <Route path="/expiredbets" element={
            <ProtectedLayout>
              <ExpiredBets />
            </ProtectedLayout>
          } />
          
          <Route path="/mybets" element={
            <ProtectedLayout>
              <MyBets />
            </ProtectedLayout>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;