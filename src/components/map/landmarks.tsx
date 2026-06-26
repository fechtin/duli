import type { ReactElement } from "react";
import type { DestinationType } from "@/lib/types";

// Flat illustrated landmarks (Bible 002 §9 — a unified illustration language instead of pins).
// Small, 2–3 tone, recognizable; drawn in a 24×24 box, sized by the marker.

type LandmarkProps = { className?: string };
const box = "0 0 24 24";

function Pagoda({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M12 2 4.5 6.5h15z" fill="#b9842a" />
      <path d="M12 6 6 9.5h12z" fill="#c79341" />
      <path d="M12 10 7 13h10z" fill="#b9842a" />
      <rect x="9.5" y="13" width="5" height="7" rx="0.5" fill="#7a5b2e" />
      <rect x="11" y="15" width="2" height="5" fill="#3a2c18" />
      <rect x="6" y="20" width="12" height="2" rx="1" fill="#7a5b2e" />
    </svg>
  );
}

function Mountain({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M2 20 9 7l4 6 3-4 6 11z" fill="#4f7b6a" />
      <path d="M9 7l2.2 3.3L9.5 12 8 10.4 6.8 12z" fill="#fff" />
      <path d="M16 9l1.6 2.9-1.5.9-1-1.2-1 1z" fill="#fff" opacity="0.9" />
    </svg>
  );
}

function JunkBoat({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M11 4l6 8h-6z" fill="#d8604f" />
      <path d="M10 6 5 12h5z" fill="#e08a5b" />
      <rect x="10" y="3" width="1" height="10" fill="#7a5b2e" />
      <path d="M3 14h18l-2 4a3 3 0 0 1-2.6 1.6H7.6A3 3 0 0 1 5 18z" fill="#7a5b2e" />
      <path d="M3 14h18l-.6 1.2H3.6z" fill="#5b431f" />
    </svg>
  );
}

function Lighthouse({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M9 9h6l1.2 11H7.8z" fill="#eef0e8" />
      <path d="M9.3 12h5.4l.3 2.5H9z" fill="#d8604f" />
      <path d="M9.7 16h4.6l.3 2.5H9.4z" fill="#d8604f" />
      <rect x="9" y="6.5" width="6" height="2.5" rx="0.5" fill="#7a5b2e" />
      <path d="M10 3h4l.6 3.5H9.4z" fill="#d9ad55" />
      <circle cx="12" cy="2.5" r="1.2" fill="#ffe08a" />
    </svg>
  );
}

function Terraces({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M2 21q5-2 10-2t10 2v1H2z" fill="#6e8c5a" />
      <path d="M3 17q4-1.6 9-1.6t9 1.6" fill="none" stroke="#c79341" strokeWidth="1.6" />
      <path d="M4 13q4-1.4 8-1.4t8 1.4" fill="none" stroke="#9bb06a" strokeWidth="1.6" />
      <path d="M5 9.5q3.5-1.2 7-1.2t7 1.2" fill="none" stroke="#c79341" strokeWidth="1.4" />
      <path d="M7 6.5q2.6-1 5-1t5 1" fill="none" stroke="#9bb06a" strokeWidth="1.2" />
    </svg>
  );
}

function Skyscraper({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <rect x="4" y="10" width="5" height="11" rx="0.5" fill="#5a8aa6" />
      <rect x="9.5" y="4" width="5.5" height="17" rx="0.5" fill="#246c88" />
      <rect x="15.5" y="8" width="4.5" height="13" rx="0.5" fill="#5a8aa6" />
      <g fill="#cfe4ee">
        <rect x="11" y="6" width="1" height="1" /><rect x="13" y="6" width="1" height="1" />
        <rect x="11" y="9" width="1" height="1" /><rect x="13" y="9" width="1" height="1" />
        <rect x="11" y="12" width="1" height="1" /><rect x="13" y="12" width="1" height="1" />
      </g>
    </svg>
  );
}

function Lantern({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <rect x="10.5" y="2" width="3" height="2" rx="0.5" fill="#7a5b2e" />
      <path d="M12 4c4 0 5 3 5 7s-1 7-5 7-5-3-5-7 1-7 5-7z" fill="#d8604f" />
      <path d="M12 4c1.6 0 2 3 2 7s-.4 7-2 7" fill="#e0795f" opacity="0.6" />
      <rect x="9.5" y="3.5" width="5" height="1.5" rx="0.7" fill="#d9ad55" />
      <rect x="9.5" y="17.5" width="5" height="1.5" rx="0.7" fill="#d9ad55" />
      <path d="M12 19v3" stroke="#d9ad55" strokeWidth="1" />
    </svg>
  );
}

function Waterfall({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <path d="M5 3h6v18H5z" fill="#4f7b6a" />
      <path d="M13 3h6v18h-6z" fill="#5b8a78" />
      <g stroke="#9cd0d4" strokeWidth="1.4" fill="none" opacity="0.95">
        <path d="M11.6 4v13" /><path d="M13 4v13" /><path d="M12.3 4v13" />
      </g>
      <ellipse cx="12" cy="20" rx="6" ry="1.6" fill="#3e92a8" />
    </svg>
  );
}

function Market({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <rect x="6" y="12" width="12" height="9" rx="0.5" fill="#c79341" />
      <path d="M4 12l2-5h12l2 5z" fill="#d8604f" />
      <path d="M4 12l1.6-5H8l-.6 5zM10 12l.4-5h3.2l.4 5zM16 12l-.6-5H18l1.6 5z" fill="#eef0e8" />
      <rect x="10.5" y="15" width="3" height="6" fill="#7a5b2e" />
    </svg>
  );
}

function Beach({ className }: LandmarkProps) {
  return (
    <svg viewBox={box} className={className} aria-hidden>
      <circle cx="8" cy="8" r="3.2" fill="#d9ad55" />
      <g stroke="#d9ad55" strokeWidth="1.2"><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M4 4l1 1M11 11l1 1M12 4l-1 1M5 11l-1 1" /></g>
      <path d="M2 18q5-2 10-2t10 2v3H2z" fill="#3e92a8" />
      <path d="M2 18q5-2 10-2t10 2" fill="none" stroke="#cfe4ee" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

const map: Record<DestinationType, (p: LandmarkProps) => ReactElement> = {
  temple: Pagoda,
  museum: Pagoda,
  mountain: Mountain,
  park: Terraces,
  waterfall: Waterfall,
  cave: Mountain,
  unesco: JunkBoat,
  island: Lighthouse,
  beach: Beach,
  lake: Beach,
  city: Skyscraper,
  village: Lantern,
  market: Market,
  bridge: Lantern,
};

export function Landmark({ type, className }: { type: DestinationType; className?: string }) {
  const Comp = map[type] ?? Pagoda;
  return <Comp className={className} />;
}
