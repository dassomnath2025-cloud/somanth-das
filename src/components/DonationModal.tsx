import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Heart,
  Copy,
  Check,
  ShieldCheck,
  Settings,
  ExternalLink,
  IndianRupee,
  Sparkles,
} from 'lucide-react';
import { DonationConfig, UserProfile, LOGO_URL } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DonationConfig;
  currentUser: UserProfile;
  onOpenAdminSettings: () => void;
  onDonationSuccess?: (amount: number) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  config,
  currentUser,
  onOpenAdminSettings,
  onDonationSuccess,
}) => {
  const [amount, setAmount] = useState<string>(config.defaultAmount.toString());
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numericAmount = Math.max(1, parseFloat(amount) || 0);

  // Standard UPI URI format accepted across GPay, PhonePe, Paytm, BHIM
  const upiUrl = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(
    config.payeeName
  )}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(config.message)}`;

  const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

  const handleCopyUPI = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(config.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDonate = () => {
    // Attempt opening UPI payment app
    try {
      window.location.href = upiUrl;
    } catch {
      // Fallback
    }

    setIsSuccess(true);
    if (onDonationSuccess) {
      onDonationSuccess(numericAmount);
    }
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  const isAdmin = currentUser.email?.toLowerCase() === config.adminEmail.toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src={LOGO_URL}
            alt="Encript Logo"
            className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-stone-200 dark:ring-stone-700"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
          Support Encript
        </h3>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
          {config.message || 'Scan the QR code with any UPI app to donate in Rupees (₹)'}
        </p>

        {/* QR Code Container */}
        <div className="mt-5 p-4 bg-white rounded-2xl shadow-sm border border-stone-200 inline-block max-w-[220px] mx-auto">
          <QRCodeSVG
            value={upiUrl}
            size={180}
            level="M"
            includeMargin={true}
            className="w-full h-auto"
          />
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#1C1C1C]">
            <span className="text-[#4A6958]">BHIM</span>
            <span>·</span>
            <span>GPay</span>
            <span>·</span>
            <span>PhonePe</span>
            <span>·</span>
            <span>Paytm</span>
          </div>
        </div>

        {/* Payee Info & Address */}
        <div className="mt-3 text-xs text-[#435146] dark:text-[#8FA597]">
          <p className="font-semibold text-[#1C1C1C] dark:text-[#EDF2EE]">
            Payee: {config.payeeName}
          </p>
          <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8EDE9] dark:bg-[#1B2922] border border-[#D6DFD8] dark:border-[#273A31] rounded-full text-[11px] font-mono text-[#1C1C1C] dark:text-[#EDF2EE]">
            <span>{config.upiId}</span>
            <button
              onClick={handleCopyUPI}
              className="hover:text-[#4A6958] transition-colors cursor-pointer"
              title="Copy UPI ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Rupee Amount Input Bar */}
        <div className="mt-5 text-left">
          <label className="block text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE] mb-1.5">
            Enter Amount in Rupees (₹)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#435146] font-bold text-base">
              ₹
            </div>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-9 pr-4 py-3 bg-[#E8EDE9] dark:bg-[#1F3028] border border-[#D6DFD8] dark:border-[#273A31] rounded-2xl text-base font-bold text-[#1C1C1C] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between gap-1.5 mt-2.5">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  amount === preset.toString()
                    ? 'bg-[#4A6958] text-white shadow-xs'
                    : 'bg-[#E8EDE9] dark:bg-[#1F3028] text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#D6DFD8] dark:hover:bg-[#273A31]'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Donate Button */}
        <div className="mt-5">
          <button
            onClick={handleDonate}
            disabled={numericAmount <= 0}
            className="w-full py-3.5 bg-[#4A6958] hover:bg-[#3D5849] active:bg-[#32493C] disabled:opacity-50 text-white font-extrabold text-sm rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isSuccess ? (
              <>
                <Check className="w-5 h-5 text-white" />
                <span>Thank You for Donating ₹{numericAmount}!</span>
              </>
            ) : (
              <>
                <IndianRupee className="w-4 h-4" />
                <span>Donate ₹{numericAmount.toLocaleString()} Now</span>
              </>
            )}
          </button>
        </div>

        {/* Admin Link (Only for dassomnath2025@gmail.com) */}
        <div className="mt-4 pt-3 border-t border-[#D6DFD8] dark:border-[#273A31] flex items-center justify-between text-[11px] text-[#435146] dark:text-[#8FA597]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 100% Direct UPI Transfer</span>
          </div>

          {isAdmin ? (
            <button
              onClick={onOpenAdminSettings}
              className="flex items-center gap-1 font-bold text-[#4A6958] dark:text-[#8FA597] hover:underline cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>Admin Settings</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminSettings}
              className="text-[#435146] hover:text-[#1C1C1C] dark:text-[#8FA597] dark:hover:text-white transition-colors cursor-pointer"
            >
              Owner Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
