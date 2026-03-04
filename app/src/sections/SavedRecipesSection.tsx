import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { useApp } from '@/store/AppContext';

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

export function SavedRecipesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { state, setRecipe } = useApp();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const recentRecipes = state.savedRecipes.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      id="saved"
      className="section-flowing py-24 z-60"
    >
      <motion.div 
        style={{ y }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Your saved vibes
            </h2>
            <p className="text-lg text-white/60">
              A running list of recipes you've locked in.
            </p>
          </div>
          {state.savedRecipes.length > 4 && (
            <motion.button
              whileHover={{ x: 5 }}
              className="hidden md:flex items-center gap-2 text-lime font-medium"
            >
              View all
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Recipe Cards */}
        {recentRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              No saved recipes yet
            </h3>
            <p className="text-white/60">
              Generate your first recipe and save it here!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recentRecipes.map((savedRecipe, index) => (
              <motion.div
                key={savedRecipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setRecipe(savedRecipe.recipe)}
                className="group cursor-pointer"
              >
                <div className="card-white overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={index % 2 === 0 ? '/recipe_spicy_noodles.jpg' : '/saved_veggie_bowl.jpg'}
                      alt={savedRecipe.recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Vibe Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                      <span className="text-lg">{vibeEmojis[savedRecipe.vibe] || '👨‍🍳'}</span>
                      <span className="text-sm font-medium text-black capitalize">
                        {savedRecipe.vibe}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-black mb-2 group-hover:text-violet transition-colors">
                      {savedRecipe.recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{savedRecipe.recipe.prep_time}</span>
                      <span>·</span>
                      <span>{savedRecipe.recipe.difficulty}</span>
                      <span>·</span>
                      <span>Serves {savedRecipe.recipe.servings}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
