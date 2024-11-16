'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card"
import { Play, BarChart, Code, Package, Database, Brain, Cpu, MoreHorizontal, Zap, TrendingUp, Clock, Loader, AlertTriangle } from 'lucide-react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog'
import ActiveBets from '../ActiveBets/ActiveBets'
import { LiveBetsSkeleton } from './LiveBetsSkeleton'

const categoryIcons = {
  Quant: BarChart,
  SDE: Code,
  Product: Package,
  Data: Database,
  Core: Cpu,
  Misc: MoreHorizontal,
}

const MotionCard = motion(Card)

export default function LiveBets() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showAllBets, setShowAllBets] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [liveEvents, setLiveEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://jobjinxbackend.vercel.app/api/companies/active', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          const transformedEvents = response.data.data.map(event => ({
            id: event._id,
            company: event.company,
            profile: event.profile,
            category: event.profile,
            timeLeft: event.expiresIn,
            totalTokenBet: event.totalTokenBet,
            users: event.individuals.map(user => ({
              id: user.id,
              name: user.name,
              odds: `${user.forStake}x/${user.againstStake}x`,
              enrollmentNumber: user.enrollmentNumber,
              forTokens: user.forTokens,
              againstTokens: user.againstTokens
            }))
          }))
          transformedEvents.sort((a, b) => b.totalTokenBet - a.totalTokenBet)
          setLiveEvents(transformedEvents)
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error fetching live events:', err)
        setError(err.message || 'Failed to load live events')
      } finally {
        setLoading(false)
      }
    }

    fetchLiveEvents()
  }, [])

  const filteredEvents = activeCategory === 'All' 
    ? liveEvents 
    : liveEvents.filter(event => event.category === activeCategory)

  const topEvents = filteredEvents.slice(0, 3)

  if (showAllBets) {
    return <ActiveBets />
  }

  if (loading) {
      return <LiveBetsSkeleton />
  }


  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg text-center px-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center text-emerald-400">
        <Zap className="mr-2 h-6 w-6 md:h-8 md:w-8" /> Live Events
      </h2>
      
      <ScrollArea className="w-full rounded-lg backdrop-blur-md p-2 mb-6">
        <div className="flex space-x-8 py-2">
          <CategoryButton category="All" activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          {Object.keys(categoryIcons).map((category) => (
            <CategoryButton key={category} category={category} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Hot Bets</h3>
        <Button
          variant="outline"
          onClick={() => setShowAllBets(true)}
          className="bg-emerald-500 text-gray-900 hover:bg-emerald-600 text-xs md:text-sm font-semibold px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-200 transform hover:scale-105"
        >
          View All Bets
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3  ">
        <AnimatePresence>
          {topEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Dialog onOpenChange={(open) => {
                if (open) setSelectedEvent(event)
                else setSelectedEvent(null)
              }}>
                <DialogTrigger asChild>
                  <MotionCard 
                    className="cursor-pointer border border-gray-700 hover:border-emerald-500 bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CardContent className="p-0">
                      <div className="flex justify-between items-start mb-3 ">
                        <h4 className="text-lg font-bold text-emerald-400">{event.company}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-emerald-500 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                            {event.category}
                          </span>
                          <motion.div
                            className="w-2 h-2 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </div>
                      </div>
                      {event.users.slice(0, 2).map((user, userIndex) => (
                        <div key={userIndex} className="flex justify-between items-center text-gray-300 mb-1 text-sm">
                          <span>{user.name}</span>
                          <span className="font-semibold text-emerald-400">{user.odds}</span>
                        </div>
                      ))}
                      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.timeLeft}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {event.totalTokenBet} tokens
                        </span>
                      </div>
                    </CardContent>
                  </MotionCard>
                </DialogTrigger>
                {selectedEvent && (
                  <BettingMenuDialog 
                    bet={{
                      company: selectedEvent.company,
                      companyId: selectedEvent.id,
                      profile: selectedEvent.profile,
                      users: selectedEvent.users.map(user => ({
                        id: user.id,
                        name: user.name,
                        enrollmentNumber: user.enrollmentNumber,
                        forStake: parseFloat(user.odds.split('/')[0]),
                        againstStake: parseFloat(user.odds.split('/')[1]),
                        forTokens: user.forTokens,
                        againstTokens: user.againstTokens
                      }))
                    }} 
                    onClose={() => setSelectedEvent(null)} 
                  />
                )}
              </Dialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CategoryButton({ category, activeCategory, setActiveCategory }) {
  const Icon = categoryIcons[category] || Play
  const isActive = activeCategory === category

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveCategory(category)}
      className={`flex flex-col items-center space-y-1 focus:outline-none transition-all duration-300 ${
        isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50' 
          : 'bg-gray-700 hover:bg-gray-600'
      }`}>
        <Icon className={`h-5 w-5 md:h-6 md:w-6 transition-all duration-300 ${
          isActive ? 'text-gray-900' : 'text-gray-300'
        }`} />
      </div>
      <span className={`text-xs md:text-sm font-medium transition-all duration-300 ${
        isActive ? 'text-emerald-400' : 'text-gray-400'
      }`}>
        {category}
      </span>
    </motion.button>
  )
}