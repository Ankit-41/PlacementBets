'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Clock, TrendingUp, ChevronRight, AlertTriangle, ExternalLink, DollarSign, Trophy, X, Briefcase, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BetCardsGridSkeleton } from '../ActiveBets/BetCardSkeleton'
import axios from 'axios'

const MotionCard = motion(Card)

const ExpiredBetDialog = ({ bet, onClose }) => (
  <DialogContent className="max-w-4xl bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border border-gray-700 rounded-xl shadow-2xl">
    <DialogHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-gray-700 pb-2">
      <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        {bet.company} - {bet.profile}
      </DialogTitle>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2">
        <Badge variant="secondary" className="text-sm bg-emerald-500 text-gray-900 px-2 py-0.5 rounded-full shadow-md">
          <DollarSign className="h-4 w-4 mr-1" />
          Total: {bet.totalTokenBet}
        </Badge>
      </div>
    </DialogHeader>

    <ScrollArea className="mt-2 rounded-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 border-b border-gray-700">
            <TableHead className="text-emerald-400 font-semibold text-xs">Name</TableHead>
            <TableHead className="text-emerald-400 font-semibold text-xs">Enrollment</TableHead>
            <TableHead className="text-emerald-400 font-semibold text-xs">For</TableHead>
            <TableHead className="text-emerald-400 font-semibold text-xs">Against</TableHead>
            <TableHead className="text-emerald-400 font-semibold text-xs">Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bet.individuals.map((individual, index) => (
            <motion.tr
              key={individual.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-gray-700/70 transition-colors duration-200"
            >
              <TableCell className="font-medium text-xs">{individual.name}</TableCell>
              <TableCell>
                <span
                  className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 flex items-center text-xs"
                  onClick={() => window.open(`https://channeli.in/student_profile/${individual.enrollmentNumber}/`, '_blank')}
                >
                  {individual.enrollmentNumber}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </span>
              </TableCell>
              <TableCell className="text-xs">{individual.forTokens}</TableCell>
              <TableCell className="text-xs">{individual.againstTokens}</TableCell>
              <TableCell>
                <Badge
                  variant={individual.result === 'won' ? 'default' : 'destructive'}
                  className={`${individual.result === 'won' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-1 py-0.5`}
                >
                  {individual.result === 'won' ? 'Selected' : 'Not Selected'}
                </Badge>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  </DialogContent>
)

export default function ExpiredBets() {
  const [selectedBet, setSelectedBet] = useState(null)
  const [expiredBets, setExpiredBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchExpiredBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://jobjinxbackend.vercel.app/api/companies/expired', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          setExpiredBets(response.data.data)
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error fetching expired bets:', err)
        setError(err.response?.data?.message || 'Failed to load expired bets')
      } finally {
        setLoading(false)
      }
    }

    fetchExpiredBets()
  }, [])

  const filteredBets = expiredBets.filter(bet =>
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          Expired Bets
        </h1>
        <p className="text-sm sm:text-base text-gray-400">View results of completed placement bets</p>
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
              key={bet._id}
              onOpenChange={(open) => {
                if (open) setSelectedBet(bet)
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
                        {bet.individuals.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-emerald-500" />
                        <span>{bet.profile}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        <span>{bet.totalTokenBet}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-3">
                    <p className="text-xs font-semibold text-gray-300 mb-2">Results:</p>
                    <div className="space-y-2">
                      {bet.individuals.slice(0, 2).map((individual) => (
                        <div key={individual.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
                          <span className="text-xs text-gray-200 font-medium">{individual.name}</span>
                          <Badge
                            variant={individual.result === 'won' ? 'default' : 'destructive'}
                            className={`${individual.result === 'won' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center gap-1 text-[10px] px-1 py-0.5`}
                          >
                            {individual.result === 'won' ? (
                              <>
                                <Trophy className="h-2 w-2" />
                                Selected
                              </>
                            ) : (
                              <>
                                <X className="h-2 w-2" />
                                Not Selected
                              </>
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-emerald-500 text-xs font-medium flex items-center justify-end">
                      View Details <ChevronRight className="ml-1 w-3 h-3" />
                    </div>
                  </CardContent>
                </MotionCard>
              </DialogTrigger>
              {selectedBet && selectedBet._id === bet._id && (
                <ExpiredBetDialog bet={selectedBet} onClose={() => setSelectedBet(null)} />
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
          No expired bets found matching your search.
        </motion.div>
      )}
    </div>
  )
}