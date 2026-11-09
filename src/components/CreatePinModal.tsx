import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles, Loader2 } from 'lucide-react';
import { Pin, Board, UserProfile } from '../types';
import { CATEGORIES } from '../data/pinsData';

interface CreatePinModalProps {
  boards: Board[];
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreatePin: (newPin: Pin) => void | Promise<void>;
}

export const CreatePinModal: React.FC<CreatePinModalProps> = ({
  boards,
  user,
  isOpen,
  onClose,
  onCreatePin,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1] || 'Architecture');
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '4:3' | '1:1' | '16:9'>('3:4');
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      // Optimize & scale down camera images using Canvas so they stay safely under Firestore limits
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
          setImageUrl(compressedDataUrl);
        } else {
          setImageUrl(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl || isPublishing) return;

    setIsPublishing(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newPin: Pin = {
      id: `pin-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Created with Encript visual discovery studio.',
      imageUrl: imageUrl,
      aspectRatio: aspectRatio,
      category: category,
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        followersCount: user.followersCount,
        isFollowing: false,
      },
      authorId: user.uid || `curator_${Date.now()}`,
      savesCount: 1,
      likesCount: 1,
      isSaved: true,
      savedInBoardId: selectedBoardId,
      sourceUrl: sourceUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : [category, 'Inspiration', 'Moodboard'],
      createdAt: 'Just now',
      comments: [],
    };

    try {
      await onCreatePin(newPin);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setSourceUrl('');
      setTagsInput('');
    } finally {
      setIsPublishing(false);
    }
  };

  const presetImages = [
    {
      name: 'Modern Studio Concrete',
      url: '/src/assets/images/pin_minimal_architecture_1793629020212.jpg',
      ratio: '3:4' as const,
    },
    {
      name: 'Scandinavian Living Space',
      url: '/src/assets/images/pin_warm_interior_1793629035949.jpg',
      ratio: '4:3' as const,
    },
    {
      name: 'Editorial Wool Fashion',
      url: '/src/assets/images/pin_editorial_fashion_1793629050559.jpg',
      ratio: '3:4' as const,
    },
    {
      name: 'Ceramic Pour Over Coffee',
      url: '/src/assets/images/pin_artisan_coffee_1793629065505.jpg',
      ratio: '1:1' as const,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#4A6958]/15 dark:bg-[#4A6958]/25 text-[#4A6958] dark:text-[#8FA597] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Create New Pin
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Upload/Preview, Right Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column (5 cols): Media Upload or Live Preview */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Visual Asset
            </span>

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 group">
                <img
                  src={imageUrl}
                  alt="Pin preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[380px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#4A6958] bg-[#4A6958]/10'
                    : 'border-stone-300 dark:border-stone-700 hover:border-stone-400 bg-stone-50 dark:bg-stone-850'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Drag and drop or click to upload
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Supports high-res PNG, JPG, WebP from your device
                </p>
              </div>
            )}

            {/* Alternative: Image URL Input or Quick Inspirations */}
            {!imageUrl && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                  <span className="text-[11px] text-stone-400 font-medium uppercase">Or image URL / sample</span>
                  <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                </div>

                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl px-3 py-2 border border-stone-200 dark:border-stone-700">
                  <ImageIcon className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="Paste image web link..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 focus:outline-none placeholder:text-stone-400"
                  />
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-stone-500 font-medium block mb-1.5">
                    Quick sample assets:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {presetImages.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setImageUrl(p.url);
                          setAspectRatio(p.ratio);
                        }}
                        className="text-left text-[11px] p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-300 truncate cursor-pointer transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Fields */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Add a clear, expressive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe materials, lighting, style, mood, or context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Select Board *
                  </label>
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4A6958] cursor-pointer"
                  >
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4A6958] cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Pins').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Destination Link
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl">
                  <LinkIcon className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com/article"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist, Oak, Daylight, Studio"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPublishing}
                className="px-5 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !imageUrl || isPublishing}
                className="px-6 py-2.5 bg-[#4A6958] hover:bg-[#3D5849] disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Storing in Database...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish & Save to Cloud</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
