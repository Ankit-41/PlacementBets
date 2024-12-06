// components/skeletons/MyBetsSkeleton.jsx
'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const StatsCardSkeleton = () => (
  <Card className="bg-gray-800 border border-emerald-500/30 overflow-hidden relative">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-6 sm:h-7 w-20 bg-gray-700 rounded animate-pulse"></div>
    </CardContent>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
  </Card>
)

const TableRowSkeleton = () => (
  <TableRow className="hover:bg-gray-700/50">
    <TableCell>
      <div className="h-4 w-28 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></div>
    </TableCell>
  </TableRow>
)

export function MyBetsSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-8 overflow-hidden">
      {/* Title Skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 sm:h-12 w-48 sm:w-64 bg-gray-800 rounded animate-pulse mx-auto mb-2"></div>
        <div className="h-4 sm:h-5 w-36 sm:w-48 bg-gray-800 rounded animate-pulse mx-auto"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-1 rounded-full flex">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="px-3 sm:px-6 py-1 sm:py-2 mx-1 rounded-full bg-gray-700 animate-pulse"
              style={{ width: '80px' }}
            />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700">
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm">Student Name</TableHead>
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm">Type</TableHead>
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm">Amount</TableHead>
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm hidden sm:table-cell">Company</TableHead>
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm">Stake</TableHead>
                <TableHead className="font-bold text-emerald-400 text-xs sm:text-sm">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}