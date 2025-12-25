import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Mail, Shield } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SecureAuth</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-3xl p-8 md:p-12 animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome, {user?.username}!
            </h2>
            <p className="text-lg text-gray-600">
              You're successfully logged into your secure dashboard
            </p>
          </div>

          {/* User Info Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-semibold text-gray-900">{user?.username}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-semibold text-green-600">Verified & Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-purple-100">Secure</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Protected</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">OTP</div>
                <div className="text-indigo-100">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
