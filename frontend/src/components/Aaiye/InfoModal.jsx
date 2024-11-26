import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, Users, History, Search } from 'lucide-react';

function InfoModal({ isVisible, onClose }) {
  if (!isVisible) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gray-800 rounded-xl w-full max-w-3xl border border-gray-700 overflow-hidden"
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <motion.h2 
              className="text-xl sm:text-3xl font-bold text-emerald-400 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Welcome to{' '}
              <AnimatePresence>
                {['J', 'o', 'b', 'J', 'i', 'n', 'x'].map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </AnimatePresence>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="ml-2"
              >
                🎯
              </motion.span>
            </motion.h2>
            <button
              className="text-gray-400 hover:text-gray-300 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6 text-gray-300 overflow-y-auto max-h-[70vh] sm:max-h-[60vh] pr-2 sm:pr-4 text-sm sm:text-base">
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                <Users className="mr-2 text-emerald-400 h-5 w-5" /> Quick Navigation
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-2">(Available in navbar/hamburger menu)</p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">📋 See Shortlists</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>View all shortlists across active companies</li>
                    <li>Filter candidates by branch</li>
                    <li>Quick search via enrollment number or name</li>
                    <li>Track total shortlists of Students in real-time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">🎓 Past Placements</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Explore comprehensive placement history and alumni contacts</li>
                    <li>Filter by:
                      <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                        <li>Branch & Session year</li>
                        <li>Acceptance status & PPO offers</li>
                        <li>Company name</li>
                      </ul>
                    </li>
                    <li>Search using student name, enrollment number, or company</li>
                    <li>Connect with placed alumni for guidance</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2 text-emerald-400 h-5 w-5" /> Predict & Win
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Start with 100000 welcome tokens</li>
                <li>Place strategic bets on placement outcomes - bet "For" or "Against"</li>
                <li>Watch stake multipliers update in real-time based on community betting</li>
                <li>Track your winning streak and climb our dynamic leaderboard</li>
              </ul>
            </motion.section>

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                <Target className="mr-2 text-emerald-400 h-5 w-5" /> How It Works
              </h3>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li><span className="font-medium">Connect & Start:</span> Sign up with your IITR email and get 1000 tokens instantly</li>
                <li><span className="font-medium">Choose & Bet:</span> Browse active drives and place strategic bets with dynamic stake multipliers</li>
                <li><span className="font-medium">Track & Win:</span> Monitor results live, collect winnings, and climb the leaderboard</li>
              </ol>
            </motion.section>

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                <Search className="mr-2 text-emerald-400 h-5 w-5" /> Pro Tips
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Keep an eye on multipliers - they update automatically based on betting patterns</li>
                <li>Higher multipliers = bigger potential returns</li>
                <li>Maintain winning streaks to climb leaderboard rankings</li>
                <li>Use placement insights to make informed predictions</li>
              </ul>
            </motion.section>
          </div>

          <motion.div 
            className="mt-4 sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-2.5 sm:py-3 rounded-full text-base sm:text-lg transition-colors"
              onClick={onClose}
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default InfoModal;