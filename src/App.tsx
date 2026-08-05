import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { RegisterForm } from './components/RegisterForm';
import { SuccessView } from './components/SuccessView';
import { StatusCheck } from './components/StatusCheck';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Registration, WorkshopDetails } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'success' | 'status' | 'adminLogin' | 'admin'>('home');
  const [latestRegistration, setLatestRegistration] = useState<Registration | null>(null);

  const workshopDetails: WorkshopDetails = {
    title: "Complete Website Development Workshop",
    date: "30 August",
    time: "9:30 AM – 5:30 PM",
    lunchBreak: "1:00 PM – 2:00 PM",
    fee: 200,
    contactNumber: "6383103433",
    email: "zentronixdevelopers@gmail.com",
    upiId: "6383103433@FAM",
    topics: [
      {
        title: "HTML5 & CSS3 Fundamentals",
        description: "Master website structure, semantic tags, forms, tables, colors, typography, Flexbox, and CSS Grid.",
        icon: "code"
      },
      {
        title: "JavaScript & DOM Manipulation",
        description: "Learn variables, functions, events, form validation, and interactive websites with modern JavaScript.",
        icon: "cpu"
      },
      {
        title: "Responsive Web Design & Animations",
        description: "Build fluid, mobile-friendly layouts and stunning modern UI animations for professional user experiences.",
        icon: "layout"
      },
      {
        title: "Git & GitHub Version Control",
        description: "Understand Git basics, repositories, commits, pushes, and build your professional GitHub developer profile.",
        icon: "server"
      },
      {
        title: "Firebase & Supabase Integration",
        description: "Explore Firebase introduction, hosting, authentication basics, and database connections.",
        icon: "database"
      },
      {
        title: "Website Deployment (Vercel) & AI Tools",
        description: "Deploy websites with live hosting on Vercel, discover AI tools for developers, and master best practices.",
        icon: "globe"
      }
    ]
  };

  const handleRegistrationSuccess = (reg: Registration) => {
    setLatestRegistration(reg);
    setCurrentView('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onAdminClick={() => {
          setCurrentView('adminLogin');
        }}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onStartRegistration={() => setCurrentView('register')}
            onCheckStatus={() => setCurrentView('status')}
            workshopDetails={workshopDetails}
          />
        )}

        {currentView === 'register' && (
          <RegisterForm
            onBack={() => setCurrentView('home')}
            onSuccess={handleRegistrationSuccess}
            workshopDetails={workshopDetails}
          />
        )}

        {currentView === 'success' && latestRegistration && (
          <SuccessView
            registration={latestRegistration}
            workshopDetails={workshopDetails}
            onGoHome={() => setCurrentView('home')}
            onCheckStatus={() => setCurrentView('status')}
          />
        )}

        {currentView === 'status' && (
          <StatusCheck
            workshopDetails={workshopDetails}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'adminLogin' && (
          <AdminLogin
            onLoginSuccess={() => setCurrentView('admin')}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onLogout={() => {
              setCurrentView('home');
            }}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <div>
              <p className="text-white font-bold text-base">Zentronix Developers</p>
              <p className="text-xs text-slate-400">Empowering the next generation of full-stack engineers.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium">
            <button onClick={() => setCurrentView('home')} className="hover:text-white transition">Overview</button>
            <button onClick={() => setCurrentView('register')} className="hover:text-white transition">Register</button>
            <button onClick={() => setCurrentView('status')} className="hover:text-white transition">Status Check</button>
            <button onClick={() => setCurrentView('adminLogin')} className="hover:text-white transition">Admin Panel</button>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            <p>Support: <span className="text-white font-semibold">6383103433</span></p>
            <p className="mt-1">Email: <span className="text-white font-semibold">zentronixdevelopers@gmail.com</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
