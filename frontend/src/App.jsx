// App.jsx
import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import Layout from './components/Finder/Layout';
import Header from './components/homepage/Header';
import HomePage from './components/homepage/HomePage';
import Leaderboard from './components/LeaderBoard/LeaderBoard';
import UserProfile from './components/userProfile/UserProfile';
import ActiveBets from './components/ActiveBets/ActiveBets';
import ExpiredBets from './components/ExpiredBets/ExpiredBets';
import MyBets from './components/MyBets/MyBets';
import LandingPage from './components/Aaiye/LandingPage';
import IndividualSearch from './components/IndividualSearch/IndividualSearch';
import FooterDescription from './components/homepage/FooterDescription';
import AdminPanel from './components/adminPanel/adminPanel';
import { useAuth } from './contexts/AuthContext';
import Unauthorized from './components/adminPanel/unauthorized';
import InfoModal from './components/Aaiye/InfoModal';
import FarewellPage from './components/Farewell/farewell';
const AdminProtectedLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (user.role !== 'admin') {
    return <Unauthorized />;
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

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/home" />;
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
  const [showInfoModal, setShowInfoModal] = useState(true); // Modal visibility state
  return (
    <AuthProvider>
      <Router>
        {/* <Layout> */}
          <Routes>
            <Route path="/home" element={<FarewellPage />} />

            <Route path="/" element={
              <ProtectedLayout>
                <FarewellPage />
              </ProtectedLayout>
            } />
            {/* <Route path="/home" element={<LandingPage />} />

            <Route path="/" element={
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            } /> */}

            {/* <Route path="/leaderboard" element={
              <ProtectedLayout>
                <Leaderboard />
              </ProtectedLayout>
            } />

            <Route path="/user/:userId" element={
              <ProtectedLayout>
                <UserProfile />
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
            <Route path="/individualSearch" element={
              <ProtectedLayout>
                <IndividualSearch />
              </ProtectedLayout>
            } />
            <Route path="/adminPanel" element={
              <AdminProtectedLayout>
                <AdminPanel />
              </AdminProtectedLayout>
            } />
            <Route path="/guide" element={
              <AdminProtectedLayout>
                 <InfoModal
                isVisible={showInfoModal}
                onClose={() => {
                    setShowInfoModal(false);
                    navigate('/'); // Redirect to home page on modal close
                }}
            />
              </AdminProtectedLayout>
            } />

            <Route path="/mybets" element={
              <ProtectedLayout>
                <MyBets />
              </ProtectedLayout>
            } /> */}

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        {/* </Layout> */}
      </Router>
    </AuthProvider >
  );
}

export default App;