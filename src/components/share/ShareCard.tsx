import { forwardRef } from "react";
import type { AwardedBadge, Checkin } from "@/lib/types";

interface Props {
  provincesVisited: number;
  visitedRegions: number;
  checkins: Checkin[];
  badges: AwardedBadge[];
  total?: number;
}

// Vietnam outline path — normalized to ~100×250 coordinate space
const VN_PATH =
  "M50,5 C65,8 75,25 75,45 C76,62 64,73 62,87 C60,100 66,112 76,122 C85,131 84,150 78,165 C72,181 70,198 72,212 C74,226 68,240 60,249 L57,244 C51,233 52,219 55,206 C58,194 58,181 56,169 C54,157 55,143 58,130 C61,117 62,104 59,91 C56,78 50,66 49,53 C47,40 43,23 50,10 Z";

// Compass rose
function CompassRose({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <circle cx={x} cy={y} r={r * 0.6} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />
      <polygon points={`${x},${y - r * 0.88} ${x - 5},${y} ${x + 5},${y}`} fill="rgba(255,255,255,0.8)" />
      <polygon points={`${x},${y + r * 0.88} ${x - 5},${y} ${x + 5},${y}`} fill="rgba(255,255,255,0.35)" />
      <polygon points={`${x - r * 0.88},${y} ${x},${y - 5} ${x},${y + 5}`} fill="rgba(255,255,255,0.35)" />
      <polygon points={`${x + r * 0.88},${y} ${x},${y - 5} ${x},${y + 5}`} fill="rgba(255,255,255,0.35)" />
      <circle cx={x} cy={y} r={4} fill="rgba(255,255,255,0.7)" />
    </>
  );
}

// Badge circle for the share card
function BadgeCircle({ cx, cy, badge }: { cx: number; cy: number; badge: AwardedBadge }) {
  return (
    <g>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={32} fill="#0a2028" stroke="#d4a84b" strokeWidth="2" />
      {/* Inner glow ring */}
      <circle cx={cx} cy={cy} r={28} fill="none" stroke="rgba(212,168,75,0.25)" strokeWidth="1" />
      {/* Emoji */}
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="24" fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
        {badge.emoji}
      </text>
    </g>
  );
}

export const ShareCard = forwardRef<SVGSVGElement, Props>(
  ({ provincesVisited, visitedRegions, checkins, badges, total = 63 }, ref) => {
    const W = 600;
    const H = 960;
    const pct = Math.min(1, provincesVisited / total);
    const barW = 460;
    const barX = 70;

    const recentCheckins = checkins.slice(0, 5);
    const displayBadges = badges.slice(0, 5);
    const badgeSpacing = displayBadges.length > 0 ? Math.min(90, 400 / displayBadges.length) : 80;
    const badgeStartX = W / 2 - ((displayBadges.length - 1) * badgeSpacing) / 2;

    return (
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sc-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a2028" />
            <stop offset="50%" stopColor="#0f3a30" />
            <stop offset="100%" stopColor="#122820" />
          </linearGradient>
          <linearGradient id="sc-hero" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2a35" />
            <stop offset="100%" stopColor="#16504a" />
          </linearGradient>
          <linearGradient id="sc-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4a84b" />
            <stop offset="100%" stopColor="#f0d080" />
          </linearGradient>
          <linearGradient id="sc-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e2a1e" />
            <stop offset="100%" stopColor="#0a2018" />
          </linearGradient>
        </defs>

        {/* Full background */}
        <rect width={W} height={H} fill="url(#sc-bg)" />

        {/* ── HERO SECTION ── */}
        <rect width={W} height={440} fill="url(#sc-hero)" />

        {/* Outer decorative border */}
        <rect x="14" y="14" width={W - 28} height={H - 28} rx="4" fill="none" stroke="rgba(212,168,75,0.3)" strokeWidth="1.5" />
        <rect x="20" y="20" width={W - 40} height={H - 40} rx="2" fill="none" stroke="rgba(212,168,75,0.12)" strokeWidth="0.5" />

        {/* Vietnam map outline — large decorative, right side */}
        <g transform="translate(390, 40) scale(1.9)" opacity="0.08">
          <path d={VN_PATH} fill="white" />
        </g>

        {/* Compass rose — left side watermark */}
        <g opacity="0.12">
          <CompassRose x={105} y={210} r={72} />
        </g>

        {/* Gold star / emblem */}
        <g transform="translate(100, 85)">
          <circle cx={0} cy={0} r={32} fill="rgba(212,168,75,0.12)" stroke="rgba(212,168,75,0.5)" strokeWidth="1.5" />
          <circle cx={0} cy={0} r={26} fill="none" stroke="rgba(212,168,75,0.2)" strokeWidth="0.5" />
          {/* 5-point star */}
          <polygon
            points="0,-18 4,-7 16,-7 7,1 11,12 0,5 -11,12 -7,1 -16,-7 -4,-7"
            fill="#d4a84b"
            opacity="0.9"
          />
        </g>

        {/* Title */}
        <text x={162} y={78} fontFamily="'Georgia','Times New Roman',serif" fontSize="13" fill="rgba(212,168,75,0.85)" letterSpacing="5">
          VIETNAM
        </text>
        <text x={162} y={108} fontFamily="'Georgia','Times New Roman',serif" fontSize="28" fontWeight="700" fill="white" letterSpacing="3">
          PASSPORT
        </text>
        <text x={162} y={132} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fill="rgba(255,255,255,0.5)" letterSpacing="4">
          HÀNH TRÌNH CỦA BẠN
        </text>

        {/* VIETNAM ATLAS at bottom of emblem area */}
        <text x={100} y={137} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8" fill="rgba(255,255,255,0.35)" textAnchor="middle" letterSpacing="2">
          VIETNAM ATLAS
        </text>

        {/* ── PROVINCE STATS ── */}
        {/* Big number */}
        <text x={barX} y={210} fontFamily="'Georgia','Times New Roman',serif" fontSize="72" fontWeight="700" fill="white">
          {provincesVisited}
        </text>
        <text x={barX + (provincesVisited > 9 ? 95 : 54)} y={210} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="28" fill="rgba(255,255,255,0.4)">
          /{total}
        </text>
        <text x={barX} y={236} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fill="rgba(255,255,255,0.45)" letterSpacing="3">
          TỈNH THÀNH ĐÃ KHÁM PHÁ
        </text>

        {/* Progress bar */}
        <rect x={barX} y={252} width={barW} height={10} rx={5} fill="rgba(255,255,255,0.12)" />
        <rect x={barX} y={252} width={Math.max(10, barW * pct)} height={10} rx={5} fill="url(#sc-bar)" />

        {/* 4-stat mini grid */}
        {[
          { label: "Tỉnh thành", val: provincesVisited },
          { label: "Vùng miền", val: visitedRegions },
          { label: "Điểm đến", val: checkins.length },
          { label: "Huy hiệu", val: badges.length },
        ].map((s, i) => {
          const sx = barX + i * 118;
          return (
            <g key={s.label}>
              <text x={sx} y={302} fontFamily="'Georgia','Times New Roman',serif" fontSize="32" fontWeight="700" fill="white">
                {s.val}
              </text>
              <text x={sx} y={320} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10" fill="rgba(255,255,255,0.45)" letterSpacing="1">
                {s.label}
              </text>
            </g>
          );
        })}

        {/* Divider */}
        <line x1={barX} y1={348} x2={barX + barW} y2={348} stroke="rgba(212,168,75,0.3)" strokeWidth="0.5" />

        {/* ── CHECKINS SECTION ── */}
        <rect y={380} width={W} height={recentCheckins.length > 0 ? recentCheckins.length * 72 + 60 : 0} fill="url(#sc-mid)" />

        {recentCheckins.length > 0 && (
          <>
            <text x={barX} y={414} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10" fill="rgba(212,168,75,0.8)" letterSpacing="4">
              NHỮNG NƠI ĐÃ GHÉ
            </text>
            {recentCheckins.map((c, i) => {
              const cy = 440 + i * 72;
              return (
                <g key={c.id}>
                  {/* Number circle */}
                  <circle cx={barX + 16} cy={cy} r={16} fill="rgba(212,168,75,0.15)" stroke="rgba(212,168,75,0.5)" strokeWidth="1" />
                  <text x={barX + 16} y={cy + 5} textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="12" fontWeight="700" fill="#d4a84b">
                    {i + 1}
                  </text>
                  {/* Name + caption */}
                  <text x={barX + 42} y={cy - 5} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="16" fontWeight="600" fill="white">
                    {c.destinationName}
                  </text>
                  <text x={barX + 42} y={cy + 16} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fill="rgba(255,255,255,0.45)">
                    {c.caption.length > 52 ? c.caption.slice(0, 52) + "…" : c.caption}
                  </text>
                  {/* Subtle separator */}
                  {i < recentCheckins.length - 1 && (
                    <line x1={barX + 42} y1={cy + 34} x2={barX + barW} y2={cy + 34} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  )}
                </g>
              );
            })}
          </>
        )}

        {/* ── BADGES SECTION ── */}
        {displayBadges.length > 0 && (() => {
          const badgesY = recentCheckins.length > 0 ? 380 + recentCheckins.length * 72 + 70 : 400;
          return (
            <g>
              <text x={W / 2} y={badgesY} textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10" fill="rgba(212,168,75,0.8)" letterSpacing="4">
                HUY HIỆU
              </text>
              {displayBadges.map((b, i) => {
                const bx = badgeStartX + i * badgeSpacing;
                const by = badgesY + 55;
                return (
                  <g key={b.id}>
                    <BadgeCircle cx={bx} cy={by} badge={b} />
                    <text x={bx} y={by + 50} textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9" fill="rgba(255,255,255,0.55)" letterSpacing="0.5">
                      {b.label.length > 14 ? b.label.slice(0, 14) + "…" : b.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* ── FOOTER ── */}
        <g>
          <line x1={barX} y1={H - 80} x2={barX + barW} y2={H - 80} stroke="rgba(212,168,75,0.2)" strokeWidth="0.5" />
          <text x={W / 2} y={H - 52} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="18" fill="rgba(255,255,255,0.6)" letterSpacing="3">
            🇻🇳 VIETNAM ATLAS
          </text>
          <text x={W / 2} y={H - 30} textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fill="rgba(255,255,255,0.3)" letterSpacing="1">
            vietnam-atlas.fechtin.workers.dev
          </text>
        </g>
      </svg>
    );
  },
);
ShareCard.displayName = "ShareCard";
