'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ThumbsUp, ThumbsDown, AlertCircle, Target, TrendingUp, Trophy } from 'lucide-react'

const AnimatedStatsCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="bg-gray-800 border-2 border-emerald-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        {icon}
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
    </Card>
  </motion.div>
);

export default function MyBets() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/bets/my-bets', {
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    )
  }

  // Calculate statistics
  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const activeBets = bets.filter(bet => bet.status === 'active').length
  const avgStake = bets.reduce((sum, bet) => sum + bet.stake, 0) / bets.length || 0

  return (
    <div className="bg-gray-900 p-4 container mx-auto px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          My Bets
        </h1>
        <p className="text-lg text-gray-400">Track Your Betting History</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <AnimatedStatsCard
          title="Total Amount Bet"
          value={`${totalAmount.toLocaleString()} tokens`}
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
        />
        <AnimatedStatsCard
          title="Active Bets"
          value={activeBets}
          icon={<Target className="h-5 w-5 text-emerald-500" />}
        />
        <AnimatedStatsCard
          title="Average Stake"
          value={`${avgStake.toFixed(2)}x`}
          icon={<TrendingUp className="h-5 w-5 text-yellow-500" />}
        />
      </div>

      {/* Bets Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className=" overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-gray-800">
                <TableRow>
                  <TableHead className="font-bold text-emerald-400">Student Name</TableHead>
                  <TableHead className="font-bold text-emerald-400">Type</TableHead>
                  <TableHead className="font-bold text-emerald-400">Amount</TableHead>
                  <TableHead className="font-bold text-emerald-400">Company</TableHead>
                  <TableHead className="font-bold text-emerald-400">Stake</TableHead>
                  <TableHead className="font-bold text-emerald-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bets.map((bet, index) => (
                  <motion.tr
                    key={bet._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-200">
                      {bet.targetUserName}
                    </TableCell>
                    <TableCell>
                      {bet.betType === 'for' ? (
                        <ThumbsUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ThumbsDown className="w-5 h-5 text-red-500" />
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
                      <Badge variant={bet.status === 'active' ? 'success' : 'secondary'}>
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}