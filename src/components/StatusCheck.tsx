import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Registration, WorkshopDetails } from '../types';

interface StatusCheckProps {
  workshopDetails: WorkshopDetails;
  onBack: () => void;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({
  workshopDetails,
  onBack
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Registration[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/registrations/search?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search');
      setResults(data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Error searching registrations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Check Registration Status</h1>
            <p className="text-slate-400 text-sm mt-2">
              Enter your unique Registration ID (e.g. ZTW-0001) or Phone Number to view your payment status and workshop access details.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter Registration ID or Phone Number..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Search</span>
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-950/60 text-red-200 p-4 rounded-xl border border-red-500/50 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {searched && results && results.length === 0 && (
            <div className="mt-8 text-center py-12 bg-slate-950 rounded-2xl border border-slate-800">
              <p className="text-slate-300 text-base font-medium">No registrations found matching "{query}".</p>
              <p className="text-slate-500 text-xs mt-1">Please check your Registration ID or phone number and try again.</p>
            </div>
          )}

          {searched && results && results.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Search Results ({results.length})</h3>
              
              {results.map((reg) => (
                <div key={reg.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">{reg.id}</span>
                      <h4 className="text-xl font-bold text-white mt-2">{reg.full_name}</h4>
                      <p className="text-xs text-slate-400">{reg.email} | {reg.phone_number}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        reg.payment_status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        reg.payment_status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        Payment: {reg.payment_status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Status: {reg.registration_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Institution</p>
                      <p className="font-bold text-white mt-1">{reg.institution_name} ({reg.institution_type})</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Workshop Date</p>
                      <p className="font-bold text-white mt-1">{workshopDetails.date}, 2026</p>
                    </div>
                  </div>

                  <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-900/60 flex items-start space-x-3 text-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Online Meeting Link Access (Assigned Default)</p>
                      <a 
                        href="https://meet.google.com/zentronix-dev-workshop-2026" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline text-xs mt-0.5 block font-mono font-bold"
                      >
                        https://meet.google.com/zentronix-dev-workshop-2026
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

