import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { BettingMenuDialog } from './BettingMenuDialog'

// Updated mock data for active bets with expiration times
export const activeBets = [
  {
    id: 1,
    company: "TechCorp",
    expiresIn: "2d 5h",
    totalStake: 8.9,
    users: [
      { id: 1, name: "Kushagra Pandey", enrollmentNumber: "21112068", stake: 1.5 },
      { id: 2, name: "Bob Smith", enrollmentNumber: "21112060", stake: 1.8 },
      { id: 3, name: "Charlie Brown", enrollmentNumber: "EN003", stake: 2.0 },
      { id: 4, name: "David Lee", enrollmentNumber: "EN004", stake: 1.7 },
      { id: 5, name: "Eve Taylor", enrollmentNumber: "EN005", stake: 1.9 },
    ],
  },
  {
    id: 2,
    company: "FinanceInc",
    expiresIn: "1d 12h",
    totalStake: 9.5,
    users: [
      { id: 6, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 2.2 },
      { id: 7, name: "Grace Davis", enrollmentNumber: "EN007", stake: 1.6 },
      { id: 8, name: "Henry Martinez", enrollmentNumber: "EN008", stake: 1.9 },
      { id: 9, name: "Ivy Chen", enrollmentNumber: "EN009", stake: 2.1 },
      { id: 10, name: "Jack Thompson", enrollmentNumber: "EN010", stake: 1.7 },
    ],
  },
  {
    id: 3,
    company: "FinanceInc",
    expiresIn: "1d 12h",
    totalStake: 9.5,
    users: [
      { id: 6, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 2.2 },
      { id: 7, name: "Grace Davis", enrollmentNumber: "EN007", stake: 1.6 },
      { id: 8, name: "Henry Martinez", enrollmentNumber: "EN008", stake: 1.9 },
      { id: 9, name: "Ivy Chen", enrollmentNumber: "EN009", stake: 2.1 },
      { id: 10, name: "Jack Thompson", enrollmentNumber: "EN010", stake: 1.7 },
    ],
  },
  {
    id: 4,
    company: "FinanceInc",
    expiresIn: "1d 12h",
    totalStake: 9.5,
    users: [
      { id: 6, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 2.2 },
      { id: 7, name: "Grace Davis", enrollmentNumber: "EN007", stake: 1.6 },
      { id: 8, name: "Henry Martinez", enrollmentNumber: "EN008", stake: 1.9 },
      { id: 9, name: "Ivy Chen", enrollmentNumber: "EN009", stake: 2.1 },
      { id: 10, name: "Jack Thompson", enrollmentNumber: "EN010", stake: 1.7 },
    ],
  },
  {
    id: 5,
    company: "FinanceInc",
    expiresIn: "1d 12h",
    totalStake: 9.5,
    users: [
      { id: 6, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 2.2 },
      { id: 7, name: "Grace Davis", enrollmentNumber: "EN007", stake: 1.6 },
      { id: 8, name: "Henry Martinez", enrollmentNumber: "EN008", stake: 1.9 },
      { id: 9, name: "Ivy Chen", enrollmentNumber: "EN009", stake: 2.1 },
      { id: 10, name: "Jack Thompson", enrollmentNumber: "EN010", stake: 1.7 },
    ],
  },
  // ... (other bet entries)
]

const MotionCard = motion(Card)

export default function ActiveBets() {
  const [selectedBet, setSelectedBet] = useState(null)

  return (
    <div className="space-y-6 p-4 bg-gray-900">
      {/* Updated Active Bets Header */}
      <motion.div 
        className="text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Active Bets
        </h1>
      </motion.div>

      {/* Active Bets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
        {activeBets.map((bet, index) => (
          <Dialog key={bet.id} onOpenChange={(open) => {
            if (open) setSelectedBet(bet)
            else setSelectedBet(null)
          }}>
            <DialogTrigger asChild>
              <MotionCard 
                className="cursor-pointer bg-gray-800 bg-opacity-60 backdrop-blur-md hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-700 hover:border-yellow-500"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-yellow-400">{bet.company}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500 text-gray-900">
                      <Users className="h-4 w-4" />
                      {bet.users.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Expires in: {bet.expiresIn}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Total Stake: {bet.totalStake}x
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm font-semibold text-gray-300 mb-2">Top Bettors:</p>
                  <div className="space-y-2">
                    {bet.users.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
                        <span className="text-sm text-gray-200">{user.name}</span>
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
