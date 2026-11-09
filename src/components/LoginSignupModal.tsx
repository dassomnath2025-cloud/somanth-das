import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../lib/authService';
import { UserProfile, LOGO_URL } from '../types';

interface LoginSignupModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (userProfile?: UserProfile) => void;
}

export const LoginSignupModal: React.FC<LoginSignupModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('24');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If an email was provided, construct user profile
    if (email) {
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      const profile: UserProfile = {
        name: formattedName,
        handle: `@${email.split('@')[0].toLowerCase()}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
        bio: 'Visual curator & aesthetic collector on Encript',
        email: email.trim().toLowerCase(),
        followersCount: 42,
        followingCount: 18,
      };
      onSuccess(profile);
      onClose();
    } else {
      onSuccess();
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage(null);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        onSuccess(profile);
        onClose();
      }
    } catch (err: unknown) {
      console.error('Google Sign In Failed', err);
      const msg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      if (!msg.includes('closed-by-user') && !msg.includes('cancelled-popup-request')) {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encript Logo */}
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-sm ring-2 ring-stone-200 dark:ring-stone-700">
          <img
            src={LOGO_URL}
            alt="Encript Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          {mode === 'login' ? 'Welcome to Encript' : 'Sign up to Encript'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Cloud-synced visual discovery and aesthetic pins
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="line-clamp-2">{errorMessage}</span>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
            className="w-full py-3.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-semibold text-sm rounded-full transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-stone-200 dark:border-stone-700 shadow-xs hover:shadow-md disabled:opacity-60"
          >
            {isLoadingGoogle ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#4A6958]" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.34 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.22 0 10.05 0 12s.46 3.78 1.26 5.4l4.02-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.66 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            OR USE EMAIL
          </span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus-within:ring-2 focus-within:ring-[#4A6958]">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus-within:ring-2 focus-within:ring-[#4A6958]">
              <Lock className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-3 py-3 bg-[#4A6958] hover:bg-[#3D5849] active:scale-[0.99] text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Log in' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Login / Signup Mode */}
        <div className="mt-5 text-xs text-stone-500 dark:text-stone-400">
          {mode === 'login' ? (
            <p>
              Not on Encript yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-stone-900 dark:text-white hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-stone-900 dark:text-white hover:underline cursor-pointer"
              >
                Log in
              </button>
            </p>
          )}
        </div>

        <p className="mt-6 text-[11px] text-stone-400 leading-tight">
          By continuing, you agree to Encript's Terms of Service and acknowledge that you've read our Privacy Policy.
        </p>
      </div>
    </div>
  );
};
