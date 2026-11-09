import React, { useState, useRef, useEffect } from 'react';
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
  TrendingUp,
  Tag,
  ArrowRight,
  Hash,
  Sparkles,
  Flame,
} from 'lucide-react';
import { UserProfile, DonationConfig, LOGO_URL } from '../types';
import { CATEGORIES } from '../data/pinsData';

export interface EncriptTopic {
  id: string;
  name: string;
  tag: string;
  query: string;
  category: string;
  icon: string;
  pinCount: string;
  isTrending?: boolean;
}

export const ENCRIPT_TOPICS: EncriptTopic[] = [
  { id: 'chai-snacks', name: 'Chai Time Snacks & Samosas', tag: 'ChaiSnacks', query: 'Chai', category: 'Chai Time Snacks', icon: '☕', pinCount: '12.4k pins', isTrending: true },
  { id: 'home-decor', name: 'Warm Indian Home Decor', tag: 'HomeDecor', query: 'Home Decor', category: 'Home Decor', icon: '🪔', pinCount: '28.1k pins', isTrending: true },
  { id: 'outfits', name: 'Festive & Ethnic Outfits', tag: 'EthnicWear', query: 'Outfit', category: 'Outfit Ideas', icon: '✨', pinCount: '19.5k pins', isTrending: true },
  { id: 'diy-projects', name: 'DIY Projects & Indoor Plants', tag: 'DIYProjects', query: 'DIY', category: 'DIY Projects', icon: '🪴', pinCount: '15.2k pins', isTrending: true },
  { id: 'architecture', name: 'Modern Concrete Architecture', tag: 'ConcreteArch', query: 'Architecture', category: 'Architecture', icon: '🏛️', pinCount: '9.8k pins', isTrending: true },
  { id: 'artisan-coffee', name: 'Artisan Coffee & Cafe Brews', tag: 'CoffeeArt', query: 'Coffee', category: 'Culinary & Cafe', icon: '☕', pinCount: '14.2k pins' },
  { id: 'minimal-living', name: 'Minimal Living & Aesthetics', tag: 'MinimalLiving', query: 'Living', category: 'Interior Design', icon: '🛋️', pinCount: '22.0k pins', isTrending: true },
  { id: 'monsoon-travel', name: 'Monsoon Street & Travel', tag: 'MonsoonTravel', query: 'Monsoon', category: 'Landscapes & Travel', icon: '🌧️', pinCount: '11.7k pins' },
  { id: 'teak-furniture', name: 'Handcrafted Teak Furniture', tag: 'Woodcraft', query: 'Furniture', category: 'Furniture', icon: '🪑', pinCount: '7.1k pins' },
  { id: 'geometric-art', name: 'Geometric & Spiritual Motifs', tag: 'GeometricArt', query: 'Geometric', category: 'Architecture', icon: '🕌', pinCount: '8.3k pins', isTrending: true },
];

interface NavbarProps {
  activeTab: 'explore' | 'following' | 'saved';
  setActiveTab: (tab: 'explore' | 'following' | 'saved') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
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
  selectedCategory,
  setSelectedCategory,
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
  const [topicTab, setTopicTab] = useState<'trending' | 'all' | 'tags'>('trending');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.email?.toLowerCase() === donationConfig.adminEmail.toLowerCase();

  // Close search suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExecuteSearch = (query: string, categoryOverride?: string) => {
    setSearchQuery(query);
    if (categoryOverride && setSelectedCategory) {
      setSelectedCategory(categoryOverride);
    } else if (setSelectedCategory && query.trim() !== '') {
      setSelectedCategory('All Pins');
    }
    if (activeTab !== 'explore') {
      setActiveTab('explore');
    }
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

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

        {/* Center: Encript Topic & Search Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-4xl relative">
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#E8EDE9] dark:bg-[#1F3028] text-[#1C1C1C] dark:text-[#EDF2EE] transition-all cursor-text ${
              isSearchFocused
                ? 'ring-2 ring-[#4A6958] bg-white dark:bg-[#1B2922] shadow-md'
                : 'hover:bg-[#D6DFD8]/70 dark:hover:bg-[#273A31]'
            }`}
            onClick={() => searchInputRef.current?.focus()}
          >
            {/* Quick Topic Switcher Pill inside the Search Bar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchFocused(true);
                setTopicTab('trending');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D6DFD8] hover:bg-[#cbd6ce] dark:bg-[#273A31] dark:hover:bg-[#344b3f] text-[#4A6958] dark:text-[#8FA597] transition-all cursor-pointer shrink-0 shadow-2xs"
              title="Explore Topics"
            >
              <Hash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Topics</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleExecuteSearch(searchQuery);
              }}
              className="p-1 -ml-0.5 text-[#435146] hover:text-[#1C1C1C] dark:text-[#8FA597] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Search Topic"
              aria-label="Submit topic search"
            >
              <Search className="w-4 h-4" />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search topics, categories, ideas & tags (#ChaiSnacks, #HomeDecor)..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (activeTab !== 'explore') {
                  setActiveTab('explore');
                }
                if (setSelectedCategory && selectedCategory !== 'All Pins') {
                  setSelectedCategory('All Pins');
                }
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecuteSearch(searchQuery);
                } else if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                  searchInputRef.current?.blur();
                }
              }}
              className="w-full bg-transparent text-sm placeholder:text-[#435146]/70 dark:placeholder:text-[#8FA597]/70 focus:outline-none"
            />

            {searchQuery ? (
              <div className="flex items-center gap-1 shrink-0">
                <span className="hidden md:inline-flex items-center text-[10px] font-semibold text-[#435146]/80 dark:text-[#8FA597]/80 bg-white dark:bg-[#121D18] px-1.5 py-0.5 rounded border border-[#D6DFD8] dark:border-[#273A31]">
                  ↵ Enter
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                    if (setSelectedCategory) setSelectedCategory('All Pins');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-[#435146] hover:text-[#1C1C1C] dark:text-[#8FA597] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear topic search"
                  aria-label="Clear topic search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A6958] dark:text-[#8FA597] bg-white/70 dark:bg-[#121D18]/70 px-2 py-0.5 rounded-full border border-[#D6DFD8] dark:border-[#273A31] shrink-0">
                <Sparkles className="w-3 h-3 text-[#4A6958]" />
                <span>Search Topics</span>
              </span>
            )}
          </div>

          {/* Topic Search Suggestions & Topic Explorer Dropdown */}
          {isSearchFocused && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1B2922] rounded-3xl shadow-2xl border border-[#D6DFD8] dark:border-[#273A31] p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto no-scrollbar"
            >
              {searchQuery.trim() ? (
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#D6DFD8]/60 dark:border-[#273A31]/60">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-[#4A6958]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#435146] dark:text-[#8FA597]">
                        Matching Topics
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExecuteSearch(searchQuery)}
                      className="text-xs font-bold text-[#4A6958] dark:text-[#8FA597] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Search all pins for "{searchQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Matching Topic Cards */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleExecuteSearch(searchQuery)}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-[#E8EDE9]/60 dark:bg-[#1F3028]/60 hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] text-sm text-[#1C1C1C] dark:text-[#EDF2EE] flex items-center justify-between group cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-[#4A6958]" />
                        <span className="font-semibold text-sm">
                          Search topic keyword <span className="text-[#4A6958] dark:text-[#8FA597]">"{searchQuery}"</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-[#435146] dark:text-[#8FA597] bg-white dark:bg-[#121D18] px-2 py-0.5 rounded-full border border-[#D6DFD8] dark:border-[#273A31]">
                        Press Enter ↵
                      </span>
                    </button>

                    {ENCRIPT_TOPICS.filter((t) =>
                      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.query.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleExecuteSearch(topic.query, topic.category)}
                        className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] text-sm text-[#1C1C1C] dark:text-[#EDF2EE] flex items-center justify-between group cursor-pointer transition-colors border border-transparent hover:border-[#D6DFD8] dark:hover:border-[#273A31]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{topic.icon}</span>
                          <div>
                            <p className="font-bold text-xs sm:text-sm group-hover:text-[#4A6958] dark:group-hover:text-[#8FA597] transition-colors">
                              {topic.name}
                            </p>
                            <span className="text-[11px] text-[#435146] dark:text-[#8FA597] font-medium">
                              #{topic.tag} • {topic.pinCount}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-[#4A6958] dark:text-[#8FA597] bg-[#E8EDE9] dark:bg-[#121D18] px-2.5 py-1 rounded-full font-semibold">
                          Explore Topic
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Topic Tab Filter Selector */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6DFD8]/60 dark:border-[#273A31]/60">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setTopicTab('trending')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          topicTab === 'trending'
                            ? 'bg-[#4A6958] text-white shadow-xs'
                            : 'bg-[#E8EDE9] dark:bg-[#1F3028] text-[#435146] dark:text-[#8FA597] hover:bg-[#D6DFD8]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Trending Topics</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTopicTab('all')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          topicTab === 'all'
                            ? 'bg-[#4A6958] text-white shadow-xs'
                            : 'bg-[#E8EDE9] dark:bg-[#1F3028] text-[#435146] dark:text-[#8FA597] hover:bg-[#D6DFD8]'
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5" />
                        <span>All Topics</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTopicTab('tags')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          topicTab === 'tags'
                            ? 'bg-[#4A6958] text-white shadow-xs'
                            : 'bg-[#E8EDE9] dark:bg-[#1F3028] text-[#435146] dark:text-[#8FA597] hover:bg-[#D6DFD8]'
                        }`}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Topic Tags</span>
                      </button>
                    </div>

                    <span className="hidden sm:inline text-[11px] text-[#435146] dark:text-[#8FA597]">
                      Click topic to explore
                    </span>
                  </div>

                  {/* Topic Grid */}
                  {topicTab !== 'tags' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {(topicTab === 'trending'
                        ? ENCRIPT_TOPICS.filter((t) => t.isTrending)
                        : ENCRIPT_TOPICS
                      ).map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleExecuteSearch(topic.query, topic.category)}
                          className="w-full text-left p-3 rounded-2xl bg-[#F4F6F4] dark:bg-[#121D18]/70 hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] text-sm text-[#1C1C1C] dark:text-[#EDF2EE] flex items-center justify-between group cursor-pointer transition-all border border-transparent hover:border-[#D6DFD8] dark:hover:border-[#273A31]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl">{topic.icon}</span>
                            <div>
                              <p className="font-bold text-xs sm:text-sm group-hover:text-[#4A6958] dark:group-hover:text-[#8FA597] transition-colors leading-tight">
                                {topic.name}
                              </p>
                              <span className="text-[11px] text-[#435146] dark:text-[#8FA597] font-medium">
                                #{topic.tag} • {topic.pinCount}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#435146] dark:text-[#8FA597] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4 p-1">
                      {ENCRIPT_TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleExecuteSearch(topic.query, topic.category)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1F3028] dark:hover:bg-[#273A31] text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE] hover:text-[#4A6958] dark:hover:text-[#8FA597] transition-all cursor-pointer border border-[#D6DFD8] dark:border-[#273A31]"
                        >
                          <span>{topic.icon}</span>
                          <span>#{topic.tag}</span>
                          <span className="text-[10px] text-[#435146] dark:text-[#8FA597] font-normal">
                            ({topic.pinCount})
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Categories Bar */}
                  <div className="pt-3 border-t border-[#D6DFD8]/60 dark:border-[#273A31]/60">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Tag className="w-3.5 h-3.5 text-[#4A6958]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#435146] dark:text-[#8FA597]">
                        Popular Categories
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.slice(1, 9).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleExecuteSearch(cat, cat)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1F3028] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] transition-colors cursor-pointer"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
