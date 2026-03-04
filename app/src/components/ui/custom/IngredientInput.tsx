import { useState, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useIngredientCategorizer } from '@/hooks/useIngredientCategorizer';

const commonIngredients = [
  'Eggs', 'Rice', 'Pasta', 'Chicken', 'Onion', 'Garlic',
  'Tomato', 'Cheese', 'Milk', 'Butter', 'Bread', 'Potato'
];

export function IngredientInput() {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, addIngredient, removeIngredient } = useApp();
  const { categorizeIngredient, getCategoryColor, suggestPairings } = useIngredientCategorizer();

  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;
    if (state.ingredients.length >= 8) return;
    
    const category = categorizeIngredient(inputValue);
    addIngredient(inputValue, category);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const filteredSuggestions = commonIngredients.filter(
    ing => 
      ing.toLowerCase().includes(inputValue.toLowerCase()) &&
      !state.ingredients.some(i => i.name.toLowerCase() === ing.toLowerCase())
  ).slice(0, 4);

  const suggestions = suggestPairings(state.ingredients);

  return (
    <div className="w-full">
      {/* Input Field */}
      <div className="relative">
        <motion.div
          className="relative flex items-center"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder={state.ingredients.length === 0 ? "Type ingredients (e.g., eggs, rice...)" : "Add more..."}
            disabled={state.ingredients.length >= 8}
            className="w-full h-14 px-5 pr-14 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            onClick={handleAddIngredient}
            disabled={!inputValue.trim() || state.ingredients.length >= 8}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 w-10 h-10 rounded-xl bg-lime flex items-center justify-center text-black disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow transition-shadow"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Autocomplete Suggestions */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-card z-10"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    const category = categorizeIngredient(suggestion);
                    addIngredient(suggestion, category);
                    setInputValue('');
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-black/80 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-lime" />
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ingredient Tags */}
      <AnimatePresence mode="popLayout">
        {state.ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {state.ingredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 25,
                  delay: index * 0.05 
                }}
                layout
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl border ${getCategoryColor(ingredient.category)}`}
              >
                <span className="text-sm font-medium">{ingredient.name}</span>
                <motion.button
                  onClick={() => removeIngredient(ingredient.id)}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && state.ingredients.length > 0 && state.ingredients.length < 8 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex items-center gap-2 text-sm text-white/60"
          >
            <Sparkles className="w-4 h-4 text-lime" />
            <span>Try adding:</span>
            <div className="flex gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const item = suggestion.replace('Try adding ', '').replace('How about ', '').replace(' would complete this', '').replace(' could add richness', '');
                    const category = categorizeIngredient(item);
                    addIngredient(item, category);
                  }}
                  className="text-lime hover:underline cursor-pointer"
                >
                  {suggestion.replace('Try adding ', '').replace('How about ', '').replace('Rice or pasta', 'grains').replace('Cheese', 'dairy')}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Max Ingredients Warning */}
      <AnimatePresence>
        {state.ingredients.length >= 8 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-amber-400"
          >
            Maximum 8 ingredients reached. Remove one to add more.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
