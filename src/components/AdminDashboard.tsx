import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Search, Download, Trash2, Check, X, Eye, LogOut, RefreshCw, ShieldCheck 
} from 'lucide-react';
import { Registration } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleVerify = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/registrations/${id}/verify`, { method: 'PATCH' });
      if (res.ok) {
        await fetchRegistrations();
      }
    } catch (err) {
      console.error('Failed to verify payment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this payment?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/registrations/${id}/reject`, { method: 'PATCH' });
      if (res.ok) {
        await fetchRegistrations();
      }
    } catch (err) {
      console.error('Failed to reject payment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration permanently?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchRegistrations();
      }
    } catch (err) {
      console.error('Failed to delete registration:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/export-csv';
  };

  // Filter & Search
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.institution_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      statusFilter === 'All' ? true :
      statusFilter === 'Paid' ? (reg.payment_status === 'Paid' || reg.payment_status === 'Verified') :
      reg.payment_status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalRegs = registrations.length;
  const verifiedRegs = registrations.filter(r => r.payment_status === 'Verified').length;
  const pendingRegs = registrations.filter(r => r.payment_status === 'Pending' || r.payment_status === 'Paid').length;
  const rejectedRegs = registrations.filter(r => r.payment_status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-950">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Admin Control Dashboard</h1>
              <p className="text-xs text-slate-400">Manage workshop registrations, payments, and student verification.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchRegistrations}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 text-sm font-semibold transition flex items-center space-x-2 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-sm font-semibold transition flex items-center space-x-2 border border-red-900/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</p>
              <p className="text-3xl font-black text-white mt-2">{totalRegs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Payments</p>
              <p className="text-3xl font-black text-emerald-400 mt-2">{verifiedRegs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Payments</p>
              <p className="text-3xl font-black text-amber-400 mt-2">{pendingRegs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected Payments</p>
              <p className="text-3xl font-black text-red-400 mt-2">{rejectedRegs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, email, phone..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Paid', 'Pending', 'Verified', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition shrink-0 ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Reg ID / Name</th>
                  <th className="py-4 px-6">Contact & Email</th>
                  <th className="py-4 px-6">Institution</th>
                  <th className="py-4 px-6">Transaction / Proof</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No registrations found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-blue-400 block text-xs">{reg.id}</span>
                        <span className="font-bold text-white text-base">{reg.full_name}</span>
                        <span className="block text-xs text-slate-500">Exp: {reg.programming_experience}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="block text-slate-200 font-medium">{reg.phone_number}</span>
                        <span className="block text-xs text-slate-400">{reg.email}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="block font-medium text-slate-200">{reg.institution_name}</span>
                        <span className="block text-xs text-slate-400">{reg.institution_type}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-semibold text-slate-300 block">{reg.transaction_id || 'No Txn ID'}</span>
                        {reg.payment_screenshot ? (
                          <button
                            onClick={() => setSelectedScreenshot(reg.payment_screenshot)}
                            className="mt-1 inline-flex items-center space-x-1 text-xs font-bold text-blue-400 hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Screenshot</span>
                          </button>
                        ) : (
                          <span className="text-xs text-red-400 italic">No screenshot</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          reg.payment_status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          reg.payment_status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {reg.payment_status}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1 uppercase font-semibold">{reg.registration_status}</span>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        {reg.payment_status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(reg.id)}
                            disabled={actionLoading === reg.id}
                            title="Verify Payment"
                            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {reg.payment_status !== 'Rejected' && (
                          <button
                            onClick={() => handleReject(reg.id)}
                            disabled={actionLoading === reg.id}
                            title="Reject Payment"
                            className="p-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(reg.id)}
                          disabled={actionLoading === reg.id}
                          title="Delete Registration"
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-800 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Payment Screenshot</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full max-h-[70vh] overflow-auto bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-800">
              <img src={selectedScreenshot} alt="Payment Proof" className="max-w-full rounded-lg object-contain" />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

