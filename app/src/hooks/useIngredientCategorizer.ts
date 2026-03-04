import { useCallback } from 'react';
import type { Ingredient } from '@/types';

const veggieKeywords = [
  'tomato', 'onion', 'garlic', 'lettuce', 'spinach', 'kale', 'carrot', 'potato',
  'broccoli', 'cauliflower', 'pepper', 'cucumber', 'zucchini', 'mushroom', 'corn',
  'peas', 'beans', 'asparagus', 'celery', 'cabbage', 'eggplant', 'avocado',
  'lemon', 'lime', 'ginger', 'herbs', 'basil', 'cilantro', 'parsley', 'green',
  'salad', 'veg', 'vegetable'
];

const proteinKeywords = [
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'prawn',
  'egg', 'eggs', 'tofu', 'tempeh', 'seitan', 'lentils', 'chickpeas', 'beans',
  'turkey', 'lamb', 'duck', 'bacon', 'sausage', 'ham', 'meat', 'protein'
];

const dairyKeywords = [
  'milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'sour cream',
  'mozzarella', 'cheddar', 'parmesan', 'feta', 'ricotta', 'cream cheese',
  'milk', 'dairy', 'greek yogurt'
];

const grainKeywords = [
  'rice', 'pasta', 'noodle', 'bread', 'flour', 'oats', 'quinoa', 'couscous',
  'barley', 'wheat', 'cereal', 'grain', 'tortilla', 'pita', 'bagel', 'toast'
];

export function useIngredientCategorizer() {
  const categorizeIngredient = useCallback((name: string): Ingredient['category'] => {
    const lowerName = name.toLowerCase();
    
    if (veggieKeywords.some(k => lowerName.includes(k))) return 'veggie';
    if (proteinKeywords.some(k => lowerName.includes(k))) return 'protein';
    if (dairyKeywords.some(k => lowerName.includes(k))) return 'dairy';
    if (grainKeywords.some(k => lowerName.includes(k))) return 'grain';
    
    return 'other';
  }, []);

  const getCategoryColor = useCallback((category: Ingredient['category']): string => {
    switch (category) {
      case 'veggie': return 'bg-veggie/20 text-veggie border-veggie/30';
      case 'protein': return 'bg-protein/20 text-protein border-protein/30';
      case 'dairy': return 'bg-dairy/20 text-dairy border-dairy/30';
      case 'grain': return 'bg-amber-400/20 text-amber-400 border-amber-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }, []);

  const suggestPairings = useCallback((ingredients: Ingredient[]): string[] => {
    const categories = ingredients.map(i => i.category);
    const suggestions: string[] = [];
    
    if (!categories.includes('protein')) {
      suggestions.push('Try adding eggs or tofu');
    }
    if (!categories.includes('veggie')) {
      suggestions.push('How about some fresh greens?');
    }
    if (!categories.includes('grain')) {
      suggestions.push('Rice or pasta would complete this');
    }
    if (!categories.includes('dairy')) {
      suggestions.push('Cheese could add richness');
    }
    
    return suggestions.slice(0, 2);
  }, []);

  return {
    categorizeIngredient,
    getCategoryColor,
    suggestPairings,
  };
}
