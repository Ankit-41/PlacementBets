import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Play, BarChart, Code, Package, Database, Brain, Cpu, MoreHorizontal } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog';
import ActiveBets from '../ActiveBets/ActiveBets';

// Mock data for live events
const liveEvents = [
  { company: 'TechCorp', users: [{ name: 'Alice', odds: '1.5x' }, { name: 'Bob', odds: '1.3x' }, { name: 'Charlie', odds: '1.8x' }] },
  { company: 'hihne', users: [{ name: 'Grace', odds: '1.7x' }, { name: 'Henry', odds: '1.3x' }, { name: 'Ivy', odds: '1.5x' }] },
  { company: 'FinanceInc', users: [{ name: 'David', odds: '1.2x' }, { name: 'Eve', odds: '1.6x' }, { name: 'Frank', odds: '1.4x' }] },
  { company: 'ConsultCo', users: [{ name: 'Grace', odds: '1.7x' }, { name: 'Henry', odds: '1.3x' }, { name: 'Ivy', odds: '1.5x' }] },
  { company: 'ebeig', users: [{ name: 'Grace', odds: '1.7x' }, { name: 'Henry', odds: '1.3x' }, { name: 'Ivy', odds: '1.5x' }] },
];

// Map categories to icons
const categoryIcons = {
  Quant: BarChart,
  SDE: Code,
  Product: Package,
  'Data Analyst': Database,
  'Data Scientist': Brain,
  Core: Cpu,
  Misc: MoreHorizontal,
};

const MotionCard = motion(Card);

export default function LiveBets() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAllBets, setShowAllBets] = useState(false);

  if (showAllBets) {
    return <ActiveBets />;
  }

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg">
      {/* Live Events Categories */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-200">
        <Play className="mr-2 h-6 w-6 text-yellow-500" /> Live Events
      </h2>
      
      <ScrollArea className="w-full rounded-lg border border-gray-700 bg-gray-800 bg-opacity-90 backdrop-blur-md p-2 mb-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700">
        <div className="flex space-x-4 py-3 px-2 sm:space-x-16">
          {['Quant', 'SDE', 'Product', 'Data Analyst', 'Data Scientist', 'Core', 'Misc'].map((category) => {
            const Icon = categoryIcons[category];
            return (
              <div key={category} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-900" />
                </div>
                <span className="mt-2 text-sm sm:text-base text-gray-200">{category}</span>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Live Bets Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200 mb-2 sm:mb-0">Live Bets</h2>
        <Button
          variant="outline"
          onClick={() => setShowAllBets(true)}
          className="w-full sm:w-auto bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          aria-label="View All Bets"
        >
          View All
        </Button>
      </div>

      {/* Live Bets Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {liveEvents.slice(0, 3).map((event, index) => (
          <Dialog key={index} onOpenChange={(open) => {
            if (open) setSelectedEvent(event);
            else setSelectedEvent(null);
          }}>
            <DialogTrigger asChild>
              <MotionCard 
                className="cursor-pointer bg-gray-800 bg-opacity-80 p-4 rounded-xl overflow-hidden shadow-2xl relative transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                whileHover={{ scale: 1.05 }}
                tabIndex={0} // Make card focusable for accessibility
                aria-label={`View details for ${event.company}`}
              >
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-200">{event.company}</h3>
                    <motion.span
                      className="text-xs bg-yellow-500 text-gray-900 px-2 py-1 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      aria-label="Live Status"
                    >
                      LIVE
                    </motion.span>
                  </div>
                  {event.users.map((user, userIndex) => (
                    <div key={userIndex} className="flex justify-between items-center text-sm sm:text-base text-gray-300 mb-2">
                      <span>{user.name}</span>
                      <span className="font-semibold text-yellow-400">{user.odds}</span>
                    </div>
                  ))}
                </CardContent>
              </MotionCard>
            </DialogTrigger>
            {selectedEvent && (
              <BettingMenuDialog 
                bet={{
                  company: selectedEvent.company,
                  users: selectedEvent.users.map((user, index) => ({
                    id: index + 1,
                    name: user.name,
                    enrollmentNumber: `EN${(index + 1).toString().padStart(3, '0')}`,
                    stake: parseFloat(user.odds)
                  }))
                }} 
                onClose={() => setSelectedEvent(null)} 
              />
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
}
