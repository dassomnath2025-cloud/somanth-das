import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Check,
  Globe,
  MapPin,
  AtSign,
  User as UserIcon,
  Upload,
  Link2,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle.replace(/^@/, ''));
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [website, setWebsite] = useState(user.website || '');
  const [location, setLocation] = useState(user.location || '');
  const [photoSourceTab, setPhotoSourceTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Curated diverse high-resolution aesthetic avatars
  const AVATAR_PRESETS = [
    {
      name: 'Creative Director',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Architect & Designer',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Ceramicist',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Visual Stylist',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Editorial Curator',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Studio Founder',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Photographer',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Minimalist Maker',
      url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setAvatar(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setAvatar(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setAvatar(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleGenerateInitialsAvatar = () => {
    const initials = (name.trim() || 'User')
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    const colors = ['e60023', '0076d3', '407a52', 'c05621', '6b21a8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const generatedUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      initials
    )}&backgroundColor=${randomColor}&textColor=ffffff&fontWeight=700`;
    setAvatar(generatedUrl);
  };

  const handleResetToDefault = () => {
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim().replace(/\s+/g, '_').toLowerCase()}`;

    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      handle: formattedHandle,
      bio: bio.trim(),
      avatar: avatar,
      website: website.trim() || undefined,
      location: location.trim() || undefined,
    };

    setIsSaved(true);
    onSave(updated);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card: Bottom sheet on mobile (<640px), centered dialog on tablet/desktop */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull-down handle affordance */}
        <div className="pt-3 pb-1 sm:hidden flex justify-center">
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-5 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
              <span>Edit Profile</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#4A6958]/15 dark:bg-[#4A6958]/25 text-[#4A6958] dark:text-[#8FA597]">
                Public
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Customize your name, profile photo, and bio details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-8 py-4 sm:py-6 space-y-5">
          {/* PROFILE PICTURE CHANGE SECTION */}
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850/70 rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-3 uppercase tracking-wider">
              Profile Picture
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Avatar Preview with Camera Action Trigger */}
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-22 h-22 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white dark:ring-stone-800 shadow-md transition-transform group-hover:scale-102"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4A6958] text-white flex items-center justify-center shadow-md hover:bg-[#3D5849] transition-all cursor-pointer ring-2 ring-white dark:ring-stone-900"
                  title="Upload from device"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Source Controls */}
              <div className="flex-1 w-full text-center sm:text-left">
                {/* Method Switcher Pills */}
                <div className="flex items-center justify-center sm:justify-start gap-1 p-1 bg-stone-200/70 dark:bg-stone-800 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('upload')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      photoSourceTab === 'upload'
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Upload / Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('presets')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      photoSourceTab === 'presets'
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('url')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      photoSourceTab === 'url'
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Link URL
                  </button>
                </div>

                {/* Sub-view 1: Device Upload & Instant Camera */}
                {photoSourceTab === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 px-4 text-xs font-bold bg-[#4A6958] hover:bg-[#3D5849] text-white rounded-full transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateInitialsAvatar}
                        className="h-10 px-3.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        title="Generate avatar from your name initials"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Initials Badge</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetToDefault}
                        className="h-10 w-10 text-stone-400 hover:text-red-500 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        title="Reset photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Supports JPG, PNG, WebP from camera or gallery.
                    </p>
                  </div>
                )}

                {/* Sub-view 2: Curated Aesthetic Presets */}
                {photoSourceTab === 'presets' && (
                  <div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setAvatar(preset.url)}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden transition-all cursor-pointer relative ${
                            avatar === preset.url
                              ? 'ring-3 ring-[#4A6958] scale-105 shadow-sm'
                              : 'ring-1 ring-stone-300 dark:ring-stone-700 hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={preset.name}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {avatar === preset.url && (
                            <div className="absolute inset-0 bg-[#4A6958]/35 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-2">
                      Tap any preset photo to apply instantly.
                    </p>
                  </div>
                )}

                {/* Sub-view 3: Paste Direct Web Link URL */}
                {photoSourceTab === 'url' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl">
                        <Link2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <input
                          type="url"
                          placeholder="Paste image web link (https://...)"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        disabled={!customUrl.trim()}
                        className="h-9 px-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 disabled:opacity-40 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NAME TEXT BAR (PRIMARY FOCUS FEATURE) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                Your Name *
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                {name.length}/50
              </span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <UserIcon className="w-4 h-4 text-[#4A6958]" />
              </div>
              <input
                type="text"
                required
                maxLength={50}
                placeholder="Enter your full name (e.g. Somnath Das)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pl-10 pr-9 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm font-semibold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958] focus:border-transparent transition-all shadow-2xs"
              />
              {name && (
                <button
                  type="button"
                  onClick={() => setName('')}
                  className="absolute right-3 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                  title="Clear name"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              People will see this name across your pins, boards, and published comments.
            </p>
          </div>

          {/* USERNAME / HANDLE TEXT BAR */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
              Username Handle *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <AtSign className="w-4 h-4 text-stone-400" />
              </div>
              <input
                type="text"
                required
                maxLength={30}
                placeholder="username"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="w-full h-11 pl-10 pr-3 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm font-mono text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958] focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[11px] font-mono text-stone-400">
              encript.com/@{handle || 'username'}
            </p>
          </div>

          {/* ABOUT / BIO */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                Bio / About You
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                {bio.length}/180
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={180}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other curators about your visual style, hobbies, or moodboards..."
              className="w-full p-3.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* WEBSITE & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Website Link
              </label>
              <div className="relative flex items-center">
                <Globe className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://yourlink.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Location
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
                />
              </div>
            </div>
          </div>

          {/* LIVE MINI PREVIEW CARD */}
          <div className="p-3.5 bg-gradient-to-r from-stone-100 to-stone-50 dark:from-stone-850 dark:to-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <img
              src={avatar}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-stone-700 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Live Preview
              </span>
              <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                {name || 'Your Name'}
              </p>
              <p className="text-[11px] text-stone-500 font-mono truncate">
                @{handle || 'handle'} {location ? `· ${location}` : ''}
              </p>
            </div>
            <Eye className="w-4 h-4 text-stone-400 shrink-0" />
          </div>
        </form>

        {/* STICKY BOTTOM ACTIONS (THUMB-ZONE OPTIMIZED ON MOBILE) */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-5 sm:px-8 py-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="h-11 px-7 bg-[#4A6958] hover:bg-[#3D5849] active:scale-[0.98] disabled:opacity-40 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
