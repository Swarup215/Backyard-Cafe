import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IngredientInput } from '@/components/ui/custom/IngredientInput';
import { SurpriseMeButton } from '@/components/ui/custom/SurpriseMeButton';
import { useApp } from '@/store/AppContext';

interface HeroSectionProps {
  onStartCooking: () => void;
}

export function HeroSection({ onStartCooking }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { state } = useApp();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const canProceed = state.ingredients.length > 0;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center z-10"
      style={{
        background: 'radial-gradient(circle at 38% 45%, rgba(107,98,184,0.18), transparent 55%)',
      }}
    >
      <motion.div 
        style={{ y, opacity }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-lime" />
              <span className="text-sm font-medium text-lime">AI-Powered Recipe Generator</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-[0.95]"
            >
              What's in your{' '}
              <span className="text-lime">fridge?</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/70 mb-8 max-w-md"
            >
              Type what you've got. We'll build a recipe around your mood.
            </motion.p>

            {/* Ingredient Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <IngredientInput />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                onClick={onStartCooking}
                disabled={!canProceed}
                whileHover={canProceed ? { scale: 1.02 } : {}}
                whileTap={canProceed ? { scale: 0.98 } : {}}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                  canProceed
                    ? 'bg-lime text-black hover:shadow-glow'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                Start cooking
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <SurpriseMeButton onComplete={onStartCooking} />
            </motion.div>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-sm text-white/40"
            >
              No sign-up · Free forever · AI chef on demand
            </motion.p>
          </motion.div>

          {/* Right Content - Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                className="relative rounded-[34px] overflow-hidden shadow-card"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <img
                  src="/hero_sandwich.jpg"
                  alt="Delicious food"
                  className="w-full aspect-[4/5] object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Tags */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2">
                    {['Eggs', 'Rice', 'Hot sauce'].map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-lime/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-violet/20 blur-xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
