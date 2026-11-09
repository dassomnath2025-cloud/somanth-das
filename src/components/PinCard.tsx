import React, { useState } from 'react';
import { Heart, ExternalLink, Share2, Check, Bookmark } from 'lucide-react';
import { Pin, Board } from '../types';

interface PinCardProps {
  pin: Pin;
  boards: Board[];
  onOpenModal: (pin: Pin) => void;
  onToggleSave: (pinId: string, boardId?: string) => void;
  onToggleLike: (pinId: string) => void;
  onShare: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({
  pin,
  boards,
  onOpenModal,
  onToggleSave,
  onToggleLike,
  onShare,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    pin.savedInBoardId || boards[0]?.id || ''
  );
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract clean domain for link label
  const getDomain = (url?: string) => {
    if (!url) return 'pin.trust';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'pin.trust';
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(pin.id, selectedBoardId);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(pin.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(pin);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pin.sourceUrl) {
      window.open(pin.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="masonry-item group cursor-pointer"
      onClick={() => onOpenModal(pin)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowBoardDropdown(false);
      }}
    >
      <div className="relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        {/* Skeleton placeholder while image is loading */}
        {!imageLoaded && !imageError && (
          <div className="w-full bg-stone-200 dark:bg-stone-700 animate-pulse aspect-3/4 flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-stone-400 opacity-40" />
          </div>
        )}

        {/* Fallback container if image fails */}
        {imageError ? (
          <div className="w-full aspect-3/4 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-800 dark:to-stone-900 p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {pin.category}
            </span>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200 line-clamp-3">
              {pin.title}
            </p>
          </div>
        ) : (
          <img
            src={pin.imageUrl}
            alt={pin.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102 ${
              imageLoaded ? 'block' : 'hidden'
            }`}
          />
        )}

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 bg-stone-950/25 p-3 flex flex-col justify-between transition-opacity duration-200 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar: Board Selector & Save Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBoardDropdown(!showBoardDropdown);
                }}
                className="max-w-32 truncate px-2.5 py-1.5 text-xs font-semibold text-white bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="truncate">
                  {boards.find((b) => b.id === selectedBoardId)?.name || 'Select Board'}
                </span>
              </button>

              {/* Board Selection Dropdown */}
              {showBoardDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 mt-1 w-48 bg-white dark:bg-[#1B2922] rounded-xl shadow-xl border border-[#D6DFD8] dark:border-[#273A31] py-1 z-30 overflow-hidden"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-[#435146] dark:text-[#8FA597] border-b border-[#E8EDE9] dark:border-[#273A31]">
                    Save to Board
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {boards.map((board) => (
                      <button
                        key={board.id}
                        onClick={() => {
                          setSelectedBoardId(board.id);
                          setShowBoardDropdown(false);
                          if (pin.isSaved) {
                            onToggleSave(pin.id, board.id);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#E8EDE9] dark:hover:bg-[#1F3028] cursor-pointer ${
                          selectedBoardId === board.id
                            ? 'text-[#4A6958] dark:text-[#8FA597] font-semibold'
                            : 'text-[#1C1C1C] dark:text-[#EDF2EE]'
                        }`}
                      >
                        <span className="truncate">{board.name}</span>
                        {selectedBoardId === board.id && <Check className="w-3.5 h-3.5 shrink-0 text-[#4A6958]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveClick}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0 ${
                pin.isSaved
                  ? 'bg-[#1B2922] dark:bg-[#121D18] text-white hover:bg-[#121D18] border border-[#4A6958]/30'
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

          {/* Bottom Bar: Source Link, Share, and Like */}
          <div className="flex items-center justify-between gap-2">
            {pin.sourceUrl ? (
              <button
                onClick={handleExternalLink}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white/90 hover:bg-white text-[#1C1C1C] rounded-full backdrop-blur-sm transition-colors cursor-pointer max-w-32 truncate shadow-sm"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{getDomain(pin.sourceUrl)}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareClick}
                title="Share Pin"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1C1C1C] flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-sm cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLikeClick}
                title={pin.isLiked ? 'Unlike' : 'Like'}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-sm cursor-pointer ${
                  pin.isLiked
                    ? 'bg-[#4A6958] text-white'
                    : 'bg-white/90 hover:bg-white text-[#1C1C1C]'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${pin.isLiked ? 'fill-white stroke-white' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Card Editorial Info Below Media */}
      <div className="mt-2.5 px-1">
        <h3 className="text-sm font-semibold text-[#1C1C1C] dark:text-[#EDF2EE] line-clamp-1 group-hover:text-[#4A6958] transition-colors">
          {pin.title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-xs text-[#435146] dark:text-[#8FA597]">
          <div className="flex items-center gap-1.5 truncate">
            <img
              src={pin.author.avatar}
              alt={pin.author.name}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="truncate font-medium">{pin.author.name}</span>
          </div>

          {/* Clean unboxed stats with typographic separator */}
          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] tabular-nums">
            <span>{pin.savesCount.toLocaleString()}</span>
            <span aria-hidden="true">·</span>
            <span>{pin.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
