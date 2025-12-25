import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User, Mail, Shield, Edit2, Save } from 'lucide-react';

export function ProfilePage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { username }
      });

      if (error) throw error;

      if (data.user) {
        login({
          id: data.user.id,
          email: data.user.email,
          username: username,
        });
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="flex items-center space-x-6 mb-12 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Account Information
                </h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="pl-10 h-12 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Account Status</Label>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Verified & Active</p>
                      <p className="text-sm text-green-700">Your account is in good standing</p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="gradient-primary text-white flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUsername(user.username);
                        setIsEditing(false);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-purple-100">Courses Enrolled</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">0%</div>
                <div className="text-blue-100">Avg. Progress</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-indigo-100">Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
