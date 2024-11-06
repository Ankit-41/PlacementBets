'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Target,
  TrendingUp,
  Trophy,
  Clock,
  DollarSign
} from 'lucide-react'

const AnimatedStatsCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="bg-gray-800 border-2 border-emerald-500 overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        <div className="p-2 bg-emerald-500 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-2xl font-bold text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
    </Card>
  </motion.div>
);

export default function Component() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchMyBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://jobjinxbackend.vercel.app/api/bets/my-bets', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          setBets(response.data.data)
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error fetching my bets:', err)
        setError(err.message || 'Failed to load your bets')
      } finally {
        setLoading(false)
      }
    }

    fetchMyBets()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    )
  }

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const activeBets = bets.filter(bet => bet.status === 'active')
  const expiredBets = bets.filter(bet => bet.status === 'expired')
  const avgStake = bets.reduce((sum, bet) => sum + bet.stake, 0) / bets.length || 0

  const filteredBets = filter === 'all'
    ? bets
    : bets.filter(bet => bet.status === filter)

  return (
    <div className="bg-gray-900 min-h-screen p-8 overflow-hidden">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          My Bets
        </h1>
        <p className="text-lg text-gray-400">Track Your Betting Journey</p>

     


      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AnimatedStatsCard
          title="Total Amount Bet"
          value={`${totalAmount.toLocaleString()} tokens`}
          icon={<DollarSign className="h-6 w-6 text-gray-800" />}
        />
        <AnimatedStatsCard
          title="Active Bets"
          value={activeBets.length}
          icon={<Target className="h-6 w-6 text-gray-800" />}
        />
        <AnimatedStatsCard
          title="Expired Bets"
          value={expiredBets.length}
          icon={<Clock className="h-6 w-6 text-gray-800" />}
        />
        <AnimatedStatsCard
          title="Average Stake"
          value={`${avgStake.toFixed(2)}x`}
          icon={<TrendingUp className="h-6 w-6 text-gray-800" />}
        />
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-full flex">
          {['all', 'active', 'expired'].map((filterOption) => (
            <motion.button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${filter === filterOption
                  ? 'bg-emerald-500 text-gray-900'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700">
                <TableHead className="font-bold text-emerald-400">Student Name</TableHead>
                <TableHead className="font-bold text-emerald-400">Type</TableHead>
                <TableHead className="font-bold text-emerald-400">Amount</TableHead>
                <TableHead className="font-bold text-emerald-400">Company</TableHead>
                <TableHead className="font-bold text-emerald-400">Stake</TableHead>
                <TableHead className="font-bold text-emerald-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredBets.map((bet, index) => (
                  <motion.tr
                    key={bet._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-200">
                      {bet.targetUserName}
                    </TableCell>
                    <TableCell>
                      {bet.betType === 'for' ? (
                        <ThumbsUp className="w-6 h-6 text-blue-500" />
                      ) : (
                        <ThumbsDown className="w-6 h-6 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {bet.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {bet.company || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {bet.stake}x
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bet.status === 'active' ? 'success' : 'secondary'}
                        className={`px-3 py-1 text-sm font-semibold ${bet.status === 'active' ? 'bg-green-500 text-gray-900' : 'bg-gray-500 text-gray-200'
                          }`}
                      >
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  )
}