import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Share2,
  ExternalLink,
  Check,
  Send,
  UserPlus,
  UserCheck,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { Pin, Board } from '../types';

interface PinModalProps {
  pin: Pin | null;
  allPins: Pin[];
  boards: Board[];
  onClose: () => void;
  onToggleSave: (pinId: string, boardId?: string) => void;
  onToggleLike: (pinId: string) => void;
  onToggleFollow: (authorHandle: string) => void;
  onAddComment: (pinId: string, text: string) => void;
  onLikeComment: (pinId: string, commentId: string) => void;
  onSelectPin: (pin: Pin) => void;
  onShare: (pin: Pin) => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  pin,
  allPins,
  boards,
  onClose,
  onToggleSave,
  onToggleLike,
  onToggleFollow,
  onAddComment,
  onLikeComment,
  onSelectPin,
  onShare,
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');

  useEffect(() => {
    if (pin) {
      setSelectedBoardId(pin.savedInBoardId || boards[0]?.id || '');
    }
  }, [pin, boards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pin) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(pin.id, newComment.trim());
    setNewComment('');
  };

  // Find related pins in same category
  const relatedPins = allPins
    .filter((p) => p.id !== pin.id && p.category === pin.category)
    .slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-[#1B2922] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row border border-[#D6DFD8] dark:border-[#273A31]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-[#1F3028]/90 hover:bg-white dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: High-Res Image Media */}
        <div className="w-full md:w-1/2 bg-[#E8EDE9] dark:bg-[#121D18] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="relative max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-md"
            />
          </div>
        </div>

        {/* Right Column: Information, Author, Comments */}
        <div className="w-full md:w-1/2 flex flex-col justify-between max-h-[85vh] md:max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <div>
            {/* Top Action Bar */}
            <div className="flex items-center justify-between gap-3 pb-6 border-b border-[#E8EDE9] dark:border-[#273A31]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShare(pin)}
                  className="w-9 h-9 rounded-full bg-[#E8EDE9] dark:bg-[#1F3028] hover:bg-[#D6DFD8] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] flex items-center justify-center transition-colors cursor-pointer"
                  title="Share Pin"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleLike(pin.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    pin.isLiked
                      ? 'bg-[#4A6958]/20 dark:bg-[#4A6958]/30 text-[#4A6958]'
                      : 'bg-[#E8EDE9] dark:bg-[#1F3028] hover:bg-[#D6DFD8] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE]'
                  }`}
                  title={pin.isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-4 h-4 ${pin.isLiked ? 'fill-[#4A6958]' : ''}`} />
                </button>

                {pin.sourceUrl && (
                  <a
                    href={pin.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#435146] dark:text-[#8FA597] hover:text-[#1C1C1C] dark:hover:text-white bg-[#E8EDE9] dark:bg-[#1F3028] hover:bg-[#D6DFD8] dark:hover:bg-[#273A31] rounded-full transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit Source</span>
                  </a>
                )}
              </div>

              {/* Board Selector & Save Button */}
              <div className="flex items-center gap-2 mr-8">
                <select
                  value={selectedBoardId}
                  onChange={(e) => setSelectedBoardId(e.target.value)}
                  className="text-xs font-medium bg-[#E8EDE9] dark:bg-[#1F3028] text-[#1C1C1C] dark:text-[#EDF2EE] border-none rounded-full px-3 py-2 focus:ring-2 focus:ring-[#4A6958] cursor-pointer"
                >
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onToggleSave(pin.id, selectedBoardId)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                    pin.isSaved
                      ? 'bg-[#1B2922] text-white hover:bg-[#121D18] dark:bg-[#121D18] border border-[#4A6958]/30'
                      : 'bg-[#4A6958] hover:bg-[#3D5849] text-white'
                  }`}
                >
                  {pin.isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>

            {/* Pin Content Title and Description */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1C] dark:text-[#EDF2EE] leading-snug">
                {pin.title}
              </h1>

              <p className="mt-3 text-sm text-[#435146] dark:text-[#8FA597] leading-relaxed">
                {pin.description}
              </p>

              {/* Unboxed Tags with Typographic Dot Separators */}
              {pin.tags && pin.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#435146] dark:text-[#8FA597]">
                  {pin.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span className="hover:text-[#4A6958] transition-colors cursor-pointer">
                        #{tag}
                      </span>
                      {idx < pin.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Author Profile Lockup */}
            <div className="mt-6 pt-6 border-t border-[#E8EDE9] dark:border-[#273A31] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={pin.author.avatar}
                  alt={pin.author.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                />
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                    {pin.author.name}
                  </h4>
                  <div className="text-xs text-stone-500 font-mono tabular-nums">
                    {pin.author.followersCount.toLocaleString()} followers
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggleFollow(pin.author.handle)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  pin.author.isFollowing
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:opacity-90'
                }`}
              >
                {pin.author.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Comments List */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  Comments ({pin.comments.length})
                </h3>
              </div>

              <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-1">
                {pin.comments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-2">
                    No comments yet. Share your reaction or inspiration!
                  </p>
                ) : (
                  pin.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 text-xs">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1C1C1C] dark:text-[#EDF2EE]">
                            {c.author}
                          </span>
                          <span className="text-[#435146] dark:text-[#8FA597] text-[11px]">{c.timeAgo}</span>
                        </div>
                        <p className="mt-1 text-[#435146] dark:text-[#EDF2EE]/85 leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                      <button
                        onClick={() => onLikeComment(pin.id, c.id)}
                        className={`flex items-center gap-1 text-[11px] p-1 rounded hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] transition-colors cursor-pointer ${
                          c.userLiked ? 'text-[#4A6958]' : 'text-[#435146] dark:text-[#8FA597] hover:text-[#1C1C1C]'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${c.userLiked ? 'fill-[#4A6958]' : ''}`} />
                        <span className="font-mono tabular-nums">{c.likes}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Comment Input Box */}
          <div className="mt-6 pt-4 border-t border-[#E8EDE9] dark:border-[#273A31]">
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment or thought..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#E8EDE9] dark:bg-[#1F3028] border border-[#D6DFD8] dark:border-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] text-xs rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="w-9 h-9 rounded-full bg-[#4A6958] hover:bg-[#3D5849] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
