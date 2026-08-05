import React from 'react';
import { UserCheck, Home as HomeIcon, UserPlus, Shield } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'register' | 'success' | 'status' | 'admin';
  setCurrentView: (view: 'home' | 'register' | 'success' | 'status' | 'admin') => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onAdminClick
}) => {
  return (
    <>
      {/* Top Banner for Closing Date */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-blue-200 px-4 py-2 text-xs font-medium text-center border-b border-blue-800/50 flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>⚡ Registration & Bookings close on <strong className="text-white">20th August 2026</strong>. Secure your seat before Registration ends!</span>
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo as Admin Button on long press / click or title click */}
          <div 
            onClick={onAdminClick}
            className="flex items-center space-x-3 cursor-pointer group"
            title="Click to access Admin Panel"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shadow-md group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
              <img src="/zentronix_logo.jpg" alt="Zentronix Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Zentronix</span>
              <span className="block text-xs font-semibold tracking-wider text-blue-400 uppercase">Developers</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'home'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCurrentView('register')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'register'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Now</span>
            </button>

            <button
              onClick={() => setCurrentView('status')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'status'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Check Status</span>
            </button>
          </nav>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setCurrentView('register')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md hover:bg-blue-500 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

