'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, 
  User, 
  Settings, 
  Book, 
  Share2, 
  BookOpen, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Flame,
  History,
  Trophy,
  Target
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const tabs = [
    { name: 'Active Bets', path: '/activebets', icon: <Flame className="w-4 h-4 mr-1" /> },
    { name: 'Expired Bets', path: '/expiredbets', icon: <History className="w-4 h-4 mr-1" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-4 h-4 mr-1" /> },
    { name: 'My Bets', path: '/mybets', icon: <Target className="w-4 h-4 mr-1" /> },
  ]

  const offers = [
    "🔥 New User Bonus: 100% Match up to $500!",
    "🏆 Refer a Friend: Get $50 Free Bet!",
    "⚽ Champions League Final: Double Your Winnings!",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length)
    }, 5000)

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formattedTokens = user?.tokens?.toLocaleString() || '0'

  return (
    <>
      <div className={`h-[${isSticky ? '164px' : '0px'}] transition-all duration-300`} />
      <header className={`w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header Section */}
          <div className="flex items-center justify-between py-3">
            <Link to="/home" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">JobJinx</span>
            </Link>

            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2 bg-gray-800 p-2 rounded-full"
                key={formattedTokens}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                <Briefcase className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-gray-200">
                  {formattedTokens} tokens
                </span>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-green-500 text-gray-900">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-800 text-gray-200 rounded-md shadow-lg border border-gray-700"
                >
                  <div className="px-2 py-1.5 border-b border-gray-700">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <User className="mr-2 h-5 w-5 text-green-400" />
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <Settings className="mr-2 h-5 w-5 text-green-400" />
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <Book className="mr-2 h-5 w-5 text-green-400" />
                    <Link to="/rules">Rules</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <Share2 className="mr-2 h-5 w-5 text-green-400" />
                    <Link to="/refer">Refer and Earn</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <BookOpen className="mr-2 h-5 w-5 text-green-400" />
                    <a href="https://placement-portal-frontend-xi.vercel.app/" target="_blank" rel="noopener noreferrer">
                      Resources
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                    <MessageSquare className="mr-2 h-5 w-5 text-green-400" />
                    <Link to="/chatbot">Chat Bot</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="flex items-center p-2 hover:bg-green-600/20 text-green-400 transition-colors cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="bg-green-500 py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffer}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-gray-900 font-semibold"
              >
                {offers[currentOffer]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="hidden md:flex space-x-1">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.name}
                    to={tab.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center ${
                        isActive
                          ? 'bg-green-500 text-gray-900'
                          : 'hover:bg-gray-600'
                      }`
                    }
                  >
                    {tab.icon}
                    {tab.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden"
                id="mobile-menu"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.name}
                      to={tab.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center ${
                          isActive
                            ? 'bg-green-500 text-gray-900'
                            : 'text-gray-200 hover:bg-gray-600 hover:text-white'
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {tab.icon}
                      {tab.name}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  )
}