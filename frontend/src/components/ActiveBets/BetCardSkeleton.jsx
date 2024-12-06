'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function BetCardSkeleton({ className }) {
  return (
    <Card className={cn("bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden", className)}>
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-r from-gray-800 to-gray-700 p-3">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-2 px-3">
        <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
              <div className="flex gap-1">
                <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BetCardsGridSkeleton() {
  return (
    <div className="min-h-screen space-y-4 p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-8 w-48 md:w-64 bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
        <div className="h-4 w-36 md:w-48 bg-gray-700 rounded animate-pulse mx-auto"></div>
      </motion.div>

      <motion.div
        className="max-w-md mx-auto mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            disabled
            type="text"
            placeholder="Search by companies or profiles..."
            className="w-full pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}