import React, { useState } from 'react';
import {
  Search,
  Plus,
  Moon,
  Sun,
  X,
  Bell,
  MessageCircle,
  ChevronDown,
  LayoutTemplate,
  LogOut,
  ExternalLink,
  QrCode,
  Heart,
  IndianRupee,
  ShieldCheck,
  Settings,
  User as UserIcon,
  Edit3,
} from 'lucide-react';
import { UserProfile, DonationConfig, LOGO_URL } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'following' | 'saved';
  setActiveTab: (tab: 'explore' | 'following' | 'saved') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCreateModal: () => void;
  onSwitchToLanding: () => void;
  user: UserProfile;
  donationConfig: DonationConfig;
  onOpenDonationModal: () => void;
  onOpenAdminSettings: () => void;
  onOpenEditProfile?: () => void;
  onLogOut?: () => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  onOpenCreateModal,
  onSwitchToLanding,
  user,
  donationConfig,
  onOpenDonationModal,
  onOpenAdminSettings,
  onOpenEditProfile,
  onLogOut,
  onOpenLogin,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = user.email?.toLowerCase() === donationConfig.adminEmail.toLowerCase();

  const notifications = [
    { id: 1, title: 'Aditi Varma Design saved your pin', time: '2h ago' },
    { id: 2, title: 'Trending in India: Chai time snack ideas', time: '5h ago' },
    { id: 3, title: 'Elena Rostova published a new concrete study', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1B2922] border-b border-[#D6DFD8] dark:border-[#273A31] transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 md:gap-4">
        {/* Left Section: Encript Official Logo + Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => {
              setActiveTab('explore');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            title="Encript Home"
          >
            <img
              src={LOGO_URL}
              alt="Encript Logo"
              className="w-9 h-9 rounded-full object-cover shadow-xs ring-1 ring-[#D6DFD8] dark:ring-[#273A31] group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight text-[#1C1C1C] dark:text-[#EDF2EE] font-sans">
              Encript
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('explore');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#4A6958] text-white shadow-xs'
                : 'text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#273A31]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`hidden sm:block px-4 py-2.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${
              activeTab === 'following'
                ? 'bg-[#4A6958] text-white shadow-xs'
                : 'text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#273A31]'
            }`}
          >
            Explore
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 px-4 py-2.5 text-sm font-bold text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] rounded-full transition-colors cursor-pointer"
          >
            <span>Create</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#435146] dark:text-[#8FA597]" />
          </button>
        </div>

        {/* Center: Encript Search Bar */}
        <div className="flex-1 max-w-4xl relative">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#E8EDE9] dark:bg-[#1F3028] text-[#1C1C1C] dark:text-[#EDF2EE] transition-all ${
              isSearchFocused
                ? 'ring-2 ring-[#4A6958]/50 bg-white dark:bg-[#1B2922] shadow-sm'
                : 'hover:bg-[#D6DFD8]/70 dark:hover:bg-[#273A31]'
            }`}
          >
            <Search className="w-4 h-4 text-[#435146] dark:text-[#8FA597] shrink-0" />
            <input
              type="text"
              placeholder="Search chai snacks, home decor, outfit ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-transparent text-sm placeholder:text-[#435146]/70 dark:placeholder:text-[#8FA597]/70 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#435146] hover:text-[#1C1C1C] dark:text-[#8FA597] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Donate, Dark Mode, Notifications, Messages, User Profile, Landing Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Donate via UPI QR Button in the Bar */}
          <button
            onClick={onOpenDonationModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1F3028] dark:hover:bg-[#273A31] text-[#4A6958] dark:text-[#8FA597] text-xs font-bold rounded-full transition-all cursor-pointer shadow-2xs border border-[#4A6958]/30 shrink-0"
            title="Donate via UPI QR (Rupees ₹)"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Donate ₹</span>
          </button>

          {/* Dark Mode Toggle directly in the bar */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="w-10 h-10 rounded-full hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] text-[#435146] dark:text-[#8FA597] flex items-center justify-center cursor-pointer transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-[#435146] dark:text-[#8FA597]" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
                setShowUserMenu(false);
              }}
              className="w-10 h-10 rounded-full hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] text-[#435146] dark:text-[#8FA597] flex items-center justify-center cursor-pointer transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4A6958]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 sm:w-92 bg-white dark:bg-[#1B2922] rounded-3xl shadow-2xl border border-[#D6DFD8] dark:border-[#273A31] p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#1C1C1C] dark:text-white">
                    Notifications & Alerts
                  </h4>
                  <span className="text-[11px] font-bold text-[#4A6958]">4 new</span>
                </div>

                {/* Featured UPI Donation Notification Card */}
                <div className="p-3 bg-gradient-to-br from-[#E8EDE9] to-[#DCE5DF] dark:from-[#1F3028] dark:to-[#17251F] border border-[#4A6958]/30 dark:border-[#4A6958]/40 rounded-2xl mb-3 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#4A6958] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#4A6958] dark:text-[#8FA597] uppercase tracking-wide">
                          Support Encript
                        </span>
                        <span className="text-[10px] text-[#435146] dark:text-[#8FA597]">Featured</span>
                      </div>
                      <p className="text-xs font-bold text-[#1C1C1C] dark:text-white mt-0.5 leading-snug">
                        Donate with UPI QR Code in Rupees (₹)
                      </p>
                      <p className="text-[11px] text-[#435146] dark:text-[#8FA597] mt-1 leading-normal">
                        Show QR code, enter custom amount in ₹, and donate instantly via GPay, PhonePe, or Paytm.
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            onOpenDonationModal();
                          }}
                          className="px-3.5 py-1.5 bg-[#4A6958] hover:bg-[#3D5849] text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                        >
                          <IndianRupee className="w-3 h-3" />
                          <span>Donate Money via QR</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              onOpenAdminSettings();
                            }}
                            className="px-2.5 py-1.5 bg-[#D6DFD8] hover:bg-[#cbd6ce] dark:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] text-[10px] font-bold rounded-full transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Owner Payment Destination Control"
                          >
                            <Settings className="w-3 h-3" />
                            <span>Set Address</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#D6DFD8] dark:border-[#273A31] pt-2.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="text-xs p-2.5 rounded-xl hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-[#1C1C1C] dark:text-[#EDF2EE]">
                        {n.title}
                      </p>
                      <span className="text-[11px] text-[#435146] dark:text-[#8FA597]">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="w-10 h-10 rounded-full hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] text-[#435146] dark:text-[#8FA597] flex items-center justify-center cursor-pointer transition-colors"
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1B2922] rounded-3xl shadow-2xl border border-[#D6DFD8] dark:border-[#273A31] p-4 z-50 text-center">
                <h4 className="text-sm font-bold text-[#1C1C1C] dark:text-white mb-2 text-left">
                  Inbox
                </h4>
                <div className="py-6 text-[#435146] dark:text-[#8FA597] text-xs">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Share ideas with friends and collaborators.</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`w-9 h-9 rounded-full ring-2 transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'ring-[#4A6958]'
                : 'ring-transparent hover:ring-[#D6DFD8] dark:hover:ring-[#273A31]'
            }`}
            title="View Profile & Boards"
          >
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          {/* User / Settings Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowMessages(false);
              }}
              className="w-8 h-8 rounded-full hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] text-[#435146] dark:text-[#8FA597] flex items-center justify-center cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1B2922] rounded-2xl shadow-xl border border-[#D6DFD8] dark:border-[#273A31] p-2 z-50">
                <div className="px-3 py-2 border-b border-[#D6DFD8] dark:border-[#273A31]">
                  <p className="text-xs font-bold text-[#1C1C1C] dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#435146] dark:text-[#8FA597] truncate">{user.handle}</p>
                </div>

                <div className="pt-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenEditProfile?.();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-[#4A6958]" />
                      <span>Edit Profile</span>
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-[#435146] dark:text-[#8FA597]" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenDonationModal();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#4A6958]" />
                      <span>Donate via UPI QR (₹)</span>
                    </span>
                    <QrCode className="w-3.5 h-3.5 text-[#435146] dark:text-[#8FA597]" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenAdminSettings();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#4A6958] dark:text-[#8FA597] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4A6958]" />
                      <span>Admin Payment Destination</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4A6958]/15 text-[#4A6958] dark:text-[#8FA597] font-bold">
                      Owner
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDarkMode((prev) => !prev);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#435146] dark:text-[#8FA597]" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchToLanding();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-[#EDF2EE] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Landing Page (Encript)</span>
                    <LayoutTemplate className="w-4 h-4 text-[#4A6958]" />
                  </button>

                  <button
                    onClick={() => {
                      if (onLogOut) {
                        onLogOut();
                      } else {
                        onSwitchToLanding();
                      }
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#435146] dark:text-[#8FA597] hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Log out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
