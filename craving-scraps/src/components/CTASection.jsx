import { useEffect, useRef } from 'react';

export default function CTASection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="cta-section"
      id="cta-section"
      ref={sectionRef}
      aria-label="Call to action"
    >
      <div className="cta-inner">
        <span className="cta-subheader reveal">Ready to cook?</span>
        <h2 className="cta-headline reveal reveal-delay-1">
          Turn what you have into something worth eating.
        </h2>
        <p className="cta-body reveal reveal-delay-1">
          On the next page, drop in your ingredients, choose a vibe, and our AI generates 
          a clean, step-by-step recipe in seconds. No grocery run. No guesswork.
        </p>
        <ul className="cta-bullets reveal reveal-delay-1">
          <li>Input 3–5 ingredients you already own</li>
          <li>Select a craving vibe: Comforting, Spicy, Brain Food &amp; more</li>
          <li>Receive a formatted, easy-to-follow recipe instantly</li>
          <li>Powered by LLM for smart, adaptive suggestions</li>
        </ul>
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn reveal reveal-delay-2"
          id="cta-view-app-btn"
          aria-label="View the recipe app"
        >
          View App
        </a>
      </div>
    </section>
  );
}
