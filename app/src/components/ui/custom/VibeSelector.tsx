import { motion } from 'framer-motion';
import { Heart, Zap, Brain, Dumbbell, Leaf, Star, Moon, Trash2 } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface Vibe {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
  gradient: string;
}

const vibes: Vibe[] = [
  {
    id: 'comfort',
    name: 'Comforting',
    description: 'Warm hug in a bowl',
    icon: Heart,
    image: '/vibe_comfort_bowl.jpg',
    gradient: 'from-rose-500/20 to-orange-500/20',
  },
  {
    id: 'spicy',
    name: 'Spicy & Fast',
    description: 'Less than 15 mins, more than enough heat',
    icon: Zap,
    image: '/vibe_spicy_plate.jpg',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'fresh',
    name: 'Clean & Light',
    description: 'Reset mode activated',
    icon: Leaf,
    image: '/vibe_fresh_salad.jpg',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'brain',
    name: 'Brain Food',
    description: 'Omega-3s and focus fuel',
    icon: Brain,
    image: '/saved_veggie_bowl.jpg',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'gains',
    name: 'Gains Mode',
    description: 'High protein, no excuses',
    icon: Dumbbell,
    image: '/hero_sandwich.jpg',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    id: 'impress',
    name: 'Impress Someone',
    description: 'Date night on a budget',
    icon: Star,
    image: '/final_cta_plate.jpg',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    id: 'midnight',
    name: 'Midnight Snack',
    description: 'No judgment, all flavor',
    icon: Moon,
    image: '/recipe_spicy_noodles.jpg',
    gradient: 'from-slate-500/20 to-gray-500/20',
  },
  {
    id: 'everything',
    name: 'Use Everything',
    description: 'Clean the fridge chaos',
    icon: Trash2,
    image: '/howto_ingredients.jpg',
    gradient: 'from-lime-500/20 to-green-500/20',
  },
];

export function VibeSelector() {
  const { state, setVibe } = useApp();

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
          Pick your vibe.
        </h2>
        <p className="text-lg text-white/60 max-w-md">
          We'll match ingredients to energy—comfort, heat, or something light.
        </p>
      </motion.div>

      {/* Vibe Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vibes.map((vibe, index) => {
          const isSelected = state.selectedVibe === vibe.id;
          const Icon = vibe.icon;

          return (
            <motion.button
              key={vibe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => setVibe(isSelected ? null : vibe.id)}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative group overflow-hidden rounded-3xl p-4 text-left transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-lime ring-offset-2 ring-offset-black' 
                  : 'hover:shadow-card'
              }`}
              style={{ aspectRatio: '1/1.2' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={vibe.image}
                  alt={vibe.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${vibe.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between">
                {/* Icon */}
                <motion.div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm ${
                    isSelected ? 'bg-lime text-black' : 'bg-white/20 text-white'
                  }`}
                  animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Text */}
                <div>
                  <h3 className="text-white font-heading font-bold text-lg mb-1">
                    {vibe.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-tight">
                    {vibe.description}
                  </p>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selectedVibe"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-lime flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-white/40 text-sm"
      >
        Tap a card to choose. You can change it anytime.
      </motion.p>
    </div>
  );
}
