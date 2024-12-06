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
import { Mail, Timer, Trophy } from 'lucide-react';
import { useAuth } from './../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import InfoModal from './InfoModal';
// Import react-toastify components and styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false); // Modal visibility state

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
                toast.error('Please enter an email address');
                return;
            }

            if (!email.toLowerCase().endsWith('iitr.ac.in')) {
                setOtpError('Please use an IITR email address');
                toast.error('Please use an IITR email address');
                return;
            }

            // Show loading state
            setIsLoading(true);

            const response = await axios.post('https://jobjinxbackend.vercel.app/api/auth/send-otp',
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
            toast.error('Please enter the OTP');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('https://jobjinxbackend.vercel.app/api/auth/verify-otp', {
                email,
                otp
            });

            if (response.data.status === 'success') {
                setIsEmailVerified(true);
                setShowOtpVerification(false);
                setOtpError('');
                toast.success('Email verified successfully!');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
            toast.error(error.response?.data?.message || 'Failed to verify OTP');
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
        setIsLoggingIn(true); // Set loading state to true when login starts

        try {
            await login(email, password);
            setShowInfoModal(true); // Show modal after successful login
            // navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setFormError(error.response?.data?.message || 'Login failed');
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoggingIn(false); // Set loading state to false when login completes or fails
        }
    };

    // Modified handleSignUp to include email verification
    const handleSignUp = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate form
        if (!isEmailVerified) {
            setFormError('Please verify your email first');
            toast.error('Please verify your email first');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
            toast.error("Passwords don't match");
            return;
        }

        if (enrollmentNumber.length !== 8 || !/^\d+$/.test(enrollmentNumber)) {
            setEnrollmentError('Enrollment number must be exactly 8 digits');
            toast.error('Enrollment number must be exactly 8 digits');
            return;
        }

        setIsSigningUp(true); // Set loading state to true when signup starts
        try {
            await signup({
                name,
                email,
                enrollmentNumber,
                password
            });
            setShowInfoModal(true); // Show modal after successful signup
            // navigate('/');
            toast.success('Signup successful! Welcome to JobJinx.');
        } catch (error) {
            console.error('Signup error:', error);
            setFormError(error.response?.data?.message || 'Signup failed');
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsSigningUp(false); // Set loading state to false when signup completes or fails
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[128px] opacity-20"></div>
                    <div className="absolute -left-40 -top-40 w-80 h-80 bg-purple-500 rounded-full blur-[128px] opacity-20"></div>
                    <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
                </div>

                <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-3xl p-6 border-gray-700">
                            <CardHeader className="text-center">
                                <CardTitle className="text-5xl font-bold text-emerald-400 flex items-center justify-center gap-3">
                                    <img src="./green_bg_logo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                                    JobJinx
                                </CardTitle>

                                <CardDescription className="mt-4 text-base text-gray-300">
                                Placement Data that Works for You | Real-Time Insights, Smart Predictions!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6 text-emerald-300 ">
                                    <TabsList className="grid w-full grid-cols-2 rounded-full p-1 mb-8">
                                        <TabsTrigger
                                            value="login"
                                            className={` mb-6 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'login'
                                                ? 'bg-emerald-500 text-gray-900 shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-600'
                                                }`}
                                        >
                                            Login
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="signup"
                                            className={`mb-6 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'signup'
                                                ? 'bg-emerald-500 text-gray-900 shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-600'
                                                }`}
                                        >
                                            Sign Up
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="login">
                                        <form className="space-y-6" onSubmit={handleLogin}>
                                            <div className="space-y-2">
                                                <Label htmlFor="login-email" className="text-gray-300 text-lg">Email</Label>
                                                <Input
                                                    id="login-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="your.email@iitr.ac.in"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="login-password" className="text-gray-300 text-lg">Password</Label>
                                                <Input
                                                    id="login-password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                            {(formError || error) && (
                                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>{formError || error}</AlertDescription>
                                                </Alert>
                                            )}
                                            <Button
                                                type="submit"
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-3 rounded-full transition-colors duration-300 text-lg"
                                                disabled={isLoggingIn}
                                            >
                                                {isLoggingIn ? (
                                                    <div className="flex items-center justify-center">
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Logging in...
                                                    </div>
                                                ) : (
                                                    'Login'
                                                )}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                    <div className="flex justify-end mt-5">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-emerald-400 hover:text-emerald-300 p-0 h-auto font-normal"
                                            onClick={() => setShowForgotPassword(true)}
                                        >
                                            Forgot Password?
                                        </Button>
                                    </div>
                                    <TabsContent value="signup">
                                        <form className="space-y-6" onSubmit={handleSignUp}>
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-gray-300 text-lg">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="enrol" className="text-gray-300 text-lg">Enrollment Number</Label>
                                                <Input
                                                    id="enrol"
                                                    type="text"
                                                    required
                                                    value={enrollmentNumber}
                                                    onChange={handleEnrollmentChange}
                                                    maxLength={8}
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="12345678"
                                                />
                                                {enrollmentError && (
                                                    <p className="text-red-400 text-sm mt-1">{enrollmentError}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signup-email" className="text-gray-300 text-lg">Email</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="signup-email"
                                                        type="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        placeholder="your.name@iitr.ac.in"
                                                        required
                                                        disabled={isEmailVerified}
                                                        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    />
                                                    {!isEmailVerified && (
                                                        <Button
                                                            type="button"
                                                            onClick={handleSendOTP}
                                                            disabled={isLoading || !email || isOtpSent}
                                                            className="min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-gray-900"
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
                                                    <Label htmlFor="otp" className="text-gray-300 text-lg">Enter OTP</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="otp"
                                                            type="text"
                                                            value={otp}
                                                            placeholder="Enter 6-digit OTP"
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            maxLength={6}
                                                            className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={handleVerifyOTP}
                                                            disabled={isLoading || !otp}
                                                            className="bg-green-500 hover:bg-green-600 text-gray-900"
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
                                                        <Alert variant="destructive" className="mt-2">
                                                            <AlertDescription>{otpError}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            )}

                                            {isEmailVerified && (
                                                <Alert className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                    <Smile className="h-4 w-4" />
                                                    <AlertDescription>Email verified successfully!</AlertDescription>
                                                </Alert>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="signup-password" className="text-gray-300 text-lg">Password</Label>
                                                <Input
                                                    id="signup-password"
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="Enter a strong password"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password" className="text-gray-300 text-lg">Confirm Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400 placeholder:opacity-70"
                                                    placeholder="Confirm your password"
                                                />
                                            </div>
                                            {(formError || error || passwordError || enrollmentError) && (
                                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {formError || error || passwordError || enrollmentError}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <Button
                                                type="submit"
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-3 rounded-full transition-colors duration-300 text-lg"
                                                disabled={isSigningUp}
                                            >
                                                {isSigningUp ? (
                                                    <div className="flex items-center justify-center">
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Signing up...
                                                    </div>
                                                ) : (
                                                    'Sign Up'
                                                )}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2 space-y-8"
                    >
                        <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-3xl p-6 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold text-emerald-400">How It Works ?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-500 p-3 rounded-full relative">
                                        <Mail className="h-6 w-6 text-gray-900" />
                                        <span className="absolute -top-2 -left-2 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-900">1</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Sign up with your IITR email to receive 100000 welcome tokens - your gateway to predicting placement outcomes for your peers.</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-500 p-3 rounded-full relative">
                                        <Users className="h-6 w-6 text-gray-900" />
                                        <span className="absolute -top-2 -left-2 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-900">2</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Browse shortlisted candidates for interviews, check their Channeli profiles by clicking enrollment numbers.</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-500 p-3 rounded-full relative">
                                        <TrendingUp className="h-6 w-6 text-gray-900" />
                                        <span className="absolute -top-2 -left-2 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-900">3</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Place your bets 'For' or 'Against' each candidate's final selection. Stake multipliers adjust in real-time based on betting patterns.</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-500 p-3 rounded-full relative">
                                        <Timer className="h-6 w-6 text-gray-900" />
                                        <span className="absolute -top-2 -left-2 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-900">4</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Watch as results unfold in real-time. Win instantly when results are announced, with automatic token redistribution.</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-500 p-3 rounded-full relative">
                                        <Trophy className="h-6 w-6 text-gray-900" />
                                        <span className="absolute -top-2 -left-2 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-900">5</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Compete on leaderboards with tokens, success rates, streaks, and analyze risky betters' profiles.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    </motion.div>
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                {showForgotPassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-emerald-400">Reset Password</h2>
                                <Button
                                    variant="ghost"
                                    className="text-gray-400 hover:text-gray-300"
                                    onClick={() => setShowForgotPassword(false)}
                                >
                                    ×
                                </Button>
                            </div>
                            <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
                        </div>
                    </div>
                )}
            </div>
            <InfoModal
                isVisible={showInfoModal}
                onClose={() => {
                    setShowInfoModal(false);
                    navigate('/'); // Redirect to home page on modal close
                }}
            />
        </>

    );
}