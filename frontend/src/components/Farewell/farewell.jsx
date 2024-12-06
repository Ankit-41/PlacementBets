'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Send, ChevronDown, Info } from 'lucide-react'

export default function FarewellPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 text-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <Card className="bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden">
          <CardContent className="p-6 md:p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-6 md:mb-8 text-center"
            >
              <div className="flex items-center justify-center space-x-3 mb-4 md:mb-6">
                <img src="./green_bg_logo.png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />
                <span className="text-2xl md:text-3xl font-bold text-white">JobJinx</span>
              </div>
              <Heart className="w-16 h-16 md:w-20 md:h-20 text-pink-500 mx-auto" />
            </motion.div>

            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Thank You & Farewell
            </motion.h1>

            <motion.div
              className="space-y-4 md:space-y-6 text-gray-300 text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-lg md:text-xl font-semibold text-purple-300">
                Dear JobJinx Community,
              </p>

              <p>
                We regret to announce that JobJinx will be going offline as of 1:11 AM on November 27, 2024.
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 md:p-6 my-6 md:my-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-blue-300 mb-2">Our Original Vision</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      We aimed to create a platform that would provide better placement insights, alumni connections, and company filtering features. The betting system, while engaging, overshadowed these core objectives and raised valid concerns about its impact on the placement process.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                We want to sincerely apologize if our platform caused any distress or anxiety. This experience has taught us valuable lessons about responsibility and the importance of considering all potential implications of our innovations.
              </p>

              <p className="font-semibold text-purple-300">
                Important Information:
              </p>

              <ul className="list-none space-y-2 pl-4 md:pl-6">
                {[
                  'All active bets will be cancelled',
                  'All user data will be permanently deleted',
                  'This will be our last message to you',
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center text-sm md:text-base"
                  >
                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2 text-pink-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <p>
                To our users who trusted us with their time and engagement, thank you. Your feedback and participation helped us understand both the potential and limitations of our approach to supporting the placement process.
              </p>

              <div className="mt-6 md:mt-8 text-center">
                <p className="font-semibold text-lg md:text-xl text-purple-300">
                  We wish you all the best in your placement journey.
                </p>
                <p className="text-xs md:text-sm mt-2 text-gray-400">
                  - The JobJinx Team
                </p>
                <p className="text-xs mt-4 text-gray-500 italic">
                  Made with ❤️ by someone around you
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 md:mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={() => window.location.href = 'mailto:noreply.jobjinx@gmail.com'}
              >
                <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Contact Support
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}