import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Users, Check, ChevronDown, ChevronUp, Sparkles, RefreshCw, Share2, Bookmark, Star } from 'lucide-react';
import type { Recipe } from '@/types';
import { useApp } from '@/store/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  onRegenerate: () => void;
}

export function RecipeCard({ recipe, onRegenerate }: RecipeCardProps) {
  const { state, saveRecipe } = useApp();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const toggleStep = (step: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(step)) {
      newExpanded.delete(step);
    } else {
      newExpanded.add(step);
    }
    setExpandedSteps(newExpanded);
  };

  const handleSave = () => {
    if (!isSaved) {
      saveRecipe(recipe, state.ingredients.map(i => i.name), state.selectedVibe || 'custom');
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    const text = `${recipe.title}\n\nPrep: ${recipe.prep_time} | ${recipe.difficulty} | Serves ${recipe.servings}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i.item}: ${i.amount}`).join('\n')}\n\nMade with Cravings & Scraps 🍳`;
    
    try {
      await navigator.clipboard.writeText(text);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Recipe Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-white overflow-hidden"
      >
        {/* Header Image */}
        <div className="relative h-64 md:h-80">
          <img
            src="/recipe_spicy_noodles.jpg"
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-lime text-sm font-mono uppercase tracking-wider mb-2">
                Your Vibe
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                {recipe.title}
              </h2>
              <p className="text-white/80 text-sm">{recipe.vibe_match}</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isSaved ? 'bg-lime text-black' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5">
              <Clock className="w-4 h-4 text-black/60" />
              <span className="text-sm font-medium text-black/80">{recipe.prep_time}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5">
              <ChefHat className="w-4 h-4 text-black/60" />
              <span className="text-sm font-medium text-black/80">{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5">
              <Users className="w-4 h-4 text-black/60" />
              <span className="text-sm font-medium text-black/80">Serves {recipe.servings}</span>
            </div>
          </motion.div>

          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-xl font-heading font-bold text-black mb-4">
              What you'll need
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  onClick={() => toggleIngredient(index)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    checkedIngredients.has(index)
                      ? 'bg-lime/10'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    checkedIngredients.has(index)
                      ? 'bg-lime'
                      : 'border-2 border-gray-300'
                  }`}>
                    {checkedIngredients.has(index) && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`flex-1 ${checkedIngredients.has(index) ? 'line-through text-gray-400' : 'text-black'}`}>
                    {ing.item}
                  </span>
                  <span className="text-sm text-gray-500">{ing.amount}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-xl font-heading font-bold text-black mb-4">
              How to make it
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleStep(step.step)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-black">{step.step}</span>
                    </div>
                    <span className="flex-1 text-black">{step.instruction}</span>
                    {step.tip && (
                      expandedSteps.has(step.step) 
                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {step.tip && expandedSteps.has(step.step) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="ml-12 p-3 bg-amber-50 rounded-xl flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800">{step.tip}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Nutrition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-xl font-heading font-bold text-black mb-4">
              Rough nutrition <span className="text-sm font-normal text-gray-500">(per serving)</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-black">{recipe.nutrition_estimate.calories}</p>
                <p className="text-sm text-gray-500">calories</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-black">{recipe.nutrition_estimate.protein}</p>
                <p className="text-sm text-gray-500">protein</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-black">{recipe.nutrition_estimate.carbs}</p>
                <p className="text-sm text-gray-500">carbs</p>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {recipe.vibe_tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full bg-lime/10 text-lime text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Upgrade Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-lg font-heading font-bold text-black mb-3">
              Level it up
            </h3>
            <ul className="space-y-2">
              {recipe.upgrade_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 text-lime" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pair With */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-4 bg-violet/10 rounded-2xl mb-8"
          >
            <p className="text-sm text-violet-dark font-medium">
              Pair with: <span className="text-black">{recipe.pair_with}</span>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.button
              onClick={onRegenerate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-black text-white font-medium hover:bg-black/80 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Not feeling it? Try again
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={isSaved}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors ${
                isSaved
                  ? 'bg-lime/20 text-lime cursor-default'
                  : 'bg-lime text-black hover:bg-lime-dark'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved!' : 'Save this vibe'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full shadow-lg z-50"
          >
            Recipe copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
