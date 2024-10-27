import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Users, BarChart, TrendingUp, AlertTriangle, Info, DollarSign, Smile } from 'lucide-react'

import LimitedActiveBets from "./LimitedActiveBets" // Assume this is a custom component

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('login')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [enrollmentNumber, setEnrollmentNumber] = useState('')
    const [enrollmentError, setEnrollmentError] = useState('')

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        if (confirmPassword && e.target.value !== confirmPassword) {
            setPasswordError("Passwords don't match")
        } else {
            setPasswordError('')
        }
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
        if (password && e.target.value !== password) {
            setPasswordError("Passwords don't match")
        } else {
            setPasswordError('')
        }
    }

    const handleEnrollmentChange = (e) => {
        const value = e.target.value
        setEnrollmentNumber(value)
        if (value.length === 8 && /^\d+$/.test(value)) {
            setEnrollmentError('')
        } else {
            setEnrollmentError('Enrollment number must be exactly 8 digits')
        }
    }

    const handleSignUpSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match")
            return
        }
        if (enrollmentNumber.length !== 8 || !/^\d+$/.test(enrollmentNumber)) {
            setEnrollmentError('Enrollment number must be exactly 8 digits')
            return
        }
        // Proceed with sign up logic
        console.log('Sign up submitted')
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black"></div>

            {/* Background Animations */}
            <motion.div
                className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-full opacity-20 animate-pulse"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.3 }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-tr from-blue-500 via-green-500 to-teal-600 rounded-full opacity-20 animate-pulse"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.25 }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            />

            <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-12">
                {/* Left Section - Authentication */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2"
                >
                    <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-3xl p-6">
                        <CardHeader className="text-center">
                            <CardTitle className="text-4xl font-extrabold text-yellow-400 flex items-center justify-center gap-3">
                                <img src="/mainlogo.svg" alt="JobJinx Logo" className="w-16 h-16" />
                                JobJinx
                            </CardTitle>
                            <CardDescription className="mt-2 text-lg text-gray-200">
                                Predict. Bet. Win. Experience the thrill of betting on college placements!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-700 rounded-full p-1 mb-6">
                                    <TabsTrigger
                                        value="login"
                                        className={`py-2 px-4 text-center text-gray-200 font-semibold rounded-full ${
                                            activeTab === 'login'
                                                ? 'bg-yellow-500 text-black'
                                                : 'hover:bg-gray-600'
                                        }`}
                                    >
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup"
                                        className={`py-2 px-4 text-center text-gray-200 font-semibold rounded-full ${
                                            activeTab === 'signup'
                                                ? 'bg-yellow-500 text-black'
                                                : 'hover:bg-gray-600'
                                        }`}
                                    >
                                        Sign Up
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="login">
                                    <form className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="text-sm text-yellow-300 bg-yellow-700/30 p-3 rounded-lg">
                                                <p className="flex items-center justify-center gap-1">
                                                    <span className="font-medium">Note:</span>
                                                    Only institute Gsuite allowed
                                                </p>
                                            </div>
                                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                                            <Input id="email" type="email" required className="bg-gray-700 text-gray-100 placeholder-gray-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                                            <Input id="password" type="password" required className="bg-gray-700 text-gray-100 placeholder-gray-400" />
                                        </div>
                                        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-full transition-colors duration-300">
                                            Login
                                        </Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="signup">
                                    <form className="space-y-6" onSubmit={handleSignUpSubmit}>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                            <Input id="name" type="text" required className="bg-gray-700 text-gray-100 placeholder-gray-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="enrol" className="text-gray-300">Enrollment Number</Label>
                                            <Input
                                                id="enrol"
                                                type="text"
                                                required
                                                value={enrollmentNumber}
                                                onChange={handleEnrollmentChange}
                                                maxLength={8}
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400"
                                            />
                                            {enrollmentError && (
                                                <p className="text-red-400 text-sm">{enrollmentError}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-yellow-300 bg-yellow-700/30 p-3 rounded-lg">
                                                <p className="flex items-center justify-center gap-1">
                                                    <span className="font-medium">Note:</span>
                                                    Only institute Gsuite allowed
                                                </p>
                                            </div>
                                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                                            <Input id="email" type="email" required className="bg-gray-700 text-gray-100 placeholder-gray-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                value={password}
                                                onChange={handlePasswordChange}
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400"
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="text-red-400 text-sm">{passwordError}</p>
                                        )}
                                        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-full transition-colors duration-300">
                                            Sign Up
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Section - Features & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full md:w-1/2 space-y-8"
                >
                 
                    <LimitedActiveBets />

                    

                    {/* Explore Features Button */}
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-4">
                            Want to learn more about how JobJinx works?
                        </p>
                        <Button variant="outline" className="group bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 transition-colors duration-300 px-6 py-3 rounded-full flex items-center justify-center mx-auto">
                            Explore Features
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Disclaimer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: AlertTriangle, text: "For entertainment only" },
                            { icon: Info, text: "Not affiliated with IIT Roorkee or placement cells" },
                            { icon: DollarSign, text: "No real job predictions or monetary rewards" },
                            { icon: Smile, text: "Participation is purely for fun—please enjoy responsibly" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-start gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-xl shadow-inner transition-transform duration-300"
                            >
                                {item.icon && <item.icon size={20} className="text-yellow-400 mt-1" />}
                                <div className="text-sm text-gray-300">
                                    {item.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
