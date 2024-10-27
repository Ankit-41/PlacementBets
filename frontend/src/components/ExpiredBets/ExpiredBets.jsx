import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { ExpiredBetDetailsDialog } from './ExpiredBetDetailsDialog'

// Mock data for expired bets
const expiredBets = [
  {
    id: 1,
    company: "TechCorp",
    expirationDate: "2023-05-15",
    totalStake: 10000,
    outcome: "win",
    users: [
      { id: 1, name: "Alice Johnson", enrollmentNumber: "EN001", stake: 1500, payout: 3750 },
      { id: 2, name: "Bob Smith", enrollmentNumber: "EN002", stake: 2000, payout: 5000 },
      { id: 3, name: "Charlie Brown", enrollmentNumber: "EN003", stake: 1000, payout: 2500 },
    ],
  },
  {
    id: 2,
    company: "FinanceInc",
    expirationDate: "2023-05-10",
    totalStake: 8000,
    outcome: "loss",
    users: [
      { id: 4, name: "David Lee", enrollmentNumber: "EN004", stake: 1200, payout: 0 },
      { id: 5, name: "Eve Taylor", enrollmentNumber: "EN005", stake: 1800, payout: 0 },
      { id: 6, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 1500, payout: 0 },
    ],
  },
  // Add more mock data as needed
]

const MotionCard = motion(Card)

export default function ExpiredBets() {
  const [selectedBet, setSelectedBet] = useState(null)

  return (
    <div className="space-y-6 p-4 bg-gray-900">
      {/* Updated Expired Bets Header */}
      <motion.div 
        className="text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Expired Bets
        </h1>
      </motion.div>

      {/* Expired Bets Grid */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
          {expiredBets.map((bet, index) => (
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
                      <Badge variant="secondary" className={`flex items-center gap-1 ${bet.outcome === 'win' ? 'bg-green-500' : 'bg-red-500'} text-gray-900`}>
                        {bet.outcome === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {bet.outcome.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Expired: {bet.expirationDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Total Stake: {bet.totalStake} tokens
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Top Participants:</p>
                    <div className="space-y-2">
                      {bet.users.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
                          <span className="text-sm text-gray-200">{user.name}</span>
                          <Badge variant="outline" className={`${bet.outcome === 'win' ? 'text-green-400 border-green-500' : 'text-red-400 border-red-500'}`}>
                            {bet.outcome === 'win' ? `+${user.payout}` : `-${user.stake}`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </MotionCard>
              </DialogTrigger>
              {selectedBet && selectedBet.id === bet.id && (
                <ExpiredBetDetailsDialog bet={selectedBet} onClose={() => setSelectedBet(null)} />
              )}
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
