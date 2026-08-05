import React, { useState } from 'react';
import { IndianRupee, QrCode, Upload, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Registration, WorkshopDetails } from '../types';

interface RegisterFormProps {
  onBack: () => void;
  onSuccess: (reg: Registration) => void;
  workshopDetails: WorkshopDetails;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onBack,
  onSuccess,
  workshopDetails
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    email: '',
    institution_type: 'College',
    institution_name: '',
    programming_experience: 'Beginner',
    laptop_available: 'Yes',
    transaction_id: '',
    payment_screenshot: ''
  });

  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [sameAsPhone, setSameAsPhone] = useState(true);

  // Check if past August 20, 2026
  const isRegistrationClosed = new Date() > new Date('2026-08-20T23:59:59');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'phone_number' && sameAsPhone) {
      setFormData(prev => ({ ...prev, whatsapp_number: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsPhone(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, whatsapp_number: prev.phone_number }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Screenshot file size must be less than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setScreenshotPreview(base64String);
        setFormData(prev => ({ ...prev, payment_screenshot: base64String }));
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistrationClosed) {
      setError('Registrations and bookings closed on 20th August 2026.');
      return;
    }

    if (!formData.full_name || !formData.phone_number || !formData.email || !formData.institution_name) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!formData.payment_screenshot) {
      setError('Please upload the payment screenshot to complete registration.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      onSuccess(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-8 py-8 text-white border-b border-blue-800/40">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Workshop Registration Form</h1>
            <p className="text-blue-200 text-sm mt-2 flex items-center space-x-2">
              <span>{workshopDetails.title} • {workshopDetails.date}, 2026</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Bookings close Aug 20</span>
            </p>
          </div>

          {isRegistrationClosed ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Registrations Are Closed</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                The deadline for workshop bookings was 20th August 2026. Thank you for your overwhelming interest in Zentronix Developers masterclasses!
              </p>
              <button
                onClick={onBack}
                className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
              >
                Return to Overview
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {error && (
                <div className="bg-red-950/60 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                  <span>1. Personal & Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      required
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-slate-300">
                        WhatsApp Number <span className="text-red-400">*</span>
                      </label>
                      <label className="text-xs text-blue-400 flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsPhone}
                          onChange={handleCheckboxChange}
                          className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Same as Phone</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      name="whatsapp_number"
                      required
                      disabled={sameAsPhone}
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm ${
                        sameAsPhone ? 'bg-slate-900 text-slate-500' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Academic / Professional Background */}
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                  2. Academic & Experience Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Institution / Category
                    </label>
                    <select
                      name="institution_type"
                      value={formData.institution_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    >
                      <option value="College">College / University</option>
                      <option value="School">School</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Name of School / College <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="institution_name"
                      required
                      value={formData.institution_name}
                      onChange={handleChange}
                      placeholder="e.g. Anna University / ABC College"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Programming Experience
                    </label>
                    <select
                      name="programming_experience"
                      value={formData.programming_experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    >
                      <option value="Beginner">Beginner (New to coding)</option>
                      <option value="Intermediate">Intermediate (Know basics / HTML/JS)</option>
                      <option value="Advanced">Advanced (Built projects before)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Laptop Available for Workshop?
                    </label>
                    <select
                      name="laptop_available"
                      value={formData.laptop_available}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white text-sm"
                    >
                      <option value="Yes">Yes, I will have a laptop</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-6 pt-4">
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">3. Workshop Payment Section</h3>
                      <p className="text-xs text-blue-300">Scan QR code or transfer to UPI ID. Bookings close August 20.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">Fee Amount</span>
                      <span className="text-2xl font-black text-emerald-400">₹{workshopDetails.fee}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-lg">
                    {/* UPI QR Display */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                      <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-lg border border-slate-700 flex items-center justify-center overflow-hidden">
                        <img 
                          src="/upi_qr.jpg" 
                          alt="Zentronix UPI QR Code" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300">Scan via GPay / PhonePe / Paytm</p>
                        <p className="text-xs font-mono text-blue-400 font-bold mt-1 select-all">{workshopDetails.upiId}</p>
                      </div>
                      <a
                        href={`upi://pay?pa=${workshopDetails.upiId}&pn=Zentronix%20Developers&am=200&cu=INR`}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition flex items-center justify-center space-x-1.5"
                      >
                        <span>Pay ₹200 Now (Open UPI App)</span>
                      </a>
                    </div>

                    {/* Payment Inputs */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                          Upload Payment Screenshot <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl p-4 text-center transition flex flex-col items-center justify-center">
                            <Upload className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-xs font-medium text-slate-300">Click to upload screenshot</span>
                            <span className="text-[10px] text-slate-500">PNG, JPG, JPEG up to 10MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {screenshotPreview && (
                            <div className="w-20 h-20 rounded-xl border border-slate-700 overflow-hidden shrink-0 relative bg-slate-900">
                              <img src={screenshotPreview} alt="Payment Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-950 transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Complete Registration</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

