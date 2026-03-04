import { motion } from 'framer-motion';
import { Leaf, Wheat, Milk, Ban, ChefHat, Timer, Zap, Clock } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface ConstraintGroup {
  category: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const constraintGroups: ConstraintGroup[] = [
  {
    category: 'Dietary',
    items: [
      { id: 'vegan', label: 'Vegan', icon: Leaf },
      { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
      { id: 'gluten-free', label: 'Gluten-Free', icon: Wheat },
      { id: 'dairy-free', label: 'Dairy-Free', icon: Milk },
      { id: 'halal', label: 'Halal', icon: Ban },
    ],
  },
  {
    category: 'Skill Level',
    items: [
      { id: 'beginner', label: 'Beginner', icon: ChefHat },
      { id: 'intermediate', label: 'Intermediate', icon: ChefHat },
      { id: 'chef', label: 'Chef Mode', icon: ChefHat },
    ],
  },
  {
    category: 'Time',
    items: [
      { id: 'under10', label: 'Under 10min', icon: Zap },
      { id: 'under30', label: 'Under 30min', icon: Timer },
      { id: 'ihavetime', label: 'I have time', icon: Clock },
    ],
  },
];

export function ConstraintToggles() {
  const { state, toggleConstraint } = useApp();

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-heading font-bold text-white mb-2">
          Any preferences?
        </h3>
        <p className="text-white/60 text-sm">
          Select what matters to you—we'll tailor the recipe.
        </p>
      </motion.div>

      <div className="space-y-5">
        {constraintGroups.map((group, groupIndex) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3">
              {group.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item, itemIndex) => {
                const isSelected = state.constraints.includes(item.id);
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: groupIndex * 0.1 + itemIndex * 0.05 }}
                    onClick={() => toggleConstraint(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-lime text-black'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-white/50'}`} />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
