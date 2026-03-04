import { useEffect, useRef } from 'react';

export default function ProblemSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="problem-section" id="problem" ref={sectionRef} aria-label="The Problem">
      <span className="section-overline reveal">The Problem</span>
      <h2 className="problem-headline reveal reveal-delay-1">
        A fridge full of ingredients. Zero ideas.
      </h2>
      <p className="problem-body reveal reveal-delay-2">
        Every recipe app assumes you already know what you want to cook.
        They hand you a grocery list and call it inspiration. 
        Craving &amp; Scraps starts where you actually are — with what's already in your kitchen 
        and the specific mood you're in right now.
      </p>
    </section>
  );
}
