import React from 'react';
import { CheckCircle2, Calendar, Clock, Phone, Mail, Link as LinkIcon, ArrowRight, Download, Home } from 'lucide-react';
import { Registration, WorkshopDetails } from '../types';

interface SuccessViewProps {
  registration: Registration;
  workshopDetails: WorkshopDetails;
  onGoHome: () => void;
  onCheckStatus: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  registration,
  workshopDetails,
  onGoHome,
  onCheckStatus
}) => {
  const handleDownloadReceipt = () => {
    const receiptContent = `========================================
ZENTRONIX DEVELOPERS - WORKSHOP RECEIPT
========================================
Registration ID: ${registration.id}
Full Name: ${registration.full_name}
Email: ${registration.email}
Phone Number: ${registration.phone_number}
Institution: ${registration.institution_name} (${registration.institution_type})
Workshop: ${workshopDetails.title}
Date: ${workshopDetails.date}, 2026 (9:30 AM - 5:30 PM)
Fee Paid: ₹${registration.workshop_fee} (Payment Status: ${registration.payment_status})
Transaction ID: ${registration.transaction_id || 'N/A'}
Online Meeting Link: https://meet.google.com/zentronix-dev-workshop-2026
Support Contact: 6383103433 / support@zentronix.dev
========================================
Thank you for registering with Zentronix Developers!
========================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zentronix_Receipt_${registration.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden text-center p-8 sm:p-12">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold tracking-wide uppercase mb-3">
            Registration Successful
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            You're Registered!
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Thank you, <strong className="text-white">{registration.full_name}</strong>. Your registration details have been securely recorded.
          </p>

          {/* Registration ID Badge */}
          <div className="my-8 p-6 bg-slate-950 rounded-2xl border border-slate-800 inline-block w-full">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-1">Your Registration ID</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-400 tracking-wider">{registration.id}</span>
            <p className="text-xs text-slate-500 mt-2">Please save this ID or your phone number to check verification status and join the workshop.</p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-950 rounded-2xl p-6 text-left space-y-4 border border-slate-800 text-sm">
            <div className="flex justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Workshop Name</span>
              <span className="font-bold text-white text-right">{workshopDetails.title}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Date & Time</span>
              <span className="font-bold text-white text-right">{workshopDetails.date}, 9:30 AM – 5:30 PM</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Payment Status</span>
              <span className="font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs uppercase">
                {registration.payment_status}
              </span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-800 items-center">
              <span className="text-slate-400 font-medium">Meeting Link (Default)</span>
              <a 
                href="https://meet.google.com/zentronix-dev-workshop-2026" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-xs text-blue-400 hover:underline font-bold text-right"
              >
                meet.google.com/zentronix-dev-workshop-2026
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Support Contact</span>
              <span className="font-bold text-white">6383103433</span>
            </div>
          </div>

          {/* Contact info box */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{workshopDetails.contactNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{workshopDetails.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition flex items-center space-x-2 shadow-lg shadow-blue-950"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt File</span>
            </button>
            <button
              onClick={onCheckStatus}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition flex items-center space-x-2"
            >
              <span>Check Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoHome}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-sm transition flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
