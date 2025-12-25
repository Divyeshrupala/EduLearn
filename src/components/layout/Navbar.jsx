import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  BookOpen, 
  ShoppingCart, 
  User, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduLearn</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className={isActive('/') ? 'gradient-primary text-white' : ''}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Button>
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'default' : 'ghost'}
                    className={isActive('/dashboard') ? 'gradient-primary text-white' : ''}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    My Learning
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button 
                    variant={isActive('/cart') ? 'default' : 'ghost'}
                    className={isActive('/cart') ? 'gradient-primary text-white' : ''}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="font-semibold text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    My Learning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/cart')}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="gradient-primary text-white">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
