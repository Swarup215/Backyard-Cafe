import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/custom/LoadingSpinner';

interface GeneratingSectionProps {
  isGenerating: boolean;
  progress: number;
}

export function GeneratingSection({ isGenerating, progress }: GeneratingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(isGenerating);

  useEffect(() => {
    if (isGenerating) {
      setShowContent(true);
    } else {
      const timer = setTimeout(() => setShowContent(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  return (
    <AnimatePresence>
      {showContent && (
        <motion.section
          ref={sectionRef}
          key="generating-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden z-30"
        >
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl mx-auto px-4 py-20"
              >
                {/* Main Card */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="card-black p-8 md:p-12"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left - Image */}
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative rounded-2xl overflow-hidden"
                    >
                      <img
                        src="/chef_cooking.jpg"
                        alt="Chef cooking"
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </motion.div>

                    {/* Right - Loading */}
                    <div className="flex flex-col items-center md:items-start">
                      <LoadingSpinner progress={progress} />
                    </div>
                  </div>
                </motion.div>

                {/* Fun Fact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center"
                >
                  <p className="text-white/40 text-sm">
                    Did you know? The average college student has 7 ingredients in their fridge at any given time.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
