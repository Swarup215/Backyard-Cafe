import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Sparkles, ChefHat } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Add ingredients',
    description: "Type what's in your fridge. No perfect pantry required.",
    image: '/howto_ingredients.jpg',
    color: 'from-lime/20 to-lime/5',
  },
  {
    icon: Sparkles,
    title: 'Choose a vibe',
    description: 'Comfort, spicy, fresh, or whatever you\'re feeling.',
    image: '/howto_vibe.jpg',
    color: 'from-violet/20 to-violet/5',
  },
  {
    icon: ChefHat,
    title: 'Get a recipe',
    description: 'AI builds steps, swaps, and a nutrition snapshot.',
    image: '/howto_recipe.jpg',
    color: 'from-amber/20 to-amber/5',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-flowing py-24 z-50"
      style={{ backgroundColor: '#6B62B8' }}
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            Three simple steps to turn your fridge into a gourmet experience.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40, rotate: index === 0 ? -2 : index === 2 ? 2 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -10, rotate: 0 }}
                className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${step.color} border border-white/10 p-6`}
              >
                {/* Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/70">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8"
        >
          {[
            { value: '10K+', label: 'Recipes Generated' },
            { value: '50K+', label: 'Happy Students' },
            { value: '4.9', label: 'Average Rating' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-heading font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
