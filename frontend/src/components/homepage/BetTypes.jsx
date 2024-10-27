import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // Ensure this path is correct
import { ArrowRight } from 'lucide-react'; // Import ArrowRight icon
import { motion } from 'framer-motion'; // For animation

const BetTypes = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = ['Active Bets', 'Expired Bets', 'Leaderboard', 'My Bets'];

  const handleTabClick = (tab) => {
    const tabKey = tab.toLowerCase().replace(' ', ''); // e.g., 'activebets'
    setActiveTab(tabKey);
    setIsMenuOpen(false); // Close the mobile menu after selection
  };

  return (
    <nav className="bg-yellow-500 text-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="flex-shrink-0">
            {/* Updated to include "Check out" text followed by an animated, longer arrow */}
            <span className="flex items-center font-bold text-xl">
              Check out
              {/* Animated Arrow */}
              <motion.div
                className="ml-20"
                animate={{ x: [0, 20, 0], scale: [1.2, 1.2, 1.2] }} // Move right by 10px and scale up slightly
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ArrowRight className="h-6 w-10 text-gray-900" /> {/* Increased width */}
              </motion.div>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {tabs.map((tab) => {
              const tabKey = tab.toLowerCase().replace(' ', '');
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'bg-yellow-600 text-white'
                      : 'hover:bg-yellow-600 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed: Hamburger Menu */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // Icon when menu is open: X Mark
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {tabs.map((tab) => {
              const tabKey = tab.toLowerCase().replace(' ', '');
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? 'bg-yellow-600 text-white'
                      : 'hover:bg-yellow-600 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default BetTypes;
