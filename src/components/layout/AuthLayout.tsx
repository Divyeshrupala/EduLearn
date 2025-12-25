import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-primary opacity-90" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
};
