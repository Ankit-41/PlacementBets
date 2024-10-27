import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target, ArrowUpRight, ArrowDownRight, Crown, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

// Mock data for the leaderboard
const leaderboardData = [
  { id: 1, name: 'Alice Johnson', avatar: '/avatar1.jpg', tokens: 15000, successfulBets: 42, totalBets: 50, streak: 7, change: 2 },
  { id: 2, name: 'Bob Smith', avatar: '/avatar2.jpg', tokens: 12500, successfulBets: 38, totalBets: 48, streak: 5, change: -1 },
  { id: 3, name: 'Charlie Brown', avatar: '/avatar3.jpg', tokens: 11000, successfulBets: 35, totalBets: 45, streak: 3, change: 1 },
  { id: 4, name: 'Diana Prince', avatar: '/avatar4.jpg', tokens: 10500, successfulBets: 33, totalBets: 44, streak: 4, change: 0 },
  { id: 5, name: 'Ethan Hunt', avatar: '/avatar5.jpg', tokens: 9800, successfulBets: 30, totalBets: 42, streak: 2, change: 3 },
  { id: 6, name: 'Fiona Gallagher', avatar: '/avatar6.jpg', tokens: 9200, successfulBets: 28, totalBets: 40, streak: 1, change: -2 },
  { id: 7, name: 'George Costanza', avatar: '/avatar7.jpg', tokens: 8500, successfulBets: 25, totalBets: 38, streak: 0, change: 0 },
  { id: 8, name: 'Hermione Granger', avatar: '/avatar8.jpg', tokens: 8000, successfulBets: 23, totalBets: 36, streak: 2, change: 1 },
  { id: 9, name: 'Ian Gallagher', avatar: '/avatar9.jpg', tokens: 7500, successfulBets: 20, totalBets: 34, streak: 1, change: -1 },
  { id: 10, name: 'Jessica Day', avatar: '/avatar10.jpg', tokens: 7000, successfulBets: 18, totalBets: 32, streak: 0, change: 2 },
];

// Updated podiumOrder to map ranks correctly for different screen sizes
// For small screens: [0, 1, 2] => Rank1, Rank2, Rank3
// For large screens: [1, 0, 2] => Rank2, Rank1, Rank3
const podiumOrder = [1, 0, 2];

const TopThreeCard = ({ user, rank }) => {
  const getBgGradient = () => {
    switch(rank) {
      case 1:
        return 'bg-gradient-to-b from-yellow-500 to-yellow-700 border-yellow-500';
      case 2:
        return 'bg-gradient-to-b from-gray-600 to-gray-800 border-gray-600';
      case 3:
        return 'bg-gradient-to-b from-orange-500 to-orange-700 border-orange-500';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch(rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-500" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-500" />;
      default:
        return null;
    }
  };

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
        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
          <motion.div
            className="mb-3"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar className={`${rank === 1 ? 'w-20 h-20' : 'w-16 h-16'} border-2 border-white shadow-lg`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </motion.div>
          
          <h3 className={`${rank === 1 ? 'text-xl' : 'text-lg'} font-bold mb-2 text-center text-gray-200`}>{user.name}</h3>
          
          <div className="flex items-center mb-2">
            <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
            <span className={`${rank === 1 ? 'text-base' : 'text-sm'} font-bold text-gray-200`}>{user.tokens.toLocaleString()} Tokens</span>
          </div>

          <div className="w-full">
            <div className="text-xs text-center mb-1 text-gray-300">Success Rate</div>
            <div className="flex items-center justify-center">
              <Progress 
                value={(user.successfulBets / user.totalBets) * 100} 
                className={`${rank === 1 ? 'w-32' : 'w-24'} h-2 mr-2 bg-gray-700`}
              />
              <span className="text-xs font-medium text-gray-200">
                {((user.successfulBets / user.totalBets) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ChangeIndicator = ({ change }) => {
  if (change > 0) {
    return <ArrowUpRight className="text-green-500" />;
  } else if (change < 0) {
    return <ArrowDownRight className="text-red-500" />;
  }
  return null;
};

const fireworks = () => {
  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 10, spread: 200, ticks: 10, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 500 * (timeLeft / duration);
    
    // Confetti
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
    }));

    // "Fireworks"
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
    });

  }, 250);
};

export default function Leaderboard() {
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    const celebrationInterval = setInterval(() => {
      fireworks();
    }, 8000);

    return () => clearInterval(celebrationInterval);
  }, []);

  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="container mx-auto py-2 px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          JobJinx Leaderboard
        </h1>
        <p className="text-lg text-gray-400">Celebrating Our Top Performers</p>
      </motion.div>
      
      {/* Top 3 Winners - Updated flex container */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-4 mb-16">
        {topThree.map((user, index) => (
          <TopThreeCard key={user.id} user={user} rank={index + 1} />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <AnimatedStatsCard
          title="Total Bets Placed"
          value={leaderboardData.reduce((sum, user) => sum + user.totalBets, 0)}
          icon={<Target className="h-5 w-5 text-yellow-500" />}
        />
        <AnimatedStatsCard
          title="Average Success Rate"
          value={`${(leaderboardData.reduce((sum, user) => sum + (user.successfulBets / user.totalBets), 0) / leaderboardData.length * 100).toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
        <AnimatedStatsCard
          title="Total Tokens in Play"
          value={leaderboardData.reduce((sum, user) => sum + user.tokens, 0).toLocaleString()}
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
        />
      </div>

      {/* Full Leaderboard */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-200">Complete Rankings</h2>
        <LeaderboardTable data={leaderboardData} hoveredUser={hoveredUser} setHoveredUser={setHoveredUser} />
      </div>
    </div>
  );
}

const LeaderboardTable = ({ data, hoveredUser, setHoveredUser }) => (
  <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
    <Table className="min-w-full">
      <TableHeader>
        <TableRow className="bg-gray-700">
          <TableHead className="w-[50px] font-bold text-gray-200">Rank</TableHead>
          <TableHead className="font-bold text-gray-200">User</TableHead>
          <TableHead className="font-bold text-gray-200">Tokens</TableHead>
          <TableHead className="text-center font-bold text-gray-200">Success Rate</TableHead>
          <TableHead className="text-center font-bold text-gray-200">Streak</TableHead>
          <TableHead className="text-center font-bold text-gray-200">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => (
          <motion.tr
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onHoverStart={() => setHoveredUser(user.id)}
            onHoverEnd={() => setHoveredUser(null)}
            className="hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <TableCell className="font-medium text-gray-200">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-yellow-500 text-gray-900">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-gray-200">{user.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium text-gray-200">{user.tokens.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Progress 
                  value={(user.successfulBets / user.totalBets) * 100} 
                  className="w-24 h-2 bg-gray-700"
                />
                <span className="text-xs font-medium text-gray-200">
                  {((user.successfulBets / user.totalBets) * 100).toFixed(1)}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant={user.streak > 0 ? "default" : "secondary"} className="font-medium">
                {user.streak} 🔥
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <ChangeIndicator change={user.change} />
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  </div>
);

const AnimatedStatsCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="bg-gray-800 bg-opacity-80 border-2 border-yellow-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-2xl font-bold text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);
