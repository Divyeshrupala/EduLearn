import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, Lock, User, ArrowRight, KeyRound } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.sendOtp(email);
      toast({
        title: 'OTP Sent!',
        description: 'Check your email for the verification code.',
      });
      setStep('verify');
    } catch (error: any) {
      toast({
        title: 'Failed to send OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.verifyOtpAndSetPassword(
        email,
        otp,
        password,
        username
      );
      const authUser = authService.mapUser(user);
      login(authUser);
      toast({
        title: 'Account created!',
        description: 'Welcome to SecureAuth.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Invalid OTP or error setting password',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="glass rounded-2xl p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            {step === 'email'
              ? 'Get started with your free account'
              : 'Enter the code sent to your email'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity group"
              disabled={loading}
            >
              {loading ? (
                'Sending OTP...'
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700">
                Verification Code
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 h-12 text-center text-2xl tracking-widest"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500">
                Minimum 6 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity group"
              disabled={loading}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('email')}
            >
              Back to email
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {step === 'email' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSendOtp(new Event('submit') as any)}
                className="text-primary font-semibold hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
