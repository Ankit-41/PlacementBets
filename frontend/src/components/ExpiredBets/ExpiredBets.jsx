'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Clock, TrendingUp, ChevronRight, AlertTriangle, ExternalLink, DollarSign, Trophy, X, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const MotionCard = motion(Card)

const ExpiredBetDialog = ({ bet, onClose }) => (
  <DialogContent className="max-w-4xl bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border border-gray-700 rounded-xl shadow-2xl">
    <DialogHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-gray-700 pb-4">
      <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        {bet.company} - {bet.profile}
      </DialogTitle>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
        <Badge variant="secondary" className="text-lg bg-emerald-500 text-gray-900 px-3 py-1 rounded-full shadow-md">
          <DollarSign className="h-5 w-5 mr-2" />
          Total Bet: {bet.totalTokenBet} tokens
        </Badge>
      </div>
    </DialogHeader>

    <ScrollArea className="h-[60vh] mt-4 rounded-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 border-b border-gray-700">
            <TableHead className="text-emerald-400 font-semibold">Name</TableHead>
            <TableHead className="text-emerald-400 font-semibold">Enrollment</TableHead>
            <TableHead className="text-emerald-400 font-semibold">For Tokens</TableHead>
            <TableHead className="text-emerald-400 font-semibold">Against Tokens</TableHead>
            <TableHead className="text-emerald-400 font-semibold">Result</TableHead>
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
              <TableCell className="font-medium">{individual.name}</TableCell>
              <TableCell>
                <span
                  className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 flex items-center"
                  onClick={() => window.open(`https://channeli.in/student_profile/${individual.enrollmentNumber}/`, '_blank')}
                >
                  {individual.enrollmentNumber}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </span>
              </TableCell>
              <TableCell>{individual.forTokens}</TableCell>
              <TableCell>{individual.againstTokens}</TableCell>
              <TableCell>
                <Badge 
                  variant={individual.result === 'won' ? 'default' : 'destructive'} 
                  className={`${individual.result === 'won' ? 'bg-green-500' : 'bg-red-500'} text-white`}
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

  useEffect(() => {
    const fetchExpiredBets = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/companies/expired', {
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
          Expired Bets
        </h1>
        <p className="text-gray-400 text-lg">View results of completed placement bets</p>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {expiredBets.map((bet, index) => (
            <Dialog 
              key={bet._id}
              onOpenChange={(open) => {
                if (open) setSelectedBet(bet)
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
                        {bet.individuals.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-emerald-500" />
                        <span>Profile: {bet.profile}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span>Tokens bet: {bet.totalTokenBet}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 px-4">
                    <p className="text-sm font-semibold text-gray-300 mb-3">Results:</p>
                    <div className="space-y-2">
                      {bet.individuals.slice(0, 2).map((individual) => (
                        <div key={individual.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                          <span className="text-sm text-gray-200 font-medium">{individual.name}</span>
                          <Badge 
                            variant={individual.result === 'won' ? 'default' : 'destructive'}
                            className={`${individual.result === 'won' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center gap-1`}
                          >
                            {individual.result === 'won' ? (
                              <>
                                <Trophy className="h-3 w-3" />
                                Selected
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3" />
                                Not Selected
                              </>
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-emerald-500 text-sm font-medium flex items-center justify-end">
                      View Details <ChevronRight className="ml-1 w-4 h-4" />
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
    </div>
  )
}