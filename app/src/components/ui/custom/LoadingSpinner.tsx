import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

interface LoadingSpinnerProps {
  progress?: number;
}

export function LoadingSpinner({ progress = 0 }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated Fork and Spoon */}
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-lime/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-lime/40" />
        </motion.div>

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-lime/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-lime/60" />
        </motion.div>

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-6 rounded-full border-2 border-lime/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-1/2 right-0 translate-x-1 -translate-y-1/2 w-2 h-2 rounded-full bg-lime/80" />
        </motion.div>

        {/* Center Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-black" />
          </div>
        </motion.div>
      </div>

      {/* Text */}
      <div className="text-center">
        <motion.h3
          className="text-2xl font-heading font-bold text-white mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Chef is thinking...
        </motion.h3>
        <p className="text-white/60 text-sm">
          Balancing flavor, time, and what's actually in your fridge.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-lime rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <p className="text-white/40 text-xs font-mono">Takes ~5 seconds</p>
    </div>
  );
}
