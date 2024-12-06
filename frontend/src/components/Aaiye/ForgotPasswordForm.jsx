import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Smile } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      toast.error('Please enter your email address');
      return;
    }

    if (!email.toLowerCase().endsWith('iitr.ac.in')) {
      setError('Please use your IITR email address');
      toast.error('Please use your IITR email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://jobjinxbackend.vercel.app/api/auth/send-otp', {
        email
      });

      console.log('OTP Response:', response.data); // Debug log

      if (response.data.status === 'success') {
        setIsOtpSent(true);
        setStep(2);
        toast.success('OTP sent successfully! Please check your email.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error.response || error); // Debug log
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://jobjinxbackend.vercel.app/api/auth/verify-otp', {
        email,
        otp
      });

      console.log('Verify OTP Response:', response.data); // Debug log

      if (response.data.status === 'success') {
        setIsEmailVerified(true);
        setStep(3);
        toast.success('OTP verified successfully!');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error.response || error); // Debug log
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://jobjinxbackend.vercel.app/api/auth/reset-password', {
        email,
        otp,
        password: newPassword
      });

      if (response.data.status === 'success') {
        toast.success('Password reset successful! You can now login with your new password.');
        onClose();
      }
    } catch (error) {
      console.error('Reset Password Error:', error.response || error); // Debug log
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-300 text-lg">Email</Label>
            <div className="flex gap-2">
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@iitr.ac.in"
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={isEmailVerified}
              />
              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !email || isEmailVerified}
                className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : isOtpSent ? (
                  'Resend OTP'
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reset-otp" className="text-gray-300 text-lg">Enter OTP</Label>
            <div className="flex gap-2">
              <Input
                id="reset-otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || !otp}
                className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-gray-300 text-lg">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password" className="text-gray-300 text-lg">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isEmailVerified && (
        <Alert className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <Smile className="h-4 w-4" />
          <AlertDescription>Email verified successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ForgotPasswordForm;