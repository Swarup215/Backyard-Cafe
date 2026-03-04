import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Flame, History, Sparkles } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface NavigationProps {
  onShowHistory: () => void;
}

export function Navigation({ onShowHistory }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useApp();
  const hasRecipe = state.currentRecipe !== null;
  const hasSaved = state.savedRecipes.length > 0;

  const menuItems = [
    { label: 'Generate Recipe', href: '#hero', icon: Sparkles },
    { label: 'Pick Vibe', href: '#vibe', icon: Flame },
    { label: 'Saved Recipes', href: '#saved', icon: History, badge: hasSaved ? state.savedRecipes.length : undefined },
  ];

  return (
    <>
      {/* Fixed Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-4"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-white font-heading font-bold text-xl tracking-tight">
              Cravings <span className="text-lime">&amp;</span> Scraps
            </span>
          </motion.a>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Recipe Ready Indicator */}
            <AnimatePresence>
              {hasRecipe && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/10 border border-lime/30"
                >
                  <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span className="text-xs font-medium text-lime">Recipe ready</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Button */}
            <motion.button
              onClick={onShowHistory}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">History</span>
              {hasSaved && (
                <span className="px-1.5 py-0.5 rounded-full bg-lime text-black text-xs font-bold">
                  {state.savedRecipes.length}
                </span>
              )}
            </motion.button>

            {/* Menu Button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Menu Content */}
            <div className="h-full flex flex-col items-center justify-center">
              <nav className="flex flex-col items-center gap-6">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 text-4xl md:text-6xl font-heading font-bold text-white/80 hover:text-lime transition-colors"
                  >
                    <item.icon className="w-8 h-8 md:w-12 md:h-12 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-3 py-1 rounded-full bg-lime text-black text-lg font-bold">
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                ))}
              </nav>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-white/40 text-sm"
              >
                <span>© Cravings & Scraps</span>
                <span>·</span>
                <span>Made for hungry students</span>
                {state.cookingStreak > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-lime flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {state.cookingStreak} day streak
                    </span>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
