import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { VibeSelector } from '@/components/ui/custom/VibeSelector';
import { ConstraintToggles } from '@/components/ui/custom/ConstraintToggles';
import { useApp } from '@/store/AppContext';

interface VibeSectionProps {
  onGenerate: () => void;
}

export function VibeSection({ onGenerate }: VibeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { state } = useApp();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const canGenerate = state.ingredients.length > 0 && state.selectedVibe !== null;

  return (
    <section
      ref={sectionRef}
      id="vibe"
      className="section-flowing flex items-center py-20 z-20"
      style={{
        background: 'radial-gradient(circle at 72% 48%, rgba(107,98,184,0.16), transparent 50%)',
      }}
    >
      <motion.div 
        style={{ y, opacity }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Vibe Selector */}
          <div className="lg:col-span-2">
            <VibeSelector />
          </div>

          {/* Sidebar - Constraints & Generate */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Constraints */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <ConstraintToggles />
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-lime/20 to-lime/5 border border-lime/30"
            >
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Ready to cook?
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {canGenerate 
                  ? "We've got everything we need. Let's generate your recipe!"
                  : state.ingredients.length === 0
                  ? 'Add some ingredients first'
                  : 'Select a vibe to continue'}
              </p>
              <motion.button
                onClick={onGenerate}
                disabled={!canGenerate}
                whileHover={canGenerate ? { scale: 1.02 } : {}}
                whileTap={canGenerate ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                  canGenerate
                    ? 'bg-lime text-black hover:shadow-glow'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                Generate Recipe
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Selected Summary */}
            {state.ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <h4 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-3">
                  Your Selection
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Ingredients</span>
                    <span className="text-white font-medium">{state.ingredients.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Vibe</span>
                    <span className="text-lime font-medium capitalize">
                      {state.selectedVibe || 'Not selected'}
                    </span>
                  </div>
                  {state.constraints.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Constraints</span>
                      <span className="text-white font-medium">{state.constraints.length}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
