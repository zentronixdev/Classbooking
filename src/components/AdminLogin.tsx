import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBack
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid password');
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-slate-100">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-950">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-center text-white tracking-tight">Admin Authentication</h2>
          <p className="text-center text-sm text-slate-400 mt-2">
            Enter administrator password to access the workshop dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl border border-red-500/50 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
              />
            </div>
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-950 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Sign In to Admin Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};

