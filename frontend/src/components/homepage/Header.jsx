import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Add this import
import { 
  Briefcase, 
  User, 
  Settings, 
  Book, 
  Share2, 
  BookOpen, 
  MessageSquare, 
  LogOut,
  ChevronRight  // Use ChevronRight instead of ArrowRight or import ArrowRight if needed
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Add useNavigate
import { motion } from 'framer-motion';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Add auth context
  const navigate = useNavigate();
  const tabs = [
    { name: 'Active Bets', path: '/activebets' },
    { name: 'Expired Bets', path: '/expiredbets' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'My Bets', path: '/mybets' },
  ];
  const handleLogout = async () => {
    try {
        await logout();
        navigate('/'); // Redirect to landing page after logout
    } catch (error) {
        console.error('Logout error:', error);
    }
};

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Header Section */}
        <div className="flex items-center justify-around py-2">
          <Link to="/">
            <img src="/mainlogo.svg?height=50&width=50" alt="JobJinx Logo" className="w-21 h-10" />
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-full">
              <Briefcase className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-gray-200">1000 tokens</span>
            </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-yellow-500 text-gray-900">
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-gray-800 text-gray-200 rounded-md shadow-lg border border-gray-700"
                >
                    {/* User info section */}
                    <div className="px-2 py-1.5 border-b border-gray-700">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>

                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <User className="mr-2 h-5 w-5 text-yellow-400" />
                        <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <Settings className="mr-2 h-5 w-5 text-yellow-400" />
                        <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <Book className="mr-2 h-5 w-5 text-yellow-400" />
                        <Link to="/rules">Rules</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <Share2 className="mr-2 h-5 w-5 text-yellow-400" />
                        <Link to="/refer">Refer and Earn</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <BookOpen className="mr-2 h-5 w-5 text-yellow-400" />
                        <a href="https://placement-portal-frontend-xi.vercel.app/" target="_blank" rel="noopener noreferrer">
                            Resources
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <MessageSquare className="mr-2 h-5 w-5 text-yellow-400" />
                        <Link to="/chatbot">Chat Bot</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-700" />
                    
                    {/* Logout button */}
                    <DropdownMenuItem 
                        className="flex items-center p-2 hover:bg-red-600/20 text-red-400 transition-colors cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          
        </div>
      </div>

      {/* Navigation Section - Exactly as in BetTypes.jsx */}
      <nav className="bg-yellow-500 text-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Check out with Arrow */}
            <div className="flex-shrink-0">
              <span className="flex items-center font-bold text-xl">
                Check out
                <motion.div
                  className="ml-4"
                  animate={{ x: [0, 20, 0], scale: 1.2 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </motion.div>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive
                      ? 'bg-yellow-600 text-white'
                      : 'hover:bg-yellow-600 hover:text-white'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tab.name}
                </NavLink>
              ))}
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
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive
                      ? 'bg-yellow-600 text-white'
                      : 'hover:bg-yellow-600 hover:text-white'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tab.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
