import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Ingredient, Recipe, SavedRecipe } from '@/types';

interface AppState {
  ingredients: Ingredient[];
  selectedVibe: string | null;
  constraints: string[];
  currentRecipe: Recipe | null;
  isGenerating: boolean;
  savedRecipes: SavedRecipe[];
  cookingStreak: number;
  lastCookDate: string | null;
  showHistory: boolean;
}

type AppAction =
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'SET_VIBE'; payload: string | null }
  | { type: 'TOGGLE_CONSTRAINT'; payload: string }
  | { type: 'SET_RECIPE'; payload: Recipe | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SAVE_RECIPE'; payload: SavedRecipe }
  | { type: 'DELETE_SAVED_RECIPE'; payload: string }
  | { type: 'RATE_RECIPE'; payload: { id: string; rating: number } }
  | { type: 'UPDATE_STREAK' }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'CLEAR_INGREDIENTS' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const initialState: AppState = {
  ingredients: [],
  selectedVibe: null,
  constraints: [],
  currentRecipe: null,
  isGenerating: false,
  savedRecipes: [],
  cookingStreak: 0,
  lastCookDate: null,
  showHistory: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_INGREDIENT':
      if (state.ingredients.length >= 8) return state;
      if (state.ingredients.some(i => i.name.toLowerCase() === action.payload.name.toLowerCase())) return state;
      return { ...state, ingredients: [...state.ingredients, action.payload] };
    
    case 'REMOVE_INGREDIENT':
      return { ...state, ingredients: state.ingredients.filter(i => i.id !== action.payload) };
    
    case 'SET_VIBE':
      return { ...state, selectedVibe: action.payload };
    
    case 'TOGGLE_CONSTRAINT':
      const exists = state.constraints.includes(action.payload);
      if (exists) {
        return { ...state, constraints: state.constraints.filter(c => c !== action.payload) };
      }
      return { ...state, constraints: [...state.constraints, action.payload] };
    
    case 'SET_RECIPE':
      return { ...state, currentRecipe: action.payload };
    
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    
    case 'SAVE_RECIPE':
      if (state.savedRecipes.some(r => r.id === action.payload.id)) return state;
      return { ...state, savedRecipes: [action.payload, ...state.savedRecipes.slice(0, 19)] };
    
    case 'DELETE_SAVED_RECIPE':
      return { ...state, savedRecipes: state.savedRecipes.filter(r => r.id !== action.payload) };
    
    case 'RATE_RECIPE':
      return {
        ...state,
        savedRecipes: state.savedRecipes.map(r =>
          r.id === action.payload.id ? { ...r, rating: action.payload.rating } : r
        ),
      };
    
    case 'UPDATE_STREAK':
      const today = new Date().toDateString();
      const lastDate = state.lastCookDate;
      
      if (lastDate === today) return state;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (lastDate === yesterday.toDateString()) {
        newStreak = state.cookingStreak + 1;
      }
      
      return { ...state, cookingStreak: newStreak, lastCookDate: today };
    
    case 'TOGGLE_HISTORY':
      return { ...state, showHistory: !state.showHistory };
    
    case 'CLEAR_INGREDIENTS':
      return { ...state, ingredients: [] };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addIngredient: (name: string, category: Ingredient['category']) => void;
  removeIngredient: (id: string) => void;
  setVibe: (vibe: string | null) => void;
  toggleConstraint: (constraint: string) => void;
  setRecipe: (recipe: Recipe | null) => void;
  setGenerating: (generating: boolean) => void;
  saveRecipe: (recipe: Recipe, ingredients: string[], vibe: string) => void;
  deleteSavedRecipe: (id: string) => void;
  rateRecipe: (id: string, rating: number) => void;
  updateStreak: () => void;
  toggleHistory: () => void;
  clearIngredients: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('cravings-and-scraps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    const { showHistory, isGenerating, ...stateToSave } = state;
    localStorage.setItem('cravings-and-scraps', JSON.stringify(stateToSave));
  }, [state]);

  const addIngredient = (name: string, category: Ingredient['category']) => {
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
    };
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  };

  const removeIngredient = (id: string) => {
    dispatch({ type: 'REMOVE_INGREDIENT', payload: id });
  };

  const setVibe = (vibe: string | null) => {
    dispatch({ type: 'SET_VIBE', payload: vibe });
  };

  const toggleConstraint = (constraint: string) => {
    dispatch({ type: 'TOGGLE_CONSTRAINT', payload: constraint });
  };

  const setRecipe = (recipe: Recipe | null) => {
    dispatch({ type: 'SET_RECIPE', payload: recipe });
  };

  const setGenerating = (generating: boolean) => {
    dispatch({ type: 'SET_GENERATING', payload: generating });
  };

  const saveRecipe = (recipe: Recipe, ingredients: string[], vibe: string) => {
    const savedRecipe: SavedRecipe = {
      id: Date.now().toString(),
      recipe,
      ingredients,
      vibe,
      timestamp: Date.now(),
    };
    dispatch({ type: 'SAVE_RECIPE', payload: savedRecipe });
    dispatch({ type: 'UPDATE_STREAK' });
  };

  const deleteSavedRecipe = (id: string) => {
    dispatch({ type: 'DELETE_SAVED_RECIPE', payload: id });
  };

  const rateRecipe = (id: string, rating: number) => {
    dispatch({ type: 'RATE_RECIPE', payload: { id, rating } });
  };

  const updateStreak = () => {
    dispatch({ type: 'UPDATE_STREAK' });
  };

  const toggleHistory = () => {
    dispatch({ type: 'TOGGLE_HISTORY' });
  };

  const clearIngredients = () => {
    dispatch({ type: 'CLEAR_INGREDIENTS' });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addIngredient,
        removeIngredient,
        setVibe,
        toggleConstraint,
        setRecipe,
        setGenerating,
        saveRecipe,
        deleteSavedRecipe,
        rateRecipe,
        updateStreak,
        toggleHistory,
        clearIngredients,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
