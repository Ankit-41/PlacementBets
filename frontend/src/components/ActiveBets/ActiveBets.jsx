'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BettingMenuDialog } from './BettingMenuDialog'
import axios from 'axios'

const MotionCard = motion(Card)

export default function ActiveBets() {
  const [selectedBet, setSelectedBet] = useState(null)
  const [activeBets, setActiveBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActiveBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/companies/active', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          const transformedBets = response.data.data.map(bet => ({
            id: bet._id,
            companyId: bet._id,
            company: bet.company,
            expiresIn: bet.expiresIn,
            totalTokenBet: bet.totalTokenBet || 0,
            users: bet.individuals.map(individual => ({
              id: individual.id,
              name: individual.name,
              enrollmentNumber: individual.enrollmentNumber,
              forStake: individual.forStake,
              againstStake: individual.againstStake,
              forTokens: individual.forTokens || 0,
              againstTokens: individual.againstTokens || 0
            }))
          }))

          setActiveBets(transformedBets)
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error fetching active bets:', err)
        setError(err.response?.data?.message || 'Failed to load active bets')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveBets()
  }, [])

  const handleBetDialogOpen = (bet) => {
    setSelectedBet(bet)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AlertTriangle className="text-emerald-500 w-16 h-16 mb-4" />
        <div className="text-emerald-500 text-xl font-semibold">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-6 p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          Active Bets
        </h1>
        <p className="text-gray-400 text-lg">Place your bets on upcoming placements</p>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {activeBets.map((bet, index) => (
            <Dialog 
              key={bet.id} 
              onOpenChange={(open) => {
                if (open) handleBetDialogOpen(bet)
                else setSelectedBet(null)
              }}
            >
              <DialogTrigger asChild>
                <MotionCard 
                  className="cursor-pointer bg-gray-800 bg-opacity-60 backdrop-blur-md hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-700 hover:border-emerald-500 overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CardHeader className="flex flex-col gap-2 bg-gradient-to-r from-gray-800 to-gray-700 p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold text-emerald-400">{bet.company}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1 bg-emerald-500 text-gray-900 px-2 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        {bet.users.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span>Expires in: {bet.expiresIn}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span>Tokens bet: {bet.totalTokenBet}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 px-4">
                    <p className="text-sm font-semibold text-gray-300 mb-3">Top Bettors:</p>
                    <div className="space-y-2">
                      {bet.users.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                          <span className="text-sm text-gray-200 font-medium">{user.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-blue-500 text-blue-400 px-2 py-0.5 text-xs">
                              For: {user.forStake}x
                            </Badge>
                            <Badge variant="outline" className="border-red-500 text-red-400 px-2 py-0.5 text-xs">
                              Against: {user.againstStake}x
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-emerald-500 text-sm font-medium flex items-center justify-end">
                      View Details <ChevronRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </MotionCard>
              </DialogTrigger>
              {selectedBet && selectedBet.id === bet.id && (
                <BettingMenuDialog 
                  bet={{
                    ...selectedBet,
                    companyId: selectedBet.id
                  }} 
                  onClose={() => setSelectedBet(null)} 
                />
              )}
            </Dialog>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}