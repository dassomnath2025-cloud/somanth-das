import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Check,
  Save,
  AtSign,
  User,
  IndianRupee,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { DonationConfig, UserProfile } from '../types';

interface AdminDonationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DonationConfig;
  currentUser: UserProfile;
  onSaveConfig: (updatedConfig: DonationConfig) => void;
  onAuthenticateAdmin: () => void;
}

export const AdminDonationSettingsModal: React.FC<AdminDonationSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  currentUser,
  onSaveConfig,
  onAuthenticateAdmin,
}) => {
  const [upiId, setUpiId] = useState(config.upiId);
  const [payeeName, setPayeeName] = useState(config.payeeName);
  const [defaultAmount, setDefaultAmount] = useState(config.defaultAmount.toString());
  const [message, setMessage] = useState(config.message);
  const [isActive, setIsActive] = useState(config.isActive);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser.email?.toLowerCase() === config.adminEmail.toLowerCase();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !payeeName.trim()) return;

    const updated: DonationConfig = {
      ...config,
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      defaultAmount: Math.max(1, parseFloat(defaultAmount) || 100),
      message: message.trim(),
      isActive,
    };

    onSaveConfig(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="w-10 h-10 rounded-full bg-[#4A6958]/15 text-[#4A6958] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Admin Donation Control Panel
            </h3>
            <p className="text-xs text-stone-500">
              Only accessible via Google Account: {config.adminEmail}
            </p>
          </div>
        </div>

        {/* Access Control Check */}
        {!isAdmin ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-stone-900 dark:text-white">
                Admin Entry Pass Required
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                This panel is restricted exclusively to the account owner ({config.adminEmail}).
              </p>
            </div>

            <button
              onClick={onAuthenticateAdmin}
              className="px-6 py-3 bg-[#4A6958] hover:bg-[#3D5849] text-white font-bold text-xs rounded-full transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Use Entry Pass ({config.adminEmail})</span>
            </button>
          </div>
        ) : (
          /* Form for Verified Admin to Set Payment Details */
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Verified as Super Admin: <strong>{currentUser.email}</strong>
              </span>
            </div>

            {/* UPI ID / Payment Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                UPI ID or Address / Number (Where money goes) *
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl focus-within:ring-2 focus-within:ring-[#4A6958]">
                <AtSign className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. dassomnath2025@okaxis or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Money transferred via the QR code will directly deposit into this bank account / UPI ID.
              </p>
            </div>

            {/* Payee Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Payee Legal / Display Name *
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl focus-within:ring-2 focus-within:ring-[#4A6958]">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Somnath Das"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Default Amount & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Default Amount (₹ Rupees)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl">
                  <IndianRupee className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={defaultAmount}
                    onChange={(e) => setDefaultAmount(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Status
                </label>
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl">
                  <span className="text-xs text-stone-700 dark:text-stone-300">
                    Accept Donations
                  </span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#4A6958] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Purpose / Message Note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Campaign Message / Purpose Note
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl">
                <MessageSquare className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Encript Creator & Studio Support"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!upiId.trim() || !payeeName.trim()}
                className="px-6 py-2.5 bg-[#4A6958] hover:bg-[#3D5849] disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Settings Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Payment Destination</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
