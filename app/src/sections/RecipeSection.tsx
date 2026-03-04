import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecipeCard } from '@/components/ui/custom/RecipeCard';
import type { Recipe } from '@/types';

interface RecipeSectionProps {
  recipe: Recipe | null;
  onRegenerate: () => void;
}

export function RecipeSection({ recipe, onRegenerate }: RecipeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {recipe && (
        <motion.section
          ref={sectionRef}
          id="recipe"
          key="recipe-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden z-40"
          style={{
            background: 'radial-gradient(circle at 30% 45%, rgba(107,98,184,0.16), transparent 50%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={recipe.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
              >
                <RecipeCard recipe={recipe} onRegenerate={onRegenerate} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
