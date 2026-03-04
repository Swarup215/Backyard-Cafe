import { useEffect, useState } from 'react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <span className="nav-logo">C&amp;S</span>
      <ul className="nav-links">
        <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a></li>
        <li><a href="#ingredients" onClick={(e) => { e.preventDefault(); scrollTo('ticker-section'); }}>Ingredients</a></li>
        <li><a href="#app" onClick={(e) => { e.preventDefault(); scrollTo('cta-section'); }}>Make a Recipe</a></li>
      </ul>
    </nav>
  );
}
