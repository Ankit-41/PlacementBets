// components/skeletons/LeaderboardSkeleton.jsx
'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const TopThreeCardSkeleton = ({ rank }) => {
  const getBgGradient = () => {
    switch(rank) {
      case 1: return 'bg-gradient-to-b from-yellow-500/30 to-yellow-700/30 border-yellow-500/30'
      case 2: return 'bg-gradient-to-b from-gray-600/30 to-gray-800/30 border-gray-600/30'
      case 3: return 'bg-gradient-to-b from-orange-500/30 to-orange-700/30 border-orange-500/30'
      default: return ''
    }
  }

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
    <div className={`${getWidth()} ${getHeight()} mx-auto sm:mx-2 mb-4 sm:mb-0`}>
      <Card className={`h-full ${getBgGradient()} border-2 shadow-lg relative overflow-hidden`}>
        <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4 h-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700 animate-pulse mb-2"></div>
          <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="w-full max-w-[120px]">
            <div className="h-2 w-16 bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="flex items-center justify-center">
              <div className="h-1 sm:h-2 w-16 sm:w-24 bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="h-3 w-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const StatsCardSkeleton = () => (
  <Card className="bg-gray-800 bg-opacity-80 border-2 border-green-500/30">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
    </CardContent>
  </Card>
)

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell className="w-[50px]">
      <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="flex items-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 animate-pulse mr-2"></div>
        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="flex items-center justify-center">
        <div className="w-16 sm:w-24 h-1 sm:h-2 bg-gray-700 rounded animate-pulse mr-2"></div>
        <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-5 w-12 bg-gray-700 rounded-full animate-pulse mx-auto"></div>
    </TableCell>
  </TableRow>
)

export function LeaderboardSkeleton() {
  return (
    <div className="bg-gray-900 p-4 container mx-auto">
      {/* Title Skeleton */}
      <div className="text-center mb-6">
        <div className="h-10 sm:h-12 w-64 sm:w-80 bg-gray-800 rounded animate-pulse mx-auto mb-2"></div>
        <div className="h-4 sm:h-5 w-48 sm:w-56 bg-gray-800 rounded animate-pulse mx-auto"></div>
      </div>
      
      {/* Top Three Cards Skeleton */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-2 sm:gap-4 mb-8">
        <TopThreeCardSkeleton rank={2} />
        <TopThreeCardSkeleton rank={1} />
        <TopThreeCardSkeleton rank={3} />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Table Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mx-auto mb-4"></div>
        <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-700">
                <TableHead className="w-[50px] font-bold text-gray-200 text-xs sm:text-sm">Rank</TableHead>
                <TableHead className="font-bold text-gray-200 text-xs sm:text-sm">User</TableHead>
                <TableHead className="font-bold text-gray-200 text-xs sm:text-sm">Tokens</TableHead>
                <TableHead className="text-center font-bold text-gray-200 text-xs sm:text-sm">Success</TableHead>
                <TableHead className="text-center font-bold text-gray-200 text-xs sm:text-sm">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}