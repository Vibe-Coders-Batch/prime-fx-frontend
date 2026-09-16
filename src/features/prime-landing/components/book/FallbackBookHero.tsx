"use client";

export function FallbackBookHero() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <style>{`
        @keyframes book-breathe { 0%,100%{transform:scale(1) rotateY(-8deg)} 50%{transform:scale(1.015) rotateY(-6deg)} }
        .book-fallback-wrap { perspective: 900px; }
        .book-fallback {
          width: clamp(140px, 22vmin, 240px);
          aspect-ratio: 0.72;
          background: linear-gradient(135deg, #0d1f3c 0%, #0b192f 60%, #141e2d 100%);
          border-radius: 4px 10px 10px 4px;
          box-shadow:
            -6px 0 0 #0a1729,
            0 24px 80px rgba(0,0,0,0.7),
            0 0 0 1px rgba(224,180,88,0.18),
            inset 1px 0 0 rgba(224,180,88,0.12);
          animation: book-breathe 5s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .book-fallback::before {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(224,180,88,0.22);
          border-radius: 2px;
        }
        .book-fallback::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 40%; height: 2px;
          background: rgba(224,180,88,0.35);
          box-shadow: 0 -12px 0 rgba(224,180,88,0.2), 0 12px 0 rgba(224,180,88,0.2);
        }
      `}</style>
      <div className="book-fallback-wrap">
        <div className="book-fallback" />
      </div>
    </div>
  );
}
