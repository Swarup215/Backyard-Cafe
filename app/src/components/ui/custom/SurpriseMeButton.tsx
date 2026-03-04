import { motion } from 'framer-motion';
import { Sparkles, Shuffle } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const randomIngredients = [
  { name: 'Eggs', category: 'protein' as const },
  { name: 'Rice', category: 'grain' as const },
  { name: 'Pasta', category: 'grain' as const },
  { name: 'Chicken', category: 'protein' as const },
  { name: 'Onion', category: 'veggie' as const },
  { name: 'Garlic', category: 'veggie' as const },
  { name: 'Tomato', category: 'veggie' as const },
  { name: 'Cheese', category: 'dairy' as const },
  { name: 'Spinach', category: 'veggie' as const },
  { name: 'Mushroom', category: 'veggie' as const },
  { name: 'Bell Pepper', category: 'veggie' as const },
  { name: 'Tofu', category: 'protein' as const },
];

const randomVibes = [
  'comfort', 'spicy', 'fresh', 'brain', 'gains', 'clean', 'impress', 'midnight', 'everything'
];

interface SurpriseMeButtonProps {
  onComplete?: () => void;
}

export function SurpriseMeButton({ onComplete }: SurpriseMeButtonProps) {
  const { addIngredient, setVibe, clearIngredients } = useApp();

  const handleSurprise = () => {
    // Clear existing ingredients
    clearIngredients();
    
    // Pick 3-5 random ingredients
    const shuffled = [...randomIngredients].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
    
    // Add them with a staggered animation effect
    selected.forEach((ing, index) => {
      setTimeout(() => {
        addIngredient(ing.name, ing.category);
      }, index * 100);
    });
    
    // Pick a random vibe
    const randomVibe = randomVibes[Math.floor(Math.random() * randomVibes.length)];
    setVibe(randomVibe);
    
    onComplete?.();
  };

  return (
    <motion.button
      onClick={handleSurprise}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet/30 to-purple/30 border border-violet/50 text-white overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-lime/20 to-violet/20"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shuffle className="w-5 h-5 text-lime" />
        </motion.div>
        <span className="font-medium">Surprise Me</span>
        <Sparkles className="w-4 h-4 text-lime opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.button>
  );
}
