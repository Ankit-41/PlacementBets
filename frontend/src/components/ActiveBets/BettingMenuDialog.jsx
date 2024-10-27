import React, { useState, useMemo, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Coins, ExternalLink, AlertTriangle, X } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from 'framer-motion';

export function BettingMenuDialog({ bet, onClose }) {
  const [betAmounts, setBetAmounts] = useState({});
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const selectedUsers = useMemo(() => {
    return Object.keys(betAmounts).filter(id => betAmounts[id] > 0);
  }, [betAmounts]);

  const handleBetAmountChange = (userId, amount) => {
    setBetAmounts(prev => {
      const newAmounts = { ...prev, [userId]: amount };
      const selectedCount = Object.values(newAmounts).filter(a => a > 0).length;
      if (selectedCount > Math.floor(bet.users.length * 0.4)) {
        setShowLimitAlert(true);
        return prev;
      }
      return newAmounts;
    });
  };

  const handleSubmitBet = () => {
    console.log("Submitting bet:", {
      company: bet.company,
      selectedUsers: selectedUsers.map(id => ({
        id,
        amount: betAmounts[id]
      })),
    });
    alert("Bet submitted successfully!");
    setBetAmounts({});
    onClose();
  };

  const totalBetAmount = useMemo(() => {
    return Object.values(betAmounts).reduce((sum, amount) => sum + amount, 0);
  }, [betAmounts]);

  useEffect(() => {
    setBetAmounts(bet.users.reduce((acc, user) => {
      acc[user.id] = 0;
      return acc;
    }, {}));
  }, [bet]);

  const handleProfileClick = (enrollmentNumber) => {
    window.open(`https://channeli.in/student_profile/${enrollmentNumber}/`, '_blank');
  };

  return (
    <DialogContent className="max-w-4xl bg-gray-900 text-gray-100">
      <DialogHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <DialogTitle className="text-2xl text-yellow-400">
          {bet.company}
        </DialogTitle>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
          <Badge variant="secondary" className="text-lg bg-yellow-500 text-gray-900">
            <Coins className="h-5 w-5 mr-2" />
            Total Bet: {totalBetAmount} tokens
          </Badge>
          <DialogClose className="rounded-full p-2 hover:bg-gray-800 transition-colors duration-200" >
            {/* <X className="h-5 w-5 text-gray-400" /> */}
          </DialogClose>
        </div>
      </DialogHeader>
      <ScrollArea className="h-[60vh] mt-4 rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Enrollment</TableHead>
              <TableHead className="text-gray-300">Stake</TableHead>
              <TableHead className="text-gray-300">Bet Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bet.users.map((user) => (
              <TableRow key={user.id} className={betAmounts[user.id] > 0 ? "bg-gray-700" : "bg-gray-800"}>
                <TableCell className="font-medium">
                  <span
                    className="cursor-pointer hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => handleProfileClick(user.enrollmentNumber)}
                  >
                    {user.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="cursor-pointer hover:text-yellow-400 transition-colors duration-200 flex items-center"
                    onClick={() => handleProfileClick(user.enrollmentNumber)}
                  >
                    {user.enrollmentNumber}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">{user.stake}x</Badge>
                </TableCell>
                <TableCell className="w-64">
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[betAmounts[user.id] || 0]}
                      onValueChange={([value]) => handleBetAmountChange(user.id, value)}
                      max={1000}
                      step={10}
                      className="w-40"
                    />
                    <span className="w-16 text-right">{betAmounts[user.id] || 0}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-end mt-4">
        <Button 
          onClick={handleSubmitBet} 
          disabled={selectedUsers.length === 0 || totalBetAmount <= 0}
          className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
        >
          Submit Bet
        </Button>
      </div>
      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="bg-gray-800 text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Selection Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              You can't select more than 40% of the total users. Please adjust your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowLimitAlert(false)} className="bg-yellow-500 text-gray-900 hover:bg-yellow-600">
            Close
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  );
}