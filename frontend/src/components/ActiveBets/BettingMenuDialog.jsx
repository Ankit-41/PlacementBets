'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Coins, ExternalLink, AlertTriangle, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
         AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'

const MotionTableRow = motion(TableRow)

export function BettingMenuDialog({ bet, onClose }) {
  const [betData, setBetData] = useState({})
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { user, updateUserTokens, refreshUserData } = useAuth()

  useEffect(() => {
    const initialBetData = bet.users.reduce((acc, user) => {
      acc[user.id] = { forAmount: 0, againstAmount: 0, betType: null }
      return acc
    }, {})
    setBetData(initialBetData)
  }, [bet])

  const selectedUsers = useMemo(() => {
    return Object.values(betData).filter(data => data.forAmount > 0 || data.againstAmount > 0).length
  }, [betData])

  const handleBetChange = (userId, amount, type) => {
    setBetData(prev => {
      const newData = { ...prev }
      const currentData = newData[userId]

      if (currentData.betType !== type && type !== null) {
        newData[userId] = {
          forAmount: type === 'for' ? amount : 0,
          againstAmount: type === 'against' ? amount : 0,
          betType: type
        }
      } else {
        newData[userId] = {
          ...currentData,
          [type === 'for' ? 'forAmount' : 'againstAmount']: amount,
          betType: amount > 0 ? type : null
        }
      }

      const selectedCount = Object.values(newData).filter(data => 
        data.forAmount > 0 || data.againstAmount > 0
      ).length

      if (selectedCount > Math.floor(bet.users.length * 0.8)) {
        setShowLimitAlert(true)
        return prev
      }

      return newData
    })
  }

  const totalBetAmount = useMemo(() => {
    return Object.values(betData).reduce((sum, data) => 
      sum + data.forAmount + data.againstAmount, 0
    )
  }, [betData])

  const recalculateStakes = async (companyId) => {
    try {
      const response = await axios.post(
        `https://jobjinxbackend.vercel.app/api/bets/recalculate-stakes/${companyId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.status === 'success') {
        return response.data.data.company
      }
      throw new Error('Failed to recalculate stakes')
    } catch (error) {
      console.error('Error recalculating stakes:', error)
      throw error
    }
  }

  const handleSubmitBet = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (totalBetAmount > user.tokens) {
        setError('Insufficient tokens. Please reduce your bet amount.')
        return
      }

      const bets = Object.entries(betData)
        .filter(([_, data]) => data.betType !== null)
        .map(([userId, data]) => {
          const user = bet.users.find(u => u.id === parseInt(userId))
          return {
            targetUserId: parseInt(userId),
            targetUserName: user.name,
            targetUserEnrollment: user.enrollmentNumber,
            betType: data.betType,
            amount: data.betType === 'for' ? data.forAmount : data.againstAmount
          }
        })

      const betResponse = await axios.post(
        'https://jobjinxbackend.vercel.app/api/bets/place-bets',
        {
          companyId: bet.companyId,
          bets
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (betResponse.data.status === 'success') {
        await recalculateStakes(bet.companyId)
        await refreshUserData()
        alert('Bets placed successfully and stakes recalculated!')
        onClose()
      }
    } catch (err) {
      console.error('Error processing bets:', err)
      setError(err.response?.data?.message || 'Error processing bets. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfileClick = (enrollmentNumber) => {
    window.open(`https://channeli.in/student_profile/${enrollmentNumber}/`, '_blank')
  }

  return (
    <DialogContent className="max-w-full sm:max-w-3xl md:max-w-4xl bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border border-gray-700 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
      <DialogHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-gray-700 pb-4">
        <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          {bet.company} - {bet.profile}
        </DialogTitle>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2 sm:space-x-4">
          <Badge variant="secondary" className="text-sm sm:text-base bg-emerald-500 text-gray-900 px-2 py-1 rounded-full shadow-md">
            <Coins className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Total: {totalBetAmount}
          </Badge>
        </div>
      </DialogHeader>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="h-[50vh] mt-4 rounded-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 border-b border-gray-700">
              <TableHead className="text-emerald-400 font-semibold text-xs sm:text-sm">User</TableHead>
              <TableHead className="text-emerald-400 font-semibold text-xs sm:text-sm hidden sm:table-cell">Enrollment</TableHead>
              <TableHead className="text-emerald-400 font-semibold text-xs sm:text-sm">Stake</TableHead>
              <TableHead className="text-emerald-400 font-semibold text-xs sm:text-sm text-center" colSpan={2}>Bet Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bet.users.map((user, index) => {
              const userData = betData[user.id] || { forAmount: 0, againstAmount: 0, betType: null }
              const isActive = userData.forAmount > 0 || userData.againstAmount > 0

              return (
                <MotionTableRow
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${isActive ? "bg-gray-700/50" : "bg-gray-800/30"} hover:bg-gray-700/70 transition-colors duration-200`}
                >
                  <TableCell className="font-medium text-xs sm:text-sm">
                    <span
                      className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
                      onClick={() => handleProfileClick(user.enrollmentNumber)}
                    >
                      {user.name}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    <span
                      className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 flex items-center"
                      onClick={() => handleProfileClick(user.enrollmentNumber)}
                    >
                      {user.enrollmentNumber}
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <div className="flex gap-1 sm:gap-2">
                      <Badge variant="outline" className="border-blue-500 text-blue-400 px-1 py-0.5 text-[10px] sm:text-xs">
                        For: {user.forStake}x
                      </Badge>
                      <Badge variant="outline" className="border-red-500 text-red-400 px-1 py-0.5 text-[10px] sm:text-xs">
                        Against: {user.againstStake}x
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="w-48 sm:w-64">
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        <Slider
                          value={[userData.forAmount]}
                          onValueChange={([value]) => handleBetChange(user.id, value, 'for')}
                          max={1000}
                          step={10}
                          className="w-24 sm:w-32"
                          disabled={userData.betType === 'against'}
                        />
                        <span className="w-12 sm:w-16 text-right text-xs sm:text-sm">{userData.forAmount}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                        <Slider
                          value={[userData.againstAmount]}
                          onValueChange={([value]) => handleBetChange(user.id, value, 'against')}
                          max={1000}
                          step={10}
                          className="w-24 sm:w-32"
                          disabled={userData.betType === 'for'}
                        />
                        <span className="w-12 sm:w-16 text-right text-xs sm:text-sm">{userData.againstAmount}</span>
                      </div>
                    </div>
                  </TableCell>
                </MotionTableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex items-center justify-end mt-4 sm:mt-6">
        <Button 
          onClick={handleSubmitBet} 
          disabled={isSubmitting || selectedUsers === 0 || totalBetAmount <= 0}
          className="bg-emerald-500 text-gray-900 hover:bg-emerald-600 font-semibold px-4 py-2 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Bet...
            </>
          ) : (
            'Submit Bet'
          )}
        </Button>
      </div>

      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="bg-gray-800 text-gray-100 border border-gray-700 rounded-xl p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-400 flex items-center text-lg sm:text-xl font-bold">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Selection Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 mt-2 text-sm sm:text-base">
              You can't select more than 80% of the total users. Please adjust your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowLimitAlert(false)} className="bg-emerald-500 text-gray-900 hover:bg-emerald-600 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base transition-colors duration-200 mt-4">
            Close
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  )
}

export default BettingMenuDialog