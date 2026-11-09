/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Check,
  ArrowUpDown,
  LayoutTemplate,
  Grid,
  ArrowLeft,
} from 'lucide-react';
import { Pin, Board, UserProfile, DonationConfig } from './types';
import { INITIAL_PINS, INITIAL_BOARDS, INITIAL_USER, CATEGORIES } from './data/pinsData';
import { Navbar } from './components/Navbar';
import { PinCard } from './components/PinCard';
import { PinModal } from './components/PinModal';
import { CreatePinModal } from './components/CreatePinModal';
import { CreateBoardModal } from './components/CreateBoardModal';
import { BoardsView } from './components/BoardsView';
import { FollowingView } from './components/FollowingView';
import { PinterestLanding } from './components/PinterestLanding';
import { LoginSignupModal } from './components/LoginSignupModal';
import { EditProfileModal } from './components/EditProfileModal';
import { DonationModal } from './components/DonationModal';
import { AdminDonationSettingsModal } from './components/AdminDonationSettingsModal';
import { testConnection } from './lib/firebase';
import {
  saveUserProfileInDb,
  getUserProfileFromDb,
  createPinInDb,
  updatePinInDb,
  subscribePinsFromDb,
  createBoardInDb,
  subscribeBoardsFromDb,
  subscribeDonationConfig,
  saveDonationConfigInDb,
  seedWebsiteDataToDb,
} from './lib/firestoreService';
import { subscribeAuthState, logOutUser } from './lib/authService';

const DEFAULT_DONATION_CONFIG: DonationConfig = {
  adminEmail: 'dassomnath2025@gmail.com',
  upiId: 'dassomnath2025@okaxis',
  payeeName: 'Somnath Das',
  defaultAmount: 100,
  message: 'Support Encript & Visual Creators in India',
  isActive: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'feed'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem('pintrust_pins');
    return saved ? JSON.parse(saved) : INITIAL_PINS;
  });

  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem('pintrust_boards');
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('encript_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'following' | 'saved'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Pins');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'saved' | 'newest'>('trending');
  const [activePinModal, setActivePinModal] = useState<Pin | null>(null);
  const [isCreatePinModalOpen, setIsCreatePinModalOpen] = useState<boolean>(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Donation & Admin Settings State
  const [donationConfig, setDonationConfig] = useState<DonationConfig>(() => {
    const saved = localStorage.getItem('pintrust_donation_config');
    return saved ? JSON.parse(saved) : DEFAULT_DONATION_CONFIG;
  });
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState<boolean>(false);

  // Dark Mode support synced with document.documentElement
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 1. Connection test & seed website data in Firestore database on boot
  useEffect(() => {
    const initDb = async () => {
      await testConnection();
      try {
        await seedWebsiteDataToDb(INITIAL_PINS, INITIAL_BOARDS, DEFAULT_DONATION_CONFIG);
      } catch (err) {
        console.warn('Initial database seed note:', err);
      }
    };
    initDb();
  }, []);

  // 2. Real-time Firebase Auth listener: syncs logged-in user profile from Firestore
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getUserProfileFromDb(fbUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            const handleStr = `@${(fbUser.displayName || 'user')
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, '')
              .slice(0, 15)}`;
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              name: fbUser.displayName || 'Visual Explorer',
              handle: handleStr,
              avatar:
                fbUser.photoURL ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(fbUser.uid)}`,
              bio: 'Visual curator & aesthetic collector on Encript',
              email: fbUser.email || '',
              followersCount: 0,
              followingCount: 0,
            };
            setUser(newProfile);
            await saveUserProfileInDb(newProfile);
          }
        } catch (err) {
          console.warn('Auth user sync note:', err);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 3. Real-time Firestore Pins subscription: live cloud updates for all uploaded pins
  useEffect(() => {
    const unsubscribePins = subscribePinsFromDb((cloudPins) => {
      if (cloudPins && cloudPins.length > 0) {
        setPins((prev) => {
          const cloudIds = new Set(cloudPins.map((p) => p.id));
          const localCustom = prev.filter((p) => !cloudIds.has(p.id) && p.id.startsWith('pin-user-'));
          return [...cloudPins, ...localCustom];
        });
      }
    });
    return () => unsubscribePins();
  }, []);

  // 4. Real-time Firestore Boards subscription
  useEffect(() => {
    const unsubscribeBoards = subscribeBoardsFromDb((cloudBoards) => {
      if (cloudBoards && cloudBoards.length > 0) {
        setBoards((prev) => {
          const cloudIds = new Set(cloudBoards.map((b) => b.id));
          const localCustom = prev.filter((b) => !cloudIds.has(b.id));
          return [...cloudBoards, ...localCustom];
        });
      }
    });
    return () => unsubscribeBoards();
  }, []);

  // 5. Real-time Firestore Donation Config subscription
  useEffect(() => {
    const unsubscribeDonation = subscribeDonationConfig((config) => {
      setDonationConfig(config);
    });
    return () => unsubscribeDonation();
  }, []);

  // Sync to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem('pintrust_pins', JSON.stringify(pins));
    } catch {
      // LocalStorage quota fallback
    }
  }, [pins]);

  useEffect(() => {
    try {
      localStorage.setItem('pintrust_boards', JSON.stringify(boards));
    } catch {
      // LocalStorage quota fallback
    }
  }, [boards]);

  useEffect(() => {
    try {
      localStorage.setItem('pintrust_donation_config', JSON.stringify(donationConfig));
    } catch {
      // LocalStorage quota fallback
    }
  }, [donationConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('encript_user_profile', JSON.stringify(user));
    } catch {
      // LocalStorage quota fallback
    }
  }, [user]);

  const handleSaveProfile = async (updated: UserProfile) => {
    setUser(updated);
    showToast(`Profile updated! Welcome ${updated.name}`);
    try {
      await saveUserProfileInDb(updated);
    } catch (err) {
      console.warn('Profile DB save note:', err);
    }
  };

  const handleSaveDonationConfig = async (updated: DonationConfig) => {
    setDonationConfig(updated);
    showToast('Payment destination & donation settings updated!');
    try {
      await saveDonationConfigInDb(updated);
    } catch (err) {
      console.warn('Donation DB save note:', err);
    }
  };

  const handleAuthenticateAdmin = async () => {
    const adminUser: UserProfile = {
      ...user,
      email: 'dassomnath2025@gmail.com',
      name: 'Somnath Das',
    };
    setUser(adminUser);
    showToast('Verified Google Account: dassomnath2025@gmail.com');
    try {
      await saveUserProfileInDb(adminUser);
    } catch (err) {
      console.warn('Admin profile save note:', err);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOutUser();
      setUser(INITIAL_USER);
      showToast('Logged out of Encript');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Toast trigger helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Toggle Save Pin to Board
  const handleToggleSave = (pinId: string, boardId?: string) => {
    const targetBoardId = boardId || boards[0]?.id || '';
    let updatedSaves = 0;
    let willBeSaved = false;

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          willBeSaved = !p.isSaved;
          updatedSaves = willBeSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1);
          return {
            ...p,
            isSaved: willBeSaved,
            savedInBoardId: willBeSaved ? targetBoardId : undefined,
            savesCount: updatedSaves,
          };
        }
        return p;
      })
    );

    // Update active modal pin if open
    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          isSaved: willBeSaved,
          savedInBoardId: willBeSaved ? targetBoardId : undefined,
          savesCount: updatedSaves,
        };
      }
      return curr;
    });

    const targetBoard = boards.find((b) => b.id === targetBoardId);
    showToast(willBeSaved ? `Saved to ${targetBoard?.name || 'Board'}` : 'Removed from saved pins');

    // Sync save to Firestore
    updatePinInDb(pinId, {
      savesCount: updatedSaves,
      savedInBoardId: willBeSaved ? targetBoardId : '',
    }).catch((err) => console.warn('Sync save to db note:', err));
  };

  // Toggle Like Pin
  const handleToggleLike = (pinId: string) => {
    let willBeLiked = false;
    let updatedLikes = 0;

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          willBeLiked = !p.isLiked;
          updatedLikes = willBeLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          return {
            ...p,
            isLiked: willBeLiked,
            likesCount: updatedLikes,
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          isLiked: willBeLiked,
          likesCount: updatedLikes,
        };
      }
      return curr;
    });

    // Sync like to Firestore
    updatePinInDb(pinId, { likesCount: updatedLikes }).catch((err) =>
      console.warn('Sync like to db note:', err)
    );
  };

  // Toggle Follow Author
  const handleToggleFollow = (authorHandle: string) => {
    let nowFollowing = false;
    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.author.handle === authorHandle) {
          nowFollowing = !p.author.isFollowing;
          return {
            ...p,
            author: {
              ...p.author,
              isFollowing: nowFollowing,
              followersCount: nowFollowing
                ? p.author.followersCount + 1
                : Math.max(0, p.author.followersCount - 1),
            },
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.author.handle === authorHandle) {
        const willFollow = !curr.author.isFollowing;
        return {
          ...curr,
          author: {
            ...curr.author,
            isFollowing: willFollow,
            followersCount: willFollow
              ? curr.author.followersCount + 1
              : Math.max(0, curr.author.followersCount - 1),
          },
        };
      }
      return curr;
    });

    showToast(nowFollowing ? `Following ${authorHandle}` : `Unfollowed ${authorHandle}`);
  };

  // Add Comment
  const handleAddComment = (pinId: string, text: string) => {
    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      text,
      timeAgo: 'Just now',
      likes: 0,
    };

    let updatedCommentsList: any[] = [];

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          updatedCommentsList = [newCommentObj, ...p.comments];
          return {
            ...p,
            comments: updatedCommentsList,
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          comments: [newCommentObj, ...curr.comments],
        };
      }
      return curr;
    });

    showToast('Comment posted');

    if (updatedCommentsList.length > 0) {
      updatePinInDb(pinId, { comments: updatedCommentsList }).catch((err) =>
        console.warn('Sync comment to db note:', err)
      );
    }
  };

  // Like a comment
  const handleLikeComment = (pinId: string, commentId: string) => {
    let syncedComments: any[] = [];
    const updateComments = (comments: typeof pins[0]['comments']) => {
      const res = comments.map((c) => {
        if (c.id === commentId) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      });
      syncedComments = res;
      return res;
    };

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            comments: updateComments(p.comments),
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          comments: updateComments(curr.comments),
        };
      }
      return curr;
    });

    if (syncedComments.length > 0) {
      updatePinInDb(pinId, { comments: syncedComments }).catch((err) =>
        console.warn('Sync like comment note:', err)
      );
    }
  };

  // Create new Pin and persist to Firestore database
  const handleCreatePin = async (newPin: Pin) => {
    setPins([newPin, ...pins]);
    setActiveTab('explore');

    try {
      await createPinInDb(newPin);
      showToast(`Saved to database: "${newPin.title}"!`);
    } catch (err) {
      console.error('Firestore pin upload error:', err);
      showToast(`Uploaded locally: "${newPin.title}"`);
    }
  };

  // Create new Board and persist to Firestore database
  const handleCreateBoard = async (newBoard: Board) => {
    setBoards([...boards, newBoard]);

    try {
      await createBoardInDb(newBoard);
      showToast(`Board "${newBoard.name}" saved to database!`);
    } catch (err) {
      console.error('Firestore board creation error:', err);
      showToast(`Created board "${newBoard.name}"`);
    }
  };

  // Share Pin / Copy Link
  const handleSharePin = (pin: Pin) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pin.sourceUrl || window.location.href);
      showToast('Link copied to clipboard!');
    } else {
      showToast('Sharing pin link');
    }
  };

  // Share profile
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  // Filtered and Sorted Pins
  const filteredPins = useMemo(() => {
    let result = pins;

    // Category filter
    if (selectedCategory !== 'All Pins') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'trending') {
      result = [...result].sort((a, b) => b.savesCount + b.likesCount - (a.savesCount + a.likesCount));
    } else if (sortBy === 'saved') {
      result = [...result].sort((a, b) => b.savesCount - a.savesCount);
    }

    return result;
  }, [pins, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F4F6F4] dark:bg-[#121D18] text-[#1C1C1C] dark:text-[#EDF2EE] flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* View Switcher Floating Badge at Bottom */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setCurrentView((prev) => (prev === 'landing' ? 'feed' : 'landing'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1C1C1C] dark:bg-[#1B2922] text-white text-xs font-bold shadow-xl hover:scale-105 transition-all cursor-pointer border border-[#4A6958]/30"
          title="Toggle between in.pinterest.com Landing Page and Logged-in Home Feed"
        >
          {currentView === 'landing' ? (
            <>
              <Grid className="w-4 h-4 text-[#4A6958]" />
              <span>Switch to Home Feed</span>
            </>
          ) : (
            <>
              <LayoutTemplate className="w-4 h-4 text-[#4A6958]" />
              <span>Switch to Landing Page</span>
            </>
          )}
        </button>
      </div>

      {/* RENDER VIEW 1: in.pinterest.com Landing Page */}
      {currentView === 'landing' ? (
        <PinterestLanding
          onEnterApp={() => setCurrentView('feed')}
          onOpenLogin={() => {
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
          onOpenSignup={() => {
            setAuthMode('signup');
            setAuthModalOpen(true);
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onOpenDonationModal={() => setIsDonationModalOpen(true)}
        />
      ) : (
        /* RENDER VIEW 2: Pinterest Home Feed */
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onOpenCreateModal={() => setIsCreatePinModalOpen(true)}
            onSwitchToLanding={() => setCurrentView('landing')}
            user={user}
            donationConfig={donationConfig}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
            onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onLogOut={handleLogOut}
            onOpenLogin={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
          />

          <main className="flex-1">
            {activeTab === 'explore' && (
              <div className="max-w-[1920px] mx-auto px-3 sm:px-6 pt-3 pb-6">
                {/* Category Filter Pills (Clean Pinterest style, no space section, no downside scrollbar) */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                  <div className="flex items-center gap-2 shrink-0">
                    {(searchQuery || selectedCategory !== 'All Pins') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All Pins');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1B2922] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] transition-colors cursor-pointer shrink-0"
                        title="Reset to All Pins"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#4A6958]" />
                        <span>All</span>
                      </button>
                    )}
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4.5 py-2 text-sm font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 tracking-normal ${
                          selectedCategory === cat
                            ? 'bg-[#4A6958] text-white shadow-md'
                            : 'bg-white hover:bg-[#E8EDE9] dark:bg-[#1B2922] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] border border-[#D6DFD8] dark:border-[#273A31] shadow-2xs'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#435146] dark:text-[#8FA597]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold bg-white hover:bg-[#E8EDE9] dark:bg-[#1B2922] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] border border-[#D6DFD8] dark:border-[#273A31] rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4A6958] cursor-pointer"
                    >
                      <option value="trending">Trending</option>
                      <option value="saved">Most Saved</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Empty State */}
                {filteredPins.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-[#1B2922]/50 rounded-3xl border border-dashed border-[#D6DFD8] dark:border-[#273A31]">
                    <Compass className="w-10 h-10 text-[#435146] mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-bold text-[#1C1C1C] dark:text-[#EDF2EE]">
                      No pins found for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-[#435146] dark:text-[#8FA597] mt-1 max-w-sm mx-auto">
                      Try searching for chai time snacks, Indian home decor, ethnic outfits, or concrete architecture.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Pins');
                      }}
                      className="mt-4 px-4 py-2 bg-[#4A6958] text-white text-xs font-bold rounded-full hover:bg-[#3D5849] cursor-pointer shadow-sm"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  /* Pinterest Masonry Grid */
                  <div
                    key={`${selectedCategory}-${searchQuery}-${sortBy}`}
                    className="masonry-grid"
                  >
                    {filteredPins.map((pin, index) => (
                      <PinCard
                        key={pin.id}
                        index={index}
                        pin={pin}
                        boards={boards}
                        onOpenModal={(p) => setActivePinModal(p)}
                        onToggleSave={handleToggleSave}
                        onToggleLike={handleToggleLike}
                        onShare={handleSharePin}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'following' && (
              <FollowingView
                pins={pins}
                boards={boards}
                onOpenModal={(p) => setActivePinModal(p)}
                onToggleSave={handleToggleSave}
                onToggleLike={handleToggleLike}
                onToggleFollow={handleToggleFollow}
                onShare={handleSharePin}
                onBack={() => setActiveTab('explore')}
              />
            )}

            {activeTab === 'saved' && (
              <BoardsView
                user={user}
                boards={boards}
                allPins={pins}
                onOpenCreateBoard={() => setIsCreateBoardModalOpen(true)}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
                onOpenModal={(p) => setActivePinModal(p)}
                onToggleSave={handleToggleSave}
                onToggleLike={handleToggleLike}
                onShare={handleSharePin}
                onShareProfile={handleShareProfile}
                onBack={() => setActiveTab('explore')}
              />
            )}
          </main>
        </>
      )}

      {/* Lightbox Detail Modal */}
      <PinModal
        pin={activePinModal}
        allPins={pins}
        boards={boards}
        onClose={() => setActivePinModal(null)}
        onToggleSave={handleToggleSave}
        onToggleLike={handleToggleLike}
        onToggleFollow={handleToggleFollow}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onSelectPin={(p) => setActivePinModal(p)}
        onShare={handleSharePin}
      />

      {/* Create Pin Studio Modal */}
      <CreatePinModal
        boards={boards}
        user={user}
        isOpen={isCreatePinModalOpen}
        onClose={() => setIsCreatePinModalOpen(false)}
        onCreatePin={handleCreatePin}
      />

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      {/* Login & Signup Modal */}
      <LoginSignupModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => {
          if (profile) {
            setUser(profile);
            saveUserProfileInDb(profile).catch((err) => console.warn('Profile save note:', err));
          }
          setCurrentView('feed');
          showToast(`Welcome to Encript${profile?.name ? `, ${profile.name}` : ''}!`);
        }}
      />

      {/* Donation QR & Rupee Payment Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        config={donationConfig}
        currentUser={user}
        onOpenAdminSettings={() => {
          setIsDonationModalOpen(false);
          setIsAdminSettingsOpen(true);
        }}
        onDonationSuccess={(amt) => showToast(`Thank you for your ₹${amt} donation!`)}
      />

      {/* Admin Payment Settings Modal (Strictly for dassomnath2025@gmail.com) */}
      <AdminDonationSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        config={donationConfig}
        currentUser={user}
        onSaveConfig={handleSaveDonationConfig}
        onAuthenticateAdmin={handleAuthenticateAdmin}
      />

      {/* Edit Profile Modal (Name Bar, Picture Change, Mobile-Optimized) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
