import React, { useState, useMemo, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Coins, ExternalLink, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
         AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAuth } from '../../contexts/AuthContext'; // Add this import
import axios from 'axios'; // Add this import
import { AnimatePresence, motion } from 'framer-motion';


export function BettingMenuDialog({ bet, onClose }) {
  const [betData, setBetData] = useState({});
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the current user
  const { updateUserTokens, refreshUserData } = useAuth();
  const MotionTableRow = motion.tr;
  // Initialize bet data structure
  useEffect(() => {
    const initialBetData = bet.users.reduce((acc, user) => {
      acc[user.id] = {
        forAmount: 0,
        againstAmount: 0,
        betType: null
      };
      return acc;
    }, {});
    setBetData(initialBetData);
  }, [bet]);

  const selectedUsers = useMemo(() => {
    return Object.entries(betData).filter(([_, data]) => 
      data.forAmount > 0 || data.againstAmount > 0
    ).length;
  }, [betData]);

  const handleBetChange = (userId, amount, type) => {
    setBetData(prev => {
      const newData = { ...prev };
      const currentData = newData[userId];

      // If switching bet type, reset the other amount
      if (currentData.betType !== type && type !== null) {
        newData[userId] = {
          forAmount: type === 'for' ? amount : 0,
          againstAmount: type === 'against' ? amount : 0,
          betType: type
        };
      } else {
        newData[userId] = {
          ...currentData,
          [type === 'for' ? 'forAmount' : 'againstAmount']: amount,
          betType: amount > 0 ? type : null
        };
      }

      // Check if selection limit is exceeded
      const selectedCount = Object.values(newData).filter(data => 
        data.forAmount > 0 || data.againstAmount > 0
      ).length;

      if (selectedCount > Math.floor(bet.users.length * 0.8)) {
        setShowLimitAlert(true);
        return prev;
      }

      return newData;
    });
  };

  const totalBetAmount = useMemo(() => {
    return Object.values(betData).reduce((sum, data) => 
      sum + data.forAmount + data.againstAmount, 0
    );
  }, [betData]);
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
      );

      if (response.data.status === 'success') {
        return response.data.data.company;
      }
      throw new Error('Failed to recalculate stakes');
    } catch (error) {
      console.error('Error recalculating stakes:', error);
      throw error;
    }
  };

  const handleSubmitBet = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate user has enough tokens
      if (totalBetAmount > user.tokens) {
        setError('Insufficient tokens. Please reduce your bet amount.');
        return;
      }

      // Format bets data for API
      const bets = Object.entries(betData)
        .filter(([_, data]) => data.betType !== null)
        .map(([userId, data]) => {
          const user = bet.users.find(u => u.id === parseInt(userId));
          return {
            targetUserId: parseInt(userId),
            targetUserName: user.name,
            targetUserEnrollment: user.enrollmentNumber,
            betType: data.betType,
            amount: data.betType === 'for' ? data.forAmount : data.againstAmount
          };
        });

      // Place bets
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
      );

      if (betResponse.data.status === 'success') {
        // Recalculate stakes after bets are placed
        const updatedCompany = await recalculateStakes(bet.companyId);
        
        // Update user data
        await refreshUserData();
        
        // Show success message
        alert('Bets placed successfully and stakes recalculated!');
        onClose();
      }
    } catch (err) {
      console.error('Error processing bets:', err);
      setError(err.response?.data?.message || 'Error processing bets. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileClick = (enrollmentNumber) => {
    window.open(`https://channeli.in/student_profile/${enrollmentNumber}/`, '_blank');
  };

  return (
    <DialogContent className="max-w-4xl bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border border-gray-700 rounded-xl shadow-2xl p-8">
    <DialogHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-gray-700 pb-4">
      <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
         {bet.company} - {bet.profile}
      </DialogTitle>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
        <Badge variant="secondary" className="text-lg bg-emerald-500 text-gray-900 px-3 py-1 rounded-full shadow-md">
          <Coins className="h-5 w-5 mr-2" />
          Total Bet: {totalBetAmount} tokens
        </Badge>
      </div>
    </DialogHeader>

    <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

     <ScrollArea className="h-auto mt-4 rounded-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 border-b border-gray-700">
              <TableHead className="text-emerald-400 font-semibold">User</TableHead>
              <TableHead className="text-emerald-400 font-semibold">Enrollment</TableHead>
              <TableHead className="text-emerald-400 font-semibold">Stake</TableHead>
              <TableHead className="text-emerald-400 font-semibold text-center" colSpan={2}>Bet Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bet.users.map((user, index) => {
              const userData = betData[user.id] || { forAmount: 0, againstAmount: 0, betType: null };
              const isActive = userData.forAmount > 0 || userData.againstAmount > 0;

              return (
                <MotionTableRow
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${isActive ? "bg-gray-700/50" : "bg-gray-800/30"} hover:bg-gray-700/70 transition-colors duration-200`}
                >
                  <TableCell className="font-medium">
                    <span
                      className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
                      onClick={() => handleProfileClick(user.enrollmentNumber)}
                    >
                      {user.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 flex items-center"
                      onClick={() => handleProfileClick(user.enrollmentNumber)}
                    >
                      {user.enrollmentNumber}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-blue-500 text-blue-400 px-2 py-0.5 text-xs">
                        For: {user.forStake}x
                      </Badge>
                      <Badge variant="outline" className="border-red-500 text-red-400 px-2 py-0.5 text-xs">
                        Against: {user.againstStake}x
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="w-64">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-4 w-4 text-blue-400" />
                        <Slider
                          value={[userData.forAmount]}
                          onValueChange={([value]) => handleBetChange(user.id, value, 'for')}
                          max={1000}
                          step={10}
                          className="w-32"
                          disabled={userData.betType === 'against'}
                        />
                        <span className="w-16 text-right">{userData.forAmount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="h-4 w-4 text-red-400" />
                        <Slider
                          value={[userData.againstAmount]}
                          onValueChange={([value]) => handleBetChange(user.id, value, 'against')}
                          max={1000}
                          step={10}
                          className="w-32"
                          disabled={userData.betType === 'for'}
                        />
                        <span className="w-16 text-right">{userData.againstAmount}</span>
                      </div>
                    </div>
                  </TableCell>
                </MotionTableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex items-center justify-end mt-6">
        <Button 
          onClick={handleSubmitBet} 
          disabled={isSubmitting || selectedUsers === 0 || totalBetAmount <= 0}
          className="bg-emerald-500 text-gray-900 hover:bg-emerald-600 font-semibold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Bet...' : 'Submit Bet'}
        </Button>
      </div>

      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="bg-gray-800 text-gray-100 border border-gray-700 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-400 flex items-center text-xl font-bold">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Selection Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 mt-2">
              You can't select more than 80% of the total users. Please adjust your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowLimitAlert(false)} className="bg-emerald-500 text-gray-900 hover:bg-emerald-600 font-semibold px-4 py-2 rounded-md transition-colors duration-200 mt-4">
            Close
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  );
}

export default BettingMenuDialog;