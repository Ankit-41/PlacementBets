// components/Aaiye/LandingPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Loader2, Users, BarChart, TrendingUp, AlertTriangle, Info, DollarSign, Smile } from 'lucide-react';
import { useAuth } from './../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LimitedActiveBets from "./LimitedActiveBets";

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
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
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Reset verification states when email changes
        setIsEmailVerified(false);
        setIsOtpSent(false);
        setShowOtpVerification(false);
        setOtpError('');
    };
    // Function to send OTP
    const handleSendOTP = async () => {
        try {
            console.log('Sending OTP to:', email); // Debug log

            // Validate email before sending
            if (!email) {
                setOtpError('Please enter an email address');
                return;
            }

            if (!email.toLowerCase().endsWith('iitr.ac.in')) {
                setOtpError('Please use an IITR email address');
                return;
            }

            // Show loading state
            setIsLoading(true);

            const response = await axios.post('http://localhost:5000/api/auth/send-otp',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('OTP send response:', response.data); // Debug log

            if (response.data.status === 'success') {
                setIsOtpSent(true);
                setShowOtpVerification(true);
                setOtpError('');
                // Show success message
                toast.success('OTP sent successfully! Please check your email.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error); // Debug log
            setOtpError(error.response?.data?.message || 'Failed to send OTP');
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };
    // Function to verify OTP
    const handleVerifyOTP = async () => {
        if (!otp) {
            setOtpError('Please enter the OTP');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email,
                otp
            });

            if (response.data.status === 'success') {
                setIsEmailVerified(true);
                setShowOtpVerification(false);
                setOtpError('');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setIsLoading(false);
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

    // Modified handleSignUp to include email verification
    const handleSignUp = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate form
        if (!isEmailVerified) {
            setFormError('Please verify your email first');
            return;
        }

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
                            <CardTitle className="text-4xl font-bold text-emerald-400 flex items-center justify-center gap-3">
                                {/* <img src="/mainlogo.svg" alt="JobJinx Logo" className="w-16 h-16" /> */}
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
                                        className={`py-2 px-4 text-center text-gray-200 font-semibold rounded-full ${activeTab === 'login'
                                            ? 'bg-emerald-500 text-black'
                                            : 'hover:bg-gray-600'
                                            }`}
                                    >
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup"
                                        className={`py-2 px-4 text-center text-gray-200 font-semibold rounded-full ${activeTab === 'signup'
                                            ? 'bg-emerald-500 text-black'
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
                                        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-2 rounded-full transition-colors duration-300">
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
                                            <div className="flex gap-2">
                                                <Input
                                                    id="signup-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    placeholder="your.name@iitr.ac.in"
                                                    required
                                                    disabled={isEmailVerified}
                                                    className="bg-gray-700 text-gray-100 placeholder-gray-400"
                                                />
                                                {!isEmailVerified && (
                                                    <Button
                                                        type="button"
                                                        onClick={handleSendOTP}
                                                        disabled={isLoading || !email || isOtpSent}
                                                        className="min-w-[120px] bg-emerald-500 hover:bg-emerald-600"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : isOtpSent ? (
                                                            'Resend OTP'
                                                        ) : (
                                                            'Verify Email'
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {showOtpVerification && (
                                            <div className="space-y-2">
                                                <Label htmlFor="otp" className="text-gray-300">Enter OTP</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="otp"
                                                        type="text"
                                                        value={otp}
                                                        placeholder="Enter 6-digit OTP"
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        maxLength={6}
                                                        className="bg-gray-700 text-gray-100 placeholder-gray-400"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleVerifyOTP}
                                                        disabled={isLoading || !otp}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Verifying...
                                                            </>
                                                        ) : (
                                                            'Verify'
                                                        )}
                                                    </Button>
                                                </div>
                                                {otpError && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{otpError}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                        )}

                                        {isEmailVerified && (
                                            <Alert className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                <AlertDescription>Email verified successfully!</AlertDescription>
                                            </Alert>
                                        )}

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
                                        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-2 rounded-full transition-colors duration-300">
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