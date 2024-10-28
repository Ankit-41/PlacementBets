// components/Aaiye/LandingPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Users, BarChart, TrendingUp, AlertTriangle, Info, DollarSign, Smile } from 'lucide-react';
import { useAuth } from './../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LimitedActiveBets from "./LimitedActiveBets";

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [enrollmentError, setEnrollmentError] = useState('');
    const [formError, setFormError] = useState('');

    const { login, signup, error } = useAuth();
    const navigate = useNavigate();

    const handleEnrollmentChange = (e) => {
        const value = e.target.value;
        setEnrollmentNumber(value);
        if (value.length === 8 && /^\d+$/.test(value)) {
            setEnrollmentError('');
        } else {
            setEnrollmentError('Enrollment number must be exactly 8 digits');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (confirmPassword && value !== confirmPassword) {
            setPasswordError("Passwords don't match");
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (password && value !== password) {
            setPasswordError("Passwords don't match");
        } else {
            setPasswordError('');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await login(email, password);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            setFormError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setFormError('');
        
        // Validate form
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        if (enrollmentNumber.length !== 8 || !/^\d+$/.test(enrollmentNumber)) {
            setEnrollmentError('Enrollment number must be exactly 8 digits');
            return;
        }

        try {
            await signup({
                name,
                email,
                enrollmentNumber,
                password
            });
            navigate('/home');
        } catch (error) {
            console.error('Signup error:', error);
            setFormError(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* ... Background elements ... */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-12">
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
                                <TabsList className="grid w-full h-full grid-cols-2 bg-gray-700 rounded-full p-1 mb-6">
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

                                {/* Login Form */}
                                <TabsContent value="login">
                                    <form className="space-y-6" onSubmit={handleLogin}>
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                                            <Input 
                                                id="login-email" 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                                            <Input 
                                                id="login-password" 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required 
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400" 
                                            />
                                        </div>
                                        {(formError || error) && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                                <p className="text-red-400 text-sm text-center">{formError || error}</p>
                                            </div>
                                        )}
                                        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-full transition-colors duration-300">
                                            Login
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Signup Form */}
                                <TabsContent value="signup">
                                    <form className="space-y-6" onSubmit={handleSignUp}>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                            <Input 
                                                id="name" 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required 
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400" 
                                            />
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
                                            <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                                            <Input 
                                                id="signup-email" 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                                className="bg-gray-700 text-gray-100 placeholder-gray-400" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                                            <Input
                                                id="signup-password"
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
                                        {(formError || error || passwordError || enrollmentError) && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                                <p className="text-red-400 text-sm text-center">
                                                    {formError || error || passwordError || enrollmentError}
                                                </p>
                                            </div>
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

                {/* Right Section */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full md:w-1/2 space-y-8"
                >
                    <LimitedActiveBets />
                    {/* ... rest of your right section ... */}
                </motion.div>
            </div>
        </div>
    );
}