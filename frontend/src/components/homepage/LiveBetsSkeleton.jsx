// components/skeletons/LiveBetsSkeleton.jsx
'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Zap } from 'lucide-react'

function CategoryButtonSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 animate-pulse"></div>
      <div className="w-12 h-3 bg-gray-700 rounded animate-pulse"></div>
    </div>
  )
}

function EventCardSkeleton({ className }) {
  return (
    <Card className={cn("border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl overflow-hidden shadow-lg", className)}>
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-32 bg-gray-600 rounded animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
          </div>
        </div>
        
        {[1, 2].map((index) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
          </div>
        ))}
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-600 rounded animate-pulse mr-1"></div>
            <div className="h-3 w-20 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-600 rounded animate-pulse mr-1"></div>
            <div className="h-3 w-20 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LiveBetsSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center text-emerald-400">
        <Zap className="mr-2 h-6 w-6 md:h-8 md:w-8" /> Live Events
      </h2>
      
      <ScrollArea className="w-full rounded-lg backdrop-blur-md p-2 mb-6">
        <div className="flex space-x-8 py-2">
          {/* Category buttons skeleton */}
          {Array.from({ length: 7 }).map((_, index) => (
            <CategoryButtonSkeleton key={index} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-32 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}