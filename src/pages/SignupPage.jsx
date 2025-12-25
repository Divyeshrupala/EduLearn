import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, Lock, User, Shield, ArrowRight, Check } from 'lucide-react';

export function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.sendOtp(email);
      toast({
        title: 'OTP Sent',
        description: 'Check your email for the verification code',
      });
      setStep(2);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.verifyOtpAndSetPassword(email, otp, password, username);
      const authUser = authService.mapUser(user);
      login(authUser);
      toast({
        title: 'Account created!',
        description: 'Welcome to EduLearn',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join thousands of learners worldwide</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
        </div>

        {step === 1 ? (
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
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 h-12"
                  maxLength={4}
                  required
                />
              </div>
              <p className="text-sm text-gray-500">Check your email for the code</p>
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
                  placeholder="Choose a username"
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-sm text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
