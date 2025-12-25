import React from 'react';
import { GraduationCap } from 'lucide-react';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-white">EduLearn</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
