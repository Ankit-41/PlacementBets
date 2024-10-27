import React from 'react';
import { Briefcase, User, Settings, Book, Share2, BookOpen, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 bg-gray-900 border-b border-gray-700">
      {/* Logo */}
      <img src="/mainlogo.svg?height=50&width=50" alt="JobJinx Logo" className="w-21 h-16" />

      {/* Tokens Display */}
      <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-full">
        <Briefcase className="h-5 w-5 text-yellow-400" />
        <span className="text-sm font-medium text-gray-200">1000 tokens</span>
      </div>

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback className="bg-yellow-500 text-gray-900">U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-gray-800 text-gray-200 rounded-md shadow-lg border border-gray-700"
        >
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <User className="mr-2 h-5 w-5 text-yellow-400" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <Briefcase className="mr-2 h-5 w-5 text-yellow-400" /> My Bets
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <Settings className="mr-2 h-5 w-5 text-yellow-400" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <Book className="mr-2 h-5 w-5 text-yellow-400" /> Rules
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <Share2 className="mr-2 h-5 w-5 text-yellow-400" /> Refer and Earn
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <BookOpen className="mr-2 h-5 w-5 text-yellow-400" /> Resources
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 hover:bg-gray-700 transition-colors">
            <MessageSquare className="mr-2 h-5 w-5 text-yellow-400" /> Chat Bot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
