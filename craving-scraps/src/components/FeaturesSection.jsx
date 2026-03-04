import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    icon: '🧅',
    title: 'Drop Your Ingredients',
    body: 'Tell us what\'s in your fridge. 3 to 5 ingredients is all it takes to get started.',
  },
  {
    icon: '🌶️',
    title: 'Pick Your Vibe',
    body: 'Comforting. Spicy & Fast. Brain Food. Choose a mood and let the recipe follow.',
  },
  {
    icon: '🍕',
    title: 'Get Your Recipe',
    body: 'A clean, customized recipe built around you — not a grocery list you\'ll never use.',
  },
];

export default function FeaturesSection() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'visible');
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.18 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="features-section" id="how-it-works" aria-label="How It Works">
      <div className="features-inner">
        <div className="features-header">
          <span className="section-overline">How It Works</span>
          <h2 className="features-headline">Three steps. One perfect meal.</h2>
        </div>

        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="feature-card reveal"
            ref={(el) => (cardRefs.current[i] = el)}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
