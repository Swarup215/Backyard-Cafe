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
    <section className="problem-section" id="about" ref={sectionRef} aria-label="About Backyard Café">
      <span className="section-overline reveal">Our Story</span>
      <h2 className="problem-headline reveal reveal-delay-1">
        A backyard vibe, in the heart of Sainikpuri.
      </h2>
      <p className="problem-body reveal reveal-delay-2">
        Backyard Café is Secunderabad's cozy neighbourhood café where great food meets a relaxed, 
        welcoming atmosphere. Whether you're stopping in for a quick bite or a long leisurely meal, 
        we serve handcrafted dishes made with fresh ingredients — all priced for everyday indulgence. 
        With over 761 happy reviews and a 4.1-star rating, we're the go-to spot for food lovers in Sainikpuri.
      </p>
    </section>
  );
}
