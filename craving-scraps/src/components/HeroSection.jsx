import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 160;
const FRAME_REVEAL_THRESHOLD = 0.28; // Show wordmark after 28% scroll through hero

// Frame paths served from public/pizzavibeathon/
const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return `/pizzavibeathon/ezgif-frame-${num}.jpg`;
});

export default function HeroSection() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const sectionRef = useRef(null);

  const [wordmarkRevealed, setWordmarkRevealed] = useState(false);
  const [subtitleRevealed, setSubtitleRevealed] = useState(false);

  const wordmark = 'Craving & Scraps'.split('');

  // Draw a specific frame to canvas using object-fit: cover logic
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let drawW, drawH, drawX, drawY;
    if (imgRatio > canvasRatio) {
      // Image is wider — fit by height
      drawH = ch;
      drawW = ch * imgRatio;
      drawX = (cw - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller — fit by width
      drawW = cw;
      drawH = cw / imgRatio;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas to viewport size and redraw current frame
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ── Preload all frames ──────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = framePaths.map((src, i) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCountRef.current += 1;
        // Draw frame 0 as soon as it is ready so canvas isn't blank
        if (i === 0) {
          resizeCanvas();
        }
      };

      img.onerror = () => {
        loadedCountRef.current += 1;
      };

      return img;
    });
  }, [resizeCanvas]);

  // ── Resize listener ─────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ── Scroll → Frame scrubbing ────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      // hero-scroll-spacer is 500vh; scrollable portion = totalHeight - viewport
      const scrollableHeight = section.scrollHeight - window.innerHeight;
      const scrollY = Math.max(0, window.scrollY);
      const progress = Math.min(scrollY / scrollableHeight, 1);

      // Map progress to frame index
      const targetFrame = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      // Text reveal: appears at 28% scroll progress
      if (progress >= FRAME_REVEAL_THRESHOLD) {
        setWordmarkRevealed(true);
        setSubtitleRevealed(true);
      } else {
        setWordmarkRevealed(false);
        setSubtitleRevealed(false);
      }

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initialise on mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  return (
    <section
      className="hero-scroll-spacer"
      ref={sectionRef}
      aria-label="Hero — Craving &amp; Scraps"
    >
      <div className="hero-sticky">
        {/* Canvas for frame-by-frame video playback */}
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

        {/* Cinematic dark gradient overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Text layer */}
        <div className="hero-text">
          <h1 className="hero-wordmark" aria-label="Craving &amp; Scraps">
            {wordmark.map((letter, i) => (
              <span
                key={i}
                className={`hero-letter${wordmarkRevealed ? ' revealed' : ''}`}
                style={{
                  transitionDelay: wordmarkRevealed ? `${i * 0.048}s` : '0s',
                  whiteSpace: letter === ' ' ? 'pre' : 'normal',
                }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <p className={`hero-subtitle${subtitleRevealed ? ' revealed' : ''}`}>
            Your fridge.&nbsp;&nbsp;Your craving.&nbsp;&nbsp;Your recipe.
          </p>
        </div>
      </div>
    </section>
  );
}
