'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Target,
  TrendingUp,
  Trophy,
  Clock,
  ArrowLeft,
  Mail,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen
} from 'lucide-react'

const AnimatedStatsCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="bg-gray-800 border border-emerald-500 overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-lg sm:text-xl font-bold text-gray-200"
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
)

export default function UserProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userBets, setUserBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        const userResponse = await axios.get(`https://jobjinxbackend.vercel.app/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const betsResponse = await axios.get(`https://jobjinxbackend.vercel.app/api/users/${userId}/bets`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (userResponse.data.status === 'success' && betsResponse.data.status === 'success') {
          setUserData(userResponse.data.data)
          setUserBets(betsResponse.data.data)
        }

      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
        <div className="text-red-500 text-lg sm:text-xl mb-4 text-center">{error}</div>
        <Button onClick={() => navigate('/leaderboard')} variant="outline" className="bg-gray-800 hover:bg-gray-700 text-emerald-500">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
        </Button>
      </div>
    )
  }

  if (!userData) return null

  const totalBets = userBets.length
  const activeBets = userBets.filter(bet => bet.status === 'active')
  const expiredBets = userBets.filter(bet => bet.status !== 'active')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-8">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-emerald-500">
              <AvatarImage src={`/api/placeholder/150/150?text=${userData.name.split(' ').map(n => n[0]).join('')}`} />
              <AvatarFallback className="text-sm sm:text-base bg-emerald-500 text-gray-900">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-emerald-400">{userData.name}</h1>
              <p className="text-xs sm:text-sm text-gray-400">{userData.tokens.toLocaleString()} Tokens</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-emerald-500 hover:text-emerald-400 transition-colors p-1"
            aria-label={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-2 text-xs sm:text-sm"
            >
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Enrollment: {userData.enrollmentNumber}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>Success Rate</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-500 text-gray-900 text-xs">
                  {userData.successRate.toFixed(2)}%
                </Badge>
              </div>
              <Progress value={userData.successRate.toFixed(2)} className="h-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6">
        <AnimatedStatsCard
          title="Total Bets"
          value={totalBets}
          icon={<Target className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
        />
        <AnimatedStatsCard
          title="Active Bets"
          value={activeBets.length}
          icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
        />
        <AnimatedStatsCard
          title="Streak"
          value={`${userData.streak} 🔥`}
          icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
        />
        <AnimatedStatsCard
          title="Success"
          value={`${userData.successRate.toFixed(2)}%`}
          icon={<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
        />
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-1 rounded-full flex">
          {['all', 'active', 'expired'].map((filterOption) => (
            <motion.button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === filterOption
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

      <Card className="bg-gray-800 shadow-lg overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-lg sm:text-xl text-emerald-400">Betting History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700">
                  <TableHead className="text-emerald-400 font-bold text-xs sm:text-sm">Company</TableHead>
                  <TableHead className="text-emerald-400 font-bold text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-emerald-400 font-bold text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-emerald-400 font-bold text-xs sm:text-sm">Stake</TableHead>
                  <TableHead className="text-emerald-400 font-bold text-xs sm:text-sm">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBets
                  .filter(bet => filter === 'all' ? true : bet.status === filter)
                  .map((bet, index) => (
                  <motion.tr
                    key={bet._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-700"
                  >
                    <TableCell className="font-medium text-gray-200 text-xs sm:text-sm">{bet.company}</TableCell>
                    <TableCell>
                      {bet.betType === 'for' ? (
                        <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-gray-200 text-xs sm:text-sm">{bet.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-200 text-xs sm:text-sm">{bet.stake}x</TableCell>
                    <TableCell>
                      <Badge
                        variant={bet.status === 'active' ? 'success' : 'secondary'}
                        className={`${bet.status === 'active' ? 'bg-green-500 text-gray-900' : 'bg-gray-500 text-gray-200'} text-xs`}
                      >
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}