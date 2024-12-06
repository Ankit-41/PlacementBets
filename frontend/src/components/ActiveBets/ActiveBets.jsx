'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Clock, Briefcase, DollarSign, ChevronRight, AlertTriangle, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BettingMenuDialog } from './BettingMenuDialog'
import { BetCardsGridSkeleton } from './BetCardSkeleton'
import axios from 'axios'

const MotionCard = motion(Card)

export default function ActiveBets() {
  const [selectedBet, setSelectedBet] = useState(null)
  const [activeBets, setActiveBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchActiveBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://jobjinxbackend.vercel.app/api/companies/active', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          const transformedBets = response.data.data.map(bet => ({
            id: bet._id,
            companyId: bet._id,
            company: bet.company,
            profile: bet.profile,
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

  const filteredBets = activeBets.filter(bet =>
    bet.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bet.profile.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <BetCardsGridSkeleton count={6} />
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AlertTriangle className="text-emerald-500 w-12 h-12 mb-4" />
        <div className="text-emerald-500 text-lg font-semibold text-center px-4">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-4 p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          Active Bets
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">Place your bets on upcoming placements</p>
      </motion.div>

      <motion.div
        className="max-w-md mx-auto mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by companies or profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
         
         />
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredBets.map((bet, index) => (
            <Dialog
              key={bet.id}
              onOpenChange={(open) => {
                if (open) handleBetDialogOpen(bet)
                else setSelectedBet(null)
              }}
            >
              <DialogTrigger asChild>
                <MotionCard
                  className="cursor-pointer bg-gray-800 bg-opacity-60 backdrop-blur-md hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-700 hover:border-emerald-500 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CardHeader className="flex flex-col gap-2 bg-gradient-to-r from-gray-800 to-gray-700 p-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base sm:text-lg font-bold text-emerald-400">{bet.company}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1 bg-emerald-500 text-gray-900 px-2 py-0.5 rounded-full text-xs">
                        <Users className="h-3 w-3" />
                        {bet.users.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center gap-1 mr-2 mb-1">
                        <Briefcase className="h-3 w-3 text-emerald-500" />
                        <span>{bet.profile}</span>
                      </div>
                      <div className="flex items-center gap-1 mr-2 mb-1">
                        <Clock className="h-3 w-3 text-emerald-500" />
                        <span>{bet.expiresIn}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        <span>{bet.totalTokenBet} tokens</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-3">
                    <p className="text-xs font-semibold text-gray-300 mb-2">Top Bettors:</p>
                    <div className="space-y-2">
                      {bet.users.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
                          <span className="text-xs text-gray-200 font-medium">{user.name}a</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="border-blue-500 text-blue-400 px-1 py-0.5 text-[10px]">
                              For: {user.forStake}x
                            </Badge>
                            <Badge variant="outline" className="border-red-500 text-red-400 px-1 py-0.5 text-[10px]">
                              Against: {user.againstStake}x
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-emerald-500 text-xs font-medium flex items-center justify-end">
                      View Details <ChevronRight className="ml-1 w-3 h-3" />
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

      {filteredBets.length === 0 && (
        <motion.div
          className="text-center text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No companies found matching your search.
        </motion.div>
      )}
    </div>
  )
}