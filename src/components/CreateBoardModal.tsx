import React, { useState } from 'react';
import { X, Lock, Unlock, FolderPlus } from 'lucide-react';
import { Board, UserProfile } from '../types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: Board) => void;
  user?: UserProfile;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
  user,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      userId: user?.uid || `curator_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      isPrivate,
      pinIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateBoard(newBoard);
    setName('');
    setDescription('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl p-6 border border-stone-200 dark:border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4A6958]/15 dark:bg-[#4A6958]/25 text-[#4A6958] dark:text-[#8FA597] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Create Board
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Board Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dream House, Fall Style, Coffee Inspo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Description (optional)
            </label>
            <textarea
              rows={2}
              placeholder="What is this board about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A6958] resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-[#4A6958] shrink-0" />
              ) : (
                <Unlock className="w-4 h-4 text-stone-400 shrink-0" />
              )}
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Keep this board secret
                </p>
                <p className="text-[11px] text-stone-500">
                  Only you can see this board and its saved pins.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-[#4A6958] rounded focus:ring-[#4A6958] accent-[#4A6958] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 bg-[#4A6958] hover:bg-[#3D5849] disabled:opacity-50 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
