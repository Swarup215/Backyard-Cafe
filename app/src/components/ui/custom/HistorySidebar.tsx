import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Trash2, Clock, Star, Flame, ChefHat } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import type { SavedRecipe } from '@/types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const vibeEmojis: Record<string, string> = {
  comfort: '🍜',
  spicy: '🌶️',
  fresh: '🥗',
  brain: '🧠',
  gains: '💪',
  clean: '✨',
  impress: '💫',
  midnight: '🌙',
  everything: '🍳',
  custom: '👨‍🍳',
};

export function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
  const { state, deleteSavedRecipe, rateRecipe, setRecipe } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredRecipes = state.savedRecipes.filter(recipe =>
    recipe.recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadRecipe = (savedRecipe: SavedRecipe) => {
    setRecipe(savedRecipe.recipe);
    onClose();
  };

  const handleClearAll = () => {
    state.savedRecipes.forEach(recipe => {
      deleteSavedRecipe(recipe.id);
    });
    setShowClearConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-black border-r border-white/10 z-[160] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white">Your History</h2>
                    <p className="text-sm text-white/50">
                      {state.savedRecipes.length} recipe{state.savedRecipes.length !== 1 ? 's' : ''} saved
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your recipes..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-lime/50 transition-colors"
                />
              </div>
            </div>

            {/* Streak Banner */}
            {state.cookingStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{state.cookingStreak} day streak!</p>
                    <p className="text-white/60 text-sm">Keep the vibes going</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">
                    {searchQuery ? 'No recipes match your search' : 'No saved recipes yet'}
                  </p>
                  <p className="text-white/30 text-sm mt-2">
                    {searchQuery ? 'Try a different search term' : 'Generate and save your first vibe!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecipes.map((savedRecipe, index) => (
                    <motion.div
                      key={savedRecipe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div onClick={() => handleLoadRecipe(savedRecipe)}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{vibeEmojis[savedRecipe.vibe] || '👨‍🍳'}</span>
                            <div>
                              <h3 className="text-white font-medium group-hover:text-lime transition-colors">
                                {savedRecipe.recipe.title}
                              </h3>
                              <p className="text-white/40 text-sm">{formatDate(savedRecipe.timestamp)}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSavedRecipe(savedRecipe.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={(e) => {
                                e.stopPropagation();
                                rateRecipe(savedRecipe.id, star);
                              }}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  (savedRecipe.rating || 0) >= star
                                    ? 'text-lime fill-lime'
                                    : 'text-white/20'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.savedRecipes.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all history
                </button>
              </div>
            )}

            {/* Clear Confirmation Modal */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-10"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm p-6 rounded-3xl bg-black border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white text-center mb-2">
                      Clear all history?
                    </h3>
                    <p className="text-white/60 text-center mb-6">
                      This will permanently delete all your saved recipes.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        onClick={handleClearAll}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                      >
                        Clear All
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
