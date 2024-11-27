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
  Target,
  Shield,
  GraduationCap
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const [showOffer, setShowOffer] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const tabs = [
    { name: 'See Shortlists', path: '/individualSearch', icon: <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    { name: 'Active Bets', path: '/activebets', icon: <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    { name: 'Expired Bets', path: '/expiredbets', icon: <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    // { name: 'My Bets', path: '/mybets', icon: <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    { name: 'Placement Data', path: 'https://placement-portal-frontend-xi.vercel.app', icon: <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    { name: 'Admin Panel', path: '/adminPanel', icon: <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> },
    // 'Resources', path: 'https://placement-portal-frontend-xi.vercel.app/', external: true }
  
  ]

  const offers = [
    "🔥 Check SHORTLISTS, Placement Data from Navbar(☰)",
    "🎓 Placement Season Surprise: Bet Big, Win Bigger!",
    "🔓 Write to us at noreply.jobjinx@gmail.com"
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
      navigate('/home')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formattedTokens = user?.tokens?.toLocaleString() || '0'

  return (
    <>
      <div className={`h-[${isSticky ? (showOffer ? '164px' : '124px') : '0px'}] transition-all duration-300`} />
      <header className={`w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}
      style={{
       
        paddingTop: isSticky ? '5px' : '0', // Adjust according to your navbar height
      }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Top Header Section */}
          <div className="flex items-center justify-between py-2 sm:py-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src="./white_dice.webp" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xl sm:text-2xl font-bold text-white">JobJinx</span>
              
            </Link>
            <motion.div
              className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 p-1 sm:p-2 rounded-full"
              key={formattedTokens}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-200">
                {formattedTokens}
              </span>
            </motion.div>
            <div className="flex items-center space-x-2 sm:space-x-4">


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-emerald-500 text-gray-900 text-xs sm:text-sm">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 sm:w-56 bg-gray-800 text-gray-200 rounded-md shadow-lg border border-gray-700"
                >
                  <div className="px-2 py-1.5 border-b border-gray-700">
                    <p className="text-xs sm:text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  {[
                    { icon: User, label: 'My bets', path: '/mybets' },
                    // { icon: Settings, label: 'Settings', path: '/' },
                    { icon: Book, label: 'User Guide', path: '/guide' },
                    // { icon: Share2, label: 'Refer and Earn', path: '/' },
                    // { icon: BookOpen, label: 'Resources', path: 'https://placement-portal-frontend-xi.vercel.app/', external: true },
                    // { icon: MessageSquare, label: 'Chat Bot', path: '/' },
                  ].map((item) => (
                    <DropdownMenuItem key={item.label} className="flex items-center p-2 hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                      <item.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                      {item.external ? (
                        <a href={item.path} target="_blank" rel="noopener noreferrer">{item.label}</a>
                      ) : (
                        <Link to={item.path}>{item.label}</Link>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="flex items-center p-2 hover:bg-emerald-600/20 text-emerald-400 transition-colors cursor-pointer text-xs sm:text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        {showOffer && (
          <div className="bg-emerald-500 py-1 sm:py-2 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentOffer}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-900 font-semibold text-xs sm:text-sm"
                >
                  {offers[currentOffer]}
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={() => setShowOffer(false)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-900 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-1 sm:h-5 sm:w-5 lg:mr-10" />
            </button>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between h-12 sm:h-14">
              <div className="hidden md:flex space-x-1">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.name}
                    to={tab.path}
                    className={({ isActive }) =>
                      `px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 flex items-center ${isActive
                        ? 'bg-emerald-500 text-gray-900'
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
                  className="inline-flex items-center justify-center p-1 sm:p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  ) : (
                    <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
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
                        `block px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 flex items-center ${isActive
                          ? 'bg-emerald-500 text-gray-900'
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