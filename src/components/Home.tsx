import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Utensils, IndianRupee, ArrowRight, CheckCircle, Timer } from 'lucide-react';
import { WorkshopDetails } from '../types';

interface HomeProps {
  onStartRegistration: () => void;
  onCheckStatus: () => void;
  workshopDetails: WorkshopDetails;
}

export const Home: React.FC<HomeProps> = ({
  onStartRegistration,
  onCheckStatus,
  workshopDetails
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const deadline = new Date('2026-08-20T23:59:59').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const isRegistrationClosed = new Date() > new Date('2026-08-20T23:59:59');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/40 text-white py-12 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-blue-300 tracking-wide mb-4 sm:mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zentronix Developers Exclusive Masterclass</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                {workshopDetails.title}
              </h1>
              <p className="text-sm sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Master modern full-stack web development from scratch. Learn professional frontend design with React & Tailwind, backend APIs, and seamless production deployment on Vercel.
              </p>

              {/* Countdown Timer Box */}
              <div className="bg-slate-900/90 border border-blue-900/60 p-4 sm:p-5 rounded-2xl shadow-xl max-w-xl">
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
                  <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Registration Closes In:</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800">
                    <span className="text-xl sm:text-3xl font-black text-white">{timeLeft.days}</span>
                    <span className="block text-[10px] sm:text-xs text-slate-400 uppercase mt-0.5">Days</span>
                  </div>
                  <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800">
                    <span className="text-xl sm:text-3xl font-black text-white">{timeLeft.hours}</span>
                    <span className="block text-[10px] sm:text-xs text-slate-400 uppercase mt-0.5">Hours</span>
                  </div>
                  <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800">
                    <span className="text-xl sm:text-3xl font-black text-white">{timeLeft.minutes}</span>
                    <span className="block text-[10px] sm:text-xs text-slate-400 uppercase mt-0.5">Mins</span>
                  </div>
                  <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800">
                    <span className="text-xl sm:text-3xl font-black text-emerald-400">{timeLeft.seconds}</span>
                    <span className="block text-[10px] sm:text-xs text-slate-400 uppercase mt-0.5">Secs</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isRegistrationClosed ? (
                  <div className="px-6 py-3.5 rounded-xl bg-red-900/40 border border-red-500 text-red-200 font-bold text-sm sm:text-base text-center">
                    Registrations Are Closed (Deadline Passed)
                  </div>
                ) : (
                  <button
                    onClick={onStartRegistration}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center space-x-2 group"
                  >
                    <span>Secure Ur Seats Before Registration Close</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                <button
                  onClick={onCheckStatus}
                  className="px-6 py-3.5 sm:py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-sm sm:text-base border border-slate-700 transition-all text-center"
                >
                  Check Registration Status
                </button>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-800 pb-3 sm:pb-4 text-white flex items-center justify-between">
                  <span>Workshop Essentials</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">₹{workshopDetails.fee}</span>
                </h3>
                
                <div className="space-y-3.5 sm:space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Date</p>
                      <p className="text-sm sm:text-base font-semibold text-white">{workshopDetails.date}, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Time Schedule</p>
                      <p className="text-sm sm:text-base font-semibold text-white">{workshopDetails.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Lunch Break</p>
                      <p className="text-sm sm:text-base font-semibold text-white">{workshopDetails.lunchBreak}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Booking Deadline</p>
                      <p className="text-sm sm:text-base font-bold text-amber-400">20th August 2026</p>
                    </div>
                  </div>
                </div>

                {!isRegistrationClosed && (
                  <button
                    onClick={onStartRegistration}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950 transition text-center block text-sm sm:text-base"
                  >
                    Secure Ur Seats Before Registration Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Topics Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">What You Will Learn</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400">
            A comprehensive curriculum crafted by Zentronix Developers to take you from fundamentals to production-ready deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {workshopDetails.topics.map((topic, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 sm:mb-6 font-bold text-base sm:text-lg group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{topic.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{topic.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Hands-on Code Lab</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
