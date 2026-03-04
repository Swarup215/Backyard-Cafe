import { useEffect, useRef } from 'react';

// Food images — served via Vite's /@fs/ path (parent dir allowed in vite.config.js)
// The user's images live one level up from craving-scraps/
const BASE = '/@fs/C:/Users/Sudhit Reddy/Downloads/Vibethon-1';

const FOOD_IMAGES = [
  {
    src: `${BASE}/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.avif`,
    alt: 'Penne pasta with tomato sauce and chicken',
  },
  {
    src: `${BASE}/f89ef932-d2af-4429-8b55-1da75b881020.jpg`,
    alt: 'Delicious street food dish',
  },
  {
    src: `${BASE}/Hikaru+Funnell+Photography+-+Food+Photography+-+Buffalo+Chicken+Burger+-+02-04-24+-+3.webp`,
    alt: 'Buffalo chicken burger',
  },
  {
    src: `${BASE}/media_10dd8c1b8f98b4626e80bd76fd958cd0b0507a399.jpg`,
    alt: 'Gourmet food photography',
  },
];

// Quadruple the array for a smooth seamless marquee loop
const TICKER_ITEMS = [...FOOD_IMAGES, ...FOOD_IMAGES, ...FOOD_IMAGES, ...FOOD_IMAGES];

export default function FoodTicker() {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger each image reveal with 55ms increment
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
      <span className="ticker-label">Made for these moments</span>

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
