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
      aria-label="Visit Us"
    >
      <div className="cta-inner">
        <span className="cta-subheader reveal">Come say hello</span>
        <h2 className="cta-headline reveal reveal-delay-1">
          Visit us at Backyard Café.
        </h2>
        <p className="cta-body reveal reveal-delay-1">
          We're conveniently located in Sainikpuri, Secunderabad. Walk in, sit back, and let 
          us take care of the rest. Or order online through Swiggy or Zomato — we deliver too!
        </p>

        <ul className="cta-bullets reveal reveal-delay-1">
          <li>📍 Plot 24, SriKrish Enclave, Shaili Gardens Main Rd, Sainikpuri, Secunderabad 500087</li>
          <li>📞 093903 27845</li>
          <li>⭐ 4.1 / 5 based on 761 reviews</li>
          <li>⏰ Open today · Closes at 11:00 PM</li>
          <li>💰 Price range: ₹200 – ₹600</li>
        </ul>

        <div className="cta-actions reveal reveal-delay-2">
          <a
            href="tel:+919390327845"
            className="cta-btn"
            id="cta-call-btn"
            aria-label="Call Backyard Café"
          >
            📞 Call Now
          </a>
          <a
            href="https://www.swiggy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-outline"
            id="cta-swiggy-btn"
            aria-label="Order on Swiggy"
          >
            Order on Swiggy
          </a>
          <a
            href="https://www.zomato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-outline"
            id="cta-zomato-btn"
            aria-label="Order on Zomato"
          >
            Order on Zomato
          </a>
        </div>
      </div>
    </section>
  );
}
