export interface Ingredient {
  id: string;
  name: string;
  category: 'veggie' | 'protein' | 'dairy' | 'grain' | 'other';
}

export interface Vibe {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface Constraint {
  id: string;
  label: string;
  category: 'dietary' | 'skill' | 'time';
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  have: boolean;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  tip?: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat?: string;
}

export interface Recipe {
  title: string;
  vibe_match: string;
  prep_time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition_estimate: Nutrition;
  vibe_tags: string[];
  upgrade_suggestions: string[];
  pair_with: string;
}

export interface SavedRecipe {
  id: string;
  recipe: Recipe;
  ingredients: string[];
  vibe: string;
  timestamp: number;
  rating?: number;
}

export interface AppState {
  ingredients: Ingredient[];
  selectedVibe: string | null;
  constraints: string[];
  currentRecipe: Recipe | null;
  isGenerating: boolean;
  savedRecipes: SavedRecipe[];
  cookingStreak: number;
}
