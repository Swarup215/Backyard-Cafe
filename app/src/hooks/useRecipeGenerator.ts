import { useState, useCallback } from 'react';
import type { Recipe, Ingredient } from '@/types';

interface UseRecipeGeneratorReturn {
  generateRecipe: (ingredients: Ingredient[], vibe: string, constraints: string[]) => Promise<Recipe>;
  isLoading: boolean;
  error: string | null;
  regenerate: () => Promise<Recipe | null>;
  refine: (modification: string) => Promise<Recipe | null>;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_MODEL = (import.meta.env.VITE_GROQ_MODEL as string) || 'openai/gpt-oss-120b';

function buildPrompt(ingredients: Ingredient[], vibe: string, constraints: string[]): string {
  const ingredientList = ingredients.map(i => `${i.name} (${i.category})`).join(', ');

  const vibeDescriptions: Record<string, string> = {
    comfort: 'warm, cozy, and comforting',
    spicy: 'bold, spicy, and fiery',
    fresh: 'fresh, light, and garden-inspired',
    brain: 'brain-boosting and focused, nutrient-dense',
    gains: 'high-protein, muscle-building',
    clean: 'clean, simple, and healthy reset',
    impress: 'impressive, date-night worthy and elegant',
    midnight: 'late-night quick munchies',
    everything: 'fridge clean-out, uses everything available',
  };

  const constraintDescriptions: Record<string, string> = {
    vegan: 'vegan (no animal products)',
    vegetarian: 'vegetarian (no meat)',
    glutenfree: 'gluten-free',
    dairyfree: 'dairy-free',
    under10: 'ready in under 10 minutes',
    under30: 'ready in under 30 minutes',
    beginner: 'beginner-friendly (easy skill level)',
    chef: 'chef-level technique allowed',
    onepot: 'one pot / one pan only',
    nooven: 'no oven required',
  };

  const constraintText = constraints.length > 0
    ? constraints.map(c => constraintDescriptions[c] || c).join(', ')
    : 'none';

  const vibeText = vibeDescriptions[vibe] || vibe;

  return `You are a creative chef assistant. Generate a recipe based on the following:

Ingredients available: ${ingredientList || 'any common pantry ingredients'}
Vibe/mood: ${vibeText}
Constraints: ${constraintText}

Respond ONLY with a valid JSON object (no markdown, no explanation) matching this exact TypeScript interface:

{
  "title": string,
  "vibe_match": string,       // 1-2 sentence flavor description matching the vibe
  "prep_time": string,        // e.g. "20 mins"
  "difficulty": "Easy" | "Medium" | "Hard",
  "servings": number,
  "ingredients": [
    { "item": string, "amount": string, "have": boolean }
  ],
  "steps": [
    { "step": number, "instruction": string, "tip": string }
  ],
  "nutrition_estimate": {
    "calories": number,
    "protein": string,   // e.g. "22g"
    "carbs": string,     // e.g. "45g"
    "fat": string        // e.g. "18g"
  },
  "vibe_tags": string[],           // 3-4 hashtags e.g. ["#comfort", "#cravingsandscraps"]
  "upgrade_suggestions": string[], // 2-3 optional add-ons to elevate the dish
  "pair_with": string              // drink or side suggestion
}

Set "have" to true for ingredients the user already has (from the list above), false for anything extra needed.
Make the recipe creative, delicious, and perfectly matching the vibe and constraints.`;
}

async function callGroq(prompt: string): Promise<Recipe> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: 'medium',
      stream: true,
      stop: null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  // Read the SSE stream and accumulate content chunks
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) accumulated += delta;
      } catch {
        // ignore malformed SSE lines
      }
    }
  }

  // Strip markdown code fences if present
  const cleaned = accumulated
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/m, '')
    .trim();

  let recipe: Recipe;
  try {
    recipe = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse recipe JSON from model response: ${cleaned.slice(0, 300)}`);
  }

  return recipe;
}

export function useRecipeGenerator(): UseRecipeGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<{ ingredients: Ingredient[]; vibe: string; constraints: string[] } | null>(null);
  const [lastRecipe, setLastRecipe] = useState<Recipe | null>(null);

  const generateRecipe = useCallback(async (
    ingredients: Ingredient[],
    vibe: string,
    constraints: string[]
  ): Promise<Recipe> => {
    setIsLoading(true);
    setError(null);
    setLastParams({ ingredients, vibe, constraints });

    try {
      const prompt = buildPrompt(ingredients, vibe, constraints);
      const recipe = await callGroq(prompt);
      setLastRecipe(recipe);
      setIsLoading(false);
      return recipe;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate recipe';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const regenerate = useCallback(async (): Promise<Recipe | null> => {
    if (!lastParams) return null;
    return generateRecipe(lastParams.ingredients, lastParams.vibe, lastParams.constraints);
  }, [lastParams, generateRecipe]);

  const refine = useCallback(async (modification: string): Promise<Recipe | null> => {
    if (!lastParams || !lastRecipe) return null;

    setIsLoading(true);
    setError(null);

    try {
      const basePrompt = buildPrompt(lastParams.ingredients, lastParams.vibe, lastParams.constraints);
      const refinePrompt = `${basePrompt}

Additionally, the user wants the following modification applied to the recipe:
"${modification}"

Incorporate this change naturally while keeping the recipe delicious and coherent.`;

      const refined = await callGroq(refinePrompt);
      setLastRecipe(refined);
      setIsLoading(false);
      return refined;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refine recipe';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, [lastParams, lastRecipe]);

  return {
    generateRecipe,
    isLoading,
    error,
    regenerate,
    refine,
  };
}
