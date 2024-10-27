import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, TrendingUp, CheckCircle, XCircle, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog';
import { ExpiredBetDetailsDialog } from '../ExpiredBets/ExpiredBetDetailsDialog';

// Mock data for user's bets
const myBets = {
  active: [
    {
      id: 1,
      company: "TechCorp",
      expiresIn: "2d 5h",
      totalStake: 1500,
      myStake: 500,
      users: [
        { id: 1, name: "You", enrollmentNumber: "21112068", stake: 500 },
        { id: 2, name: "Alice Johnson", enrollmentNumber: "EN001", stake: 600 },
        { id: 3, name: "Bob Smith", enrollmentNumber: "EN002", stake: 400 },
      ],
    },
    {
      id: 2,
      company: "FinanceInc",
      expiresIn: "5d 12h",
      totalStake: 2000,
      myStake: 800,
      users: [
        { id: 4, name: "You", enrollmentNumber: "21112068", stake: 800 },
        { id: 5, name: "Charlie Brown", enrollmentNumber: "EN003", stake: 700 },
        { id: 6, name: "Diana Prince", enrollmentNumber: "EN004", stake: 500 },
      ],
    },
  ],
  expired: [
    {
      id: 3,
      company: "MegaCorp",
      expirationDate: "2023-05-15",
      totalStake: 3000,
      myStake: 1000,
      outcome: "win",
      myPayout: 2500,
      users: [
        { id: 7, name: "You", enrollmentNumber: "21112068", stake: 1000, payout: 2500 },
        { id: 8, name: "Eve Taylor", enrollmentNumber: "EN005", stake: 1200, payout: 3000 },
        { id: 9, name: "Frank Wilson", enrollmentNumber: "EN006", stake: 800, payout: 2000 },
      ],
    },
    {
      id: 4,
      company: "StartupX",
      expirationDate: "2023-05-10",
      totalStake: 1800,
      myStake: 600,
      outcome: "loss",
      myPayout: 0,
      users: [
        { id: 10, name: "You", enrollmentNumber: "21112068", stake: 600, payout: 0 },
        { id: 11, name: "Grace Davis", enrollmentNumber: "EN007", stake: 700, payout: 0 },
        { id: 12, name: "Henry Martinez", enrollmentNumber: "EN008", stake: 500, payout: 0 },
      ],
    },
  ],
};

const MotionCard = motion(Card);

// Component for individual Bet Cards
const BetCard = ({ bet, type, index, onOpenDialog }) => (
  <MotionCard 
    className="cursor-pointer bg-gray-800 bg-opacity-60 backdrop-blur-md hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-700 hover:border-yellow-500"
    whileHover={{ scale: 1.03 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    onClick={() => onOpenDialog(bet)}
  >
    <CardHeader className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold text-yellow-400">{bet.company}</CardTitle>
        {type === 'expired' && (
          <Badge variant="secondary" className={`flex items-center gap-1 ${bet.outcome === 'win' ? 'bg-green-500' : 'bg-red-500'} text-gray-900`}>
            {bet.outcome === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {bet.outcome.toUpperCase()}
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {type === 'active' ? `Expires in: ${bet.expiresIn}` : `Expired: ${bet.expirationDate}`}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Total Stake: {bet.totalStake} tokens
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-2">
      <div className="flex justify-between items-center bg-gray-700 rounded-lg p-2 mb-2">
        <span className="text-sm font-semibold text-gray-200">Your Stake:</span>
        <Badge variant="outline" className="text-yellow-400 border-yellow-500">
          {bet.myStake} tokens
        </Badge>
      </div>
      {type === 'expired' && (
        <div className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
          <span className="text-sm font-semibold text-gray-200">Your Payout:</span>
          <Badge variant={bet.outcome === 'win' ? 'success' : 'destructive'} className="font-bold">
            {bet.outcome === 'win' ? `+${bet.myPayout}` : `-${bet.myStake}`} tokens
          </Badge>
        </div>
      )}
    </CardContent>
  </MotionCard>
);

// Main MyBets Component
export default function MyBets() {
  const [selectedBet, setSelectedBet] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const handleOpenDialog = (bet) => {
    setSelectedBet(bet);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-2">
          <Coins className="h-8 w-8" />
          My Bets
        </h1>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-lg overflow-hidden">
          <TabsTrigger
            value="active"
            className={`flex items-center justify-center py-2 px-4 text-sm font-medium transition-colors duration-300 ${
              activeTab === 'active'
                ? 'bg-yellow-500 text-gray-900'
                : 'hover:bg-yellow-600 hover:text-white'
            }`}
          >
            Active Bets
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className={`flex items-center justify-center py-2 px-4 text-sm font-medium transition-colors duration-300 ${
              activeTab === 'expired'
                ? 'bg-yellow-500 text-gray-900'
                : 'hover:bg-yellow-600 hover:text-white'
            }`}
          >
            Expired Bets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ScrollArea className="h-auto max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {myBets.active.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} type="active" index={index} onOpenDialog={handleOpenDialog} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="expired">
          <ScrollArea className="h-auto max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {myBets.expired.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} type="expired" index={index} onOpenDialog={handleOpenDialog} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Dialogs for Bet Details */}
      {selectedBet && (
        <Dialog open={!!selectedBet} onOpenChange={() => setSelectedBet(null)}>
          {activeTab === "active" ? (
            <BettingMenuDialog bet={selectedBet} onClose={() => setSelectedBet(null)} />
          ) : (
            <ExpiredBetDetailsDialog bet={selectedBet} onClose={() => setSelectedBet(null)} />
          )}
        </Dialog>
      )}
    </div>
  );
}
