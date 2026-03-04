import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/ui/custom/Navigation';
import { HistorySidebar } from '@/components/ui/custom/HistorySidebar';
import { HeroSection } from '@/sections/HeroSection';
import { VibeSection } from '@/sections/VibeSection';
import { GeneratingSection } from '@/sections/GeneratingSection';
import { RecipeSection } from '@/sections/RecipeSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { SavedRecipesSection } from '@/sections/SavedRecipesSection';
import { CTASection } from '@/sections/CTASection';
import { useApp } from '@/store/AppContext';
import { useRecipeGenerator } from '@/hooks/useRecipeGenerator';
import './App.css';

function App() {
  const { state, setRecipe } = useApp();
  const { generateRecipe, regenerate, isLoading } = useRecipeGenerator();
  const [showHistory, setShowHistory] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const vibeSectionRef = useRef<HTMLDivElement>(null);
  const recipeSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section helpers
  const scrollToVibe = useCallback(() => {
    vibeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToRecipe = useCallback(() => {
    recipeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle start cooking from hero
  const handleStartCooking = useCallback(() => {
    if (state.ingredients.length > 0) {
      scrollToVibe();
    }
  }, [state.ingredients.length, scrollToVibe]);

  // Handle generate recipe
  const handleGenerate = useCallback(async () => {
    if (state.ingredients.length === 0 || !state.selectedVibe) return;

    // Start progress animation
    setGenerationProgress(0);
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const recipe = await generateRecipe(
        state.ingredients,
        state.selectedVibe,
        state.constraints
      );
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setRecipe(recipe);
      
      // Scroll to recipe after a short delay
      setTimeout(() => {
        scrollToRecipe();
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Failed to generate recipe:', error);
    }
  }, [state.ingredients, state.selectedVibe, state.constraints, generateRecipe, setRecipe, scrollToRecipe]);

  // Handle regenerate
  const handleRegenerate = useCallback(async () => {
    try {
      const recipe = await regenerate();
      if (recipe) {
        setRecipe(recipe);
      }
    } catch (error) {
      console.error('Failed to regenerate recipe:', error);
    }
  }, [regenerate, setRecipe]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close history
      if (e.key === 'Escape') {
        setShowHistory(false);
      }
      
      // CMD/CTRL + K to open history
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowHistory(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation onShowHistory={() => setShowHistory(true)} />

      {/* History Sidebar */}
      <HistorySidebar isOpen={showHistory} onClose={() => setShowHistory(false)} />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection onStartCooking={handleStartCooking} />

        {/* Vibe Selection Section */}
        <div ref={vibeSectionRef}>
          <VibeSection onGenerate={handleGenerate} />
        </div>

        {/* Generating Section */}
        <GeneratingSection 
          isGenerating={isLoading} 
          progress={generationProgress}
        />

        {/* Recipe Section */}
        <div ref={recipeSectionRef}>
          <RecipeSection 
            recipe={state.currentRecipe} 
            onRegenerate={handleRegenerate}
          />
        </div>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Saved Recipes Section */}
        <SavedRecipesSection />

        {/* CTA & Footer Section */}
        <CTASection onStartCooking={handleStartCooking} />
      </main>

      {/* Floating Action Button (Mobile) */}
      <AnimatePresence>
        {state.currentRecipe && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToRecipe}
            className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-lime flex items-center justify-center shadow-glow z-50"
          >
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 hidden lg:flex items-center gap-2 text-white/30 text-sm"
      >
        <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-xs">⌘K</kbd>
        <span>for history</span>
      </motion.div>
    </div>
  );
}

export default App;
