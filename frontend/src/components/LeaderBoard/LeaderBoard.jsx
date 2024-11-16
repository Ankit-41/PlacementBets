'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, Target, ArrowUp, ArrowDown, AlertTriangle, Crown, Medal,ExternalLink } from 'lucide-react'
import { LeaderboardSkeleton } from './LeaderBoardSkeleton'
import confetti from 'canvas-confetti'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TopThreeCard = ({ user, rank }) => {
  const getBgGradient = () => {
    switch(rank) {
      case 1: return 'bg-gradient-to-b from-yellow-500 to-yellow-700 border-yellow-500'
      case 2: return 'bg-gradient-to-b from-gray-600 to-gray-800 border-gray-600'
      case 3: return 'bg-gradient-to-b from-orange-500 to-orange-700 border-orange-500'
      default: return ''
    }
  }

  const getHeight = () => {
    switch(rank) {
      case 1:
        return 'h-full sm:h-80';
      case 2:
      case 3:
        return 'h-full sm:h-64';
      default:
        return 'h-full';
    }
  };

  const getWidth = () => {
    switch(rank) {
      case 1:
        return 'w-full sm:w-1/3 max-w-[280px]';
      case 2:
      case 3:
        return 'w-full sm:w-1/4 max-w-[240px]';
      default:
        return 'w-full';
    }
  };
  const getIcon = () => {
    switch(rank) {
      case 1: return <Crown className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-800" />
      case 2: return <Medal className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" />
      case 3: return <Medal className="h-4 w-4 sm:h-6 sm:w-6 text-orange-800" />
      default: return null
    }
  }

  const totalBets = user.totalBets
  // const successRate = totalBets > 0 ? (user.successfulBets / user.totalBets) * 100 : 0
  const successRate = totalBets > 0 ? (user.successfulBets / user.totalBets) * 100 : 0;
  return (
    <motion.div
    className={`${getWidth()} ${getHeight()} mx-auto sm:mx-2 mb-4 sm:mb-0`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: rank * 0.2 }}
    whileHover={{ scale: 1.05 }}
    style={{ order: rank === 1 ? 0 : rank === 2 ? -1 : 1 }}
  >
      <Card className={`h-full ${getBgGradient()} border-2 shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 m-2">
          {getIcon()}
        </div>
        <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4 h-full">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white shadow-lg mb-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-sm sm:text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-sm sm:text-lg font-bold mb-1 text-center text-gray-200">{user.name}</h3>
          
          <div className="flex items-center mb-1">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
            <span className="text-xs sm:text-sm font-bold text-gray-200">{user.tokens.toLocaleString()} Tokens</span>
          </div>

          <div className="w-full">
            <div className="text-xs text-center mb-1 text-gray-300">Success Rate</div>
            <div className="flex items-center justify-center">
              <Progress 
                value={successRate} 
                className="w-16 sm:w-24 h-1 sm:h-2 mr-2 bg-gray-700"
              />
              <span className="text-xs font-medium text-gray-200">
                {successRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const fireworks = () => {
  const duration = 1 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 10, spread: 200, ticks: 10, zIndex: 0 }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 500 * (timeLeft / duration)
    
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
    }))
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
    }))

    confetti({
      spread: 200,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 10,
      particleCount: 100,
      scalar: 1.2,
      shapes: ['star'],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
      origin: { x: Math.random(), y: Math.random() * 0.5 }
    })

  }, 250)
}

const AnimatedStatsCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="bg-gray-800 bg-opacity-80 border-2 border-green-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-lg sm:text-2xl font-bold text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [stats, setStats] = useState({
    totalBets: 0,
    totalTokens: 0,
    avgSuccessRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredUser, setHoveredUser] = useState(null)

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        const leaderboardResponse = await axios.get('https://jobjinxbackend.vercel.app/api/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const statsResponse = await axios.get('https://jobjinxbackend.vercel.app/api/leaderboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (leaderboardResponse.data.status === 'success') {
          setLeaderboardData(leaderboardResponse.data.data)
        }

        if (statsResponse.data.status === 'success') {
          setStats(statsResponse.data.data)
        }

        setError(null)
      } catch (err) {
        console.error('Error fetching leaderboard data:', err)
        setError('Failed to load leaderboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
    const celebrationInterval = setInterval(() => {
      fireworks()
    }, 8000)

    return () => clearInterval(celebrationInterval)
  }, [])

  if (loading) {
    return <LeaderboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AlertTriangle className="text-emerald-500 w-12 h-12 mb-4" />
        <div className="text-emerald-500 text-lg font-semibold">{error}</div>
      </div>
    )
  }

  const topThree = leaderboardData.slice(0, 3)

  const totalUsers = leaderboardData.length
  const totalSuccessRate = leaderboardData.reduce((sum, user) => {
    const totalBets = user.totalBets
    const userSuccessRate = totalBets > 0 ? (user.successfulBets / user.totalBets) * 100 : 0
    return sum + userSuccessRate
  }, 0)

  const averageSuccessRate = totalUsers > 0 ? (totalSuccessRate / totalUsers) : 0

  return ( 
    <div className="bg-gray-900 p-4 container mx-auto">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          JobJinx Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-gray-400">Celebrating Our Top Performers</p>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-2 sm:gap-4 mb-8">
        {topThree.map((user, index) => (
          <TopThreeCard 
            key={user.id} 
            user={{
              ...user,
              avatar: `/api/placeholder/150/150?text=${user.name.split(' ').map(n => n[0]).join('')}`
            }} 
            rank={index + 1} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AnimatedStatsCard
          title="Total Bets Placed"
          value={leaderboardData.reduce((sum, user) => sum + user.totalBets, 0)}
          icon={<Target className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
        />
        <AnimatedStatsCard
          title="Average Success Rate"
          value={`${averageSuccessRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}
        />
        <AnimatedStatsCard
          title="Total Tokens in Play"
          value={leaderboardData.reduce((sum, user) => sum + user.tokens, 0).toLocaleString()}
          icon={<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-200">Complete Rankings</h2>
        <LeaderboardTable 
          data={leaderboardData.map(user => ({
            ...user,
            avatar: `/api/placeholder/150/150?text=${user.name.split(' ').map(n => n[0]).join('')}`
          }))} 
          hoveredUser={hoveredUser} 
          setHoveredUser={setHoveredUser} 
        />
      </div>
    </div>
  )
}

const LeaderboardTable = ({ data, hoveredUser, setHoveredUser }) => {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState({ key: 'tokens', direction: 'descending' })

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = React.useMemo(() => {
    const sortableData = [...data]
    sortableData.sort((a, b) => {
      let aValue, bValue
      switch (sortConfig.key) {
        case 'tokens':
          aValue = a.tokens
          bValue = b.tokens
          break
        case 'successRate':
          const aTotalBets = a.totalBets
          const bTotalBets = b.totalBets
          aValue = aTotalBets > 0 ? (a.successfulBets / aTotalBets) * 100 : 0
          bValue = bTotalBets > 0 ? (b.successfulBets / bTotalBets) * 100 : 0
          break
        case 'streak':
          aValue = a.streak
          bValue = b.streak
          break
        default:
          return 0
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
    return sortableData
  }, [data, sortConfig])

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 
        <ArrowUp className="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" /> : 
        <ArrowDown className="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
    }
    return <ArrowUp className="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-amber-300 opacity-50" />
  }

  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-700">
            <TableHead className="w-[50px] font-bold text-gray-200 text-xs sm:text-sm">Rank</TableHead>
            <TableHead className="font-bold text-gray-200 text-xs sm:text-sm">User</TableHead>
            <TableHead
              className="font-bold text-gray-200 text-xs sm:text-sm cursor-pointer"
              onClick={() => handleSort('tokens')}
            >
              Tokens {getSortIcon('tokens')}
            </TableHead>
            <TableHead
              className="text-center font-bold text-gray-200 text-xs sm:text-sm cursor-pointer"
              onClick={() => handleSort('successRate')}
            >
              Success {getSortIcon('successRate')}
            </TableHead>
            <TableHead
              className="text-center font-bold text-gray-200 text-xs sm:text-sm cursor-pointer"
              onClick={() => handleSort('streak')}
            >
              Streak {getSortIcon('streak')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((user, index) => {
            const totalBets = user.totalBets
            const successRate = totalBets > 0 ? (user.successfulBets / user.totalBets) * 100 : 0
            return (
              <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onHoverStart={() => setHoveredUser(user.id)}
              onHoverEnd={() => setHoveredUser(null)}
              onClick={() => handleUserClick(user.id)}
              className="group hover:bg-gray-700/80 cursor-pointer transition-all duration-200 hover:shadow-lg relative"
            >
              <TableCell className="font-medium text-gray-200 text-xs sm:text-sm group-hover:text-emerald-400 transition-colors duration-200">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all duration-200">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-green-500 text-gray-900 text-xs sm:text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-200 text-xs sm:text-sm group-hover:text-emerald-400 transition-colors duration-200">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center  duration-200">
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mr-1" />
                    <span className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">View Profile</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-200 text-xs sm:text-sm group-hover:text-emerald-400 transition-colors duration-200">
                {user.tokens.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Progress 
                    value={successRate} 
                    className="w-16 sm:w-24 h-1 sm:h-2 bg-gray-700 group-hover:bg-gray-600 transition-colors duration-200"
                  />
                  <span className="text-xs font-medium text-gray-200 ml-1 sm:ml-2 group-hover:text-emerald-400 transition-colors duration-200">
                    {successRate.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
              <Badge variant={user.streak > 0 ? "default" : "secondary"} className="text-emerald-500 font-medium text-xs sm:text-sm">

                  {user.streak} 🔥
                </Badge>
              </TableCell>
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}