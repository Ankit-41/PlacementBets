// import React, { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogTrigger } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Users, Clock, TrendingUp } from 'lucide-react'
// import { motion } from 'framer-motion'
// import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog'

// // Import the same activeBets data or reuse the existing ActiveBets component's data
// import { activeBets } from '../ActiveBets/ActiveBets'

// const MotionCard = motion(Card)

// export default function LimitedActiveBets() {
//   const [selectedBet, setSelectedBet] = useState(null)

//   // Display only the first two bets
//   const displayedBets = activeBets.slice(0, 2)

//   return (
//     <div className="space-y-6 p-4 bg-gray-900">
//       {/* Updated Active Bets Header */}
//       <motion.div 
//         className="text-center mb-4"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
//           Active Bets
//         </h2>
//       </motion.div>

//       {/* Limited Active Bets Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-2 lg:gap-8">
//         {displayedBets.map((bet, index) => (
//           <Dialog key={bet.id} onOpenChange={(open) => {
//             if (open) setSelectedBet(bet)
//             else setSelectedBet(null)
//           }}>
//             <DialogTrigger asChild>
//               <MotionCard 
//                 className="cursor-pointer bg-gray-800 bg-opacity-60 backdrop-blur-md hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-700 hover:border-yellow-500 w-full lg:w-4/4 mx-auto"
//                 whileHover={{ scale: 1.03 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.05 }}
//               >
//                 <CardHeader className="flex flex-col gap-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-xl font-bold text-yellow-400">{bet.company}</CardTitle>
//                     <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500 text-gray-900">
//                       <Users className="h-4 w-4" />
//                       {bet.users.length}
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between items-center text-sm text-gray-400">
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       Expires in: {bet.expiresIn}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <TrendingUp className="h-4 w-4" />
//                       Total Stake: {bet.totalStake}x
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-2">
//                   <p className="text-sm font-semibold text-gray-300 mb-2">Top Bettors:</p>
//                   <div className="space-y-2">
//                     {bet.users.slice(0, 2).map((user) => (
//                       <div key={user.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
//                         <span className="text-sm text-gray-200">{user.name}</span>
//                         <Badge variant="outline" className="text-yellow-400 border-yellow-500">
//                           {user.stake}x
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </MotionCard>
//             </DialogTrigger>
            
//           </Dialog>
//         ))}
//       </div>
//     </div>
//   )
// }
