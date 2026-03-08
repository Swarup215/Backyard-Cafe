import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    icon: '⭐',
    title: '4.1 / 5 Rating',
    body: 'Loved by 761+ guests. We take pride in delivering an experience worth coming back for — every single visit.',
  },
  {
    icon: '🕐',
    title: 'Open Until 11 PM',
    body: 'Whether it\'s a morning coffee or a late-night meal, we\'re open and ready. Come in any time of day.',
  },
  {
    icon: '💰',
    title: '₹200 – ₹600 Range',
    body: 'Neighbourhood café prices, restaurant-quality food. Enjoy great meals without breaking the bank.',
  },
  {
    icon: '🛵',
    title: 'Delivery Available',
    body: 'Order from the comfort of your home through Swiggy or Zomato and get our delicious food delivered fresh.',
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
    <section className="features-section" id="highlights" aria-label="Why Visit Us">
      <div className="features-inner">
        <div className="features-header">
          <span className="section-overline">Why Backyard Café</span>
          <h2 className="features-headline">What makes us special.</h2>
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
