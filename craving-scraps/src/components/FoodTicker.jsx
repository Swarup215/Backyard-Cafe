import { useEffect, useRef } from 'react';

// Food images copied into public/ for reliable Vite serving
const FOOD_IMAGES = [
  { src: '/cafe-dish-1.jpg',  alt: 'Delicious street food at Backyard Café' },
  { src: '/cafe-dish-2.webp', alt: 'Buffalo chicken burger at Backyard Café' },
  { src: '/cafe-dish-3.jpg',  alt: 'Gourmet dish at Backyard Café' },
  { src: '/cafe-dish-4.avif', alt: 'Penne pasta with tomato sauce at Backyard Café' },
];

// Quadruple for a seamless infinite marquee loop
const TICKER_ITEMS = [
  ...FOOD_IMAGES,
  ...FOOD_IMAGES,
  ...FOOD_IMAGES,
  ...FOOD_IMAGES,
];

export default function FoodTicker() {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imageRefs.current.forEach((img, i) => {
              if (img) {
                setTimeout(() => {
                  img.classList.add('revealed');
                }, i * 55);
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="ticker-section"
      className="ticker-section"
      ref={sectionRef}
      aria-label="Food gallery"
    >
      <span className="ticker-label">A taste of what awaits you</span>

      <div className="ticker-track" aria-hidden="true">
        {TICKER_ITEMS.map((item, i) => (
          <img
            key={i}
            src={item.src}
            alt={item.alt}
            className="ticker-image"
            ref={(el) => (imageRefs.current[i] = el)}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
