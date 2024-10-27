import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Coins, ExternalLink, X, CheckCircle, XCircle } from 'lucide-react';

export function ExpiredBetDetailsDialog({ bet, onClose }) {
  const handleProfileClick = (enrollmentNumber) => {
    window.open(`https://channeli.in/student_profile/${enrollmentNumber}/`, '_blank');
  };

  return (
    <DialogContent className="max-w-4xl bg-gray-900 text-gray-100">
      <DialogHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <DialogTitle className="text-2xl text-yellow-400">
          {bet.company} - Expired Bet Details
        </DialogTitle>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
          <Badge variant="secondary" className={`text-lg ${bet.outcome === 'win' ? 'bg-green-500' : 'bg-red-500'} text-gray-900`}>
            {bet.outcome === 'win' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
            {bet.outcome.toUpperCase()}
          </Badge>
          <DialogClose className="rounded-full p-2 hover:bg-gray-800 transition-colors duration-200">
            <X className="h-5 w-5 text-gray-400" />
          </DialogClose>
        </div>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Expiration Date:</span>
          <span className="text-gray-200">{bet.expirationDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Stake:</span>
          <span className="text-gray-200">{bet.totalStake} tokens</span>
        </div>
      </div>
      <ScrollArea className="h-[50vh] mt-4 rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Enrollment</TableHead>
              <TableHead className="text-gray-300">Stake</TableHead>
              <TableHead className="text-gray-300">Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bet.users.map((user) => (
              <TableRow key={user.id} className="bg-gray-800">
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
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    {user.stake} tokens
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={bet.outcome === 'win' ? 'success' : 'destructive'} className="font-bold">
                    {bet.outcome === 'win' ? `+${user.payout}` : `-${user.stake}`} tokens
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </DialogContent>
  );
}