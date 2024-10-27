// LimitedActiveBets.jsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog'

// Import the same activeBets data or reuse the existing ActiveBets component's data
// Assuming activeBetsData is exported from ActiveBets.jsx
import { activeBetsData } from './ActiveBets' // Ensure you export activeBetsData from ActiveBets.jsx

const MotionCard = motion(Card)

export default function LimitedActiveBets() {
  const [selectedBet, setSelectedBet] = useState(null)

  // Display only the first three bets
  const displayedBets = activeBetsData.slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Active Bets Header */}
      <div className="flex justify-center items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-yellow-400">Active Bets</h2>
      </div>

      {/* Active Bets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBets.map((bet, index) => (
          <Dialog key={bet.id} onOpenChange={(open) => {
            if (open) setSelectedBet(bet)
            else setSelectedBet(null)
          }}>
            <DialogTrigger asChild>
              <MotionCard 
                className="cursor-pointer bg-gray-700 bg-opacity-60 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium text-yellow-400">{bet.company}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {bet.users.length}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-gray-300 mb-1">Top Bettors:</p>
                  <div className="space-y-1">
                    {bet.users.slice(0, 2).map((user) => (
                      <div key={user.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-200">{user.name.split(' ')[0]}</span>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                          {user.stake}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </MotionCard>
            </DialogTrigger>
            {selectedBet && selectedBet.id === bet.id && (
              <BettingMenuDialog bet={selectedBet} onClose={() => setSelectedBet(null)} />
            )}
          </Dialog>
        ))}
      </div>
    </div>
  )
}
