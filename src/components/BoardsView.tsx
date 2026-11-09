import React, { useState } from 'react';
import { Lock, Plus, ArrowLeft, Grid, Bookmark, Share2, Edit3, Globe, MapPin } from 'lucide-react';
import { Board, Pin, UserProfile } from '../types';
import { PinCard } from './PinCard';

interface BoardsViewProps {
  user: UserProfile;
  boards: Board[];
  allPins: Pin[];
  onOpenCreateBoard: () => void;
  onOpenEditProfile?: () => void;
  onOpenModal: (pin: Pin) => void;
  onToggleSave: (pinId: string, boardId?: string) => void;
  onToggleLike: (pinId: string) => void;
  onShare: (pin: Pin) => void;
  onShareProfile: () => void;
  onBack?: () => void;
}

export const BoardsView: React.FC<BoardsViewProps> = ({
  user,
  boards,
  allPins,
  onOpenCreateBoard,
  onOpenEditProfile,
  onOpenModal,
  onToggleSave,
  onToggleLike,
  onShare,
  onShareProfile,
  onBack,
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'boards' | 'all-saved'>('boards');

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  // Pins saved in selected board
  const boardPins = selectedBoard
    ? allPins.filter((p) => p.isSaved && p.savedInBoardId === selectedBoard.id)
    : [];

  // All saved pins
  const allSavedPins = allPins.filter((p) => p.isSaved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button option */}
      {onBack && (
        <div className="mb-4 pb-2 border-b border-[#D6DFD8] dark:border-[#273A31]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8EDE9] dark:bg-[#1B2922] hover:bg-[#D6DFD8] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#4A6958]" />
            <span>Back to Home Feed</span>
          </button>
        </div>
      )}
      {/* Profile Header Block */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
        <div className="relative group cursor-pointer" onClick={onOpenEditProfile} title="Click to edit profile photo">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-[#4A6958]/25 shadow-lg group-hover:opacity-90 transition-opacity"
          />
          {/* Touch-friendly Camera badge */}
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4A6958] text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-[#1B2922] group-hover:scale-110 transition-transform">
            <Edit3 className="w-4 h-4" />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">
          {user.name}
        </h1>

        <p className="text-xs font-mono text-[#435146] dark:text-[#8FA597] mt-0.5">
          {user.handle}
        </p>

        <p className="mt-3 text-xs sm:text-sm text-[#435146] dark:text-[#EDF2EE]/85 leading-relaxed max-w-md">
          {user.bio}
        </p>

        {/* Website & Location info if present */}
        {(user.location || user.website) && (
          <div className="mt-2.5 flex items-center justify-center gap-4 text-xs text-[#435146] dark:text-[#8FA597]">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </span>
            )}
            {user.location && user.website && <span aria-hidden="true">·</span>}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#4A6958] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{user.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        )}

        {/* Clean unboxed follower metadata */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[#435146] dark:text-[#8FA597] font-mono tabular-nums">
          <span>{user.followersCount.toLocaleString()} followers</span>
          <span aria-hidden="true">·</span>
          <span>{user.followingCount} following</span>
          <span aria-hidden="true">·</span>
          <span>{allSavedPins.length} saved ideas</span>
        </div>

        {/* Action buttons: Edit Profile & Share Profile with thumb touch hitboxes */}
        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={onOpenEditProfile}
            className="flex items-center gap-2 px-5 min-h-[44px] bg-[#1C1C1C] dark:bg-[#1B2922] text-white hover:bg-[#1B2922] dark:hover:bg-[#273A31] border border-[#4A6958]/30 active:scale-[0.98] text-xs font-bold rounded-full shadow-sm transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#4A6958]" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onShareProfile}
            className="flex items-center gap-2 px-5 min-h-[44px] bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1F3028] dark:hover:bg-[#273A31] active:scale-[0.98] text-[#1C1C1C] dark:text-[#EDF2EE] text-xs font-bold rounded-full transition-all cursor-pointer border border-[#D6DFD8] dark:border-[#273A31]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* If inside a specific board view */}
      {selectedBoard ? (
        <div>
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedBoardId(null)}
                className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Back to all boards"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                    {selectedBoard.name}
                  </h2>
                  {selectedBoard.isPrivate && (
                    <span title="Secret Board">
                      <Lock className="w-4 h-4 text-stone-400" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedBoard.description} · {boardPins.length} pins
                </p>
              </div>
            </div>
          </div>

          {boardPins.length === 0 ? (
            <div className="text-center py-16 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
              <Bookmark className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                No pins saved to this board yet
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Explore feed and click "Save" on any pin to collect it here.
              </p>
            </div>
          ) : (
            <div className="masonry-grid">
              {boardPins.map((pin) => (
                <PinCard
                  key={pin.id}
                  pin={pin}
                  boards={boards}
                  onOpenModal={onOpenModal}
                  onToggleSave={onToggleSave}
                  onToggleLike={onToggleLike}
                  onShare={onShare}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Boards Overview */
        <div>
          {/* Segmented Switcher: Created Boards vs All Saved */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center p-1 bg-[#E8EDE9] dark:bg-[#1B2922] rounded-full border border-[#D6DFD8] dark:border-[#273A31]">
              <button
                onClick={() => setViewMode('boards')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  viewMode === 'boards'
                    ? 'bg-[#4A6958] text-white shadow-xs'
                    : 'text-[#435146] dark:text-[#8FA597] hover:text-[#1C1C1C]'
                }`}
              >
                Boards ({boards.length})
              </button>
              <button
                onClick={() => setViewMode('all-saved')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  viewMode === 'all-saved'
                    ? 'bg-[#4A6958] text-white shadow-xs'
                    : 'text-[#435146] dark:text-[#8FA597] hover:text-[#1C1C1C]'
                }`}
              >
                All Saved Pins ({allSavedPins.length})
              </button>
            </div>
          </div>

          {viewMode === 'boards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* "Create New Board" Card */}
              <button
                onClick={onOpenCreateBoard}
                className="group h-56 rounded-2xl border-2 border-dashed border-[#D6DFD8] dark:border-[#273A31] hover:border-[#4A6958] dark:hover:border-[#4A6958] bg-[#E8EDE9]/40 dark:bg-[#1B2922]/50 hover:bg-[#E8EDE9] dark:hover:bg-[#1B2922] flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1F3028] shadow-sm group-hover:scale-110 flex items-center justify-center text-[#4A6958] transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="mt-3 text-sm font-bold text-[#1C1C1C] dark:text-white">
                  Create Board
                </span>
                <span className="text-xs text-[#435146] dark:text-[#8FA597] mt-1">
                  Organize ideas & visuals
                </span>
              </button>

              {/* User Boards List */}
              {boards.map((board) => {
                const pinsInBoard = allPins.filter(
                  (p) => p.isSaved && p.savedInBoardId === board.id
                );
                const displayCover = board.coverImage || pinsInBoard[0]?.imageUrl;

                return (
                  <div
                    key={board.id}
                    onClick={() => setSelectedBoardId(board.id)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-56 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-xs group-hover:shadow-md transition-all">
                      {displayCover ? (
                        <img
                          src={displayCover}
                          alt={board.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                          <Grid className="w-8 h-8 opacity-40 mb-2" />
                          <span className="text-xs">Empty board</span>
                        </div>
                      )}

                      {/* Dark gradient vignette at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {board.isPrivate && (
                        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-sm font-bold leading-tight drop-shadow-sm truncate">
                          {board.name}
                        </p>
                        <p className="text-[11px] text-stone-200 mt-0.5 font-mono tabular-nums">
                          {pinsInBoard.length} pins
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* All Saved Pins Grid */
            <div>
              {allSavedPins.length === 0 ? (
                <div className="text-center py-16 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
                  <Bookmark className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    You haven't saved any pins yet
                  </p>
                  <p className="text-xs text-[#435146] dark:text-[#8FA597] mt-1">
                    Explore the feed and click the "Save" button to curate your board.
                  </p>
                </div>
              ) : (
                <div className="masonry-grid">
                  {allSavedPins.map((pin) => (
                    <PinCard
                      key={pin.id}
                      pin={pin}
                      boards={boards}
                      onOpenModal={onOpenModal}
                      onToggleSave={onToggleSave}
                      onToggleLike={onToggleLike}
                      onShare={onShare}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
