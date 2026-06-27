import { forwardRef } from "react";
import type { AwardedBadge, Checkin } from "@/lib/types";

interface Props {
  provincesVisited: number;
  visitedRegions: number;
  checkins: Checkin[];
  badges: AwardedBadge[];
  total?: number;
}

// Fixed card dimensions
const W = 600;
const H = 900;

// Vietnam outline path (100×250 coordinate space, used with transform)
const VN =
  "M50,5 C65,8 75,25 75,45 C76,62 64,73 62,87 C60,100 66,112 76,122 C85,131 84,150 78,165 C72,181 70,198 72,212 C74,226 68,240 60,249 L57,244 C51,233 52,219 55,206 C58,194 58,181 56,169 C54,157 55,143 58,130 C61,117 62,104 59,91 C56,78 50,66 49,53 C47,40 43,23 50,10 Z";

export const ShareCard = forwardRef<SVGSVGElement, Props>(
  ({ provincesVisited, visitedRegions, checkins, badges, total = 63 }, ref) => {
    const pct = Math.min(1, provincesVisited / total);
    // Cap display items so card height never blows out
    const topCheckins = checkins.slice(0, 4);
    const topBadges = badges.slice(0, 5);

    // ── Fixed layout constants ──
    const HERO_H = 264;
    const STATS_Y = HERO_H + 32;          // 296
    const DIV_Y   = STATS_Y + 88;         // 384
    const LIST_Y  = DIV_Y + 20;           // 404
    const LIST_ROW = 52;
    const LIST_END = LIST_Y + topCheckins.length * LIST_ROW + 20; // ≤ 628
    const BADGE_Y  = LIST_END + 16;       // ≤ 644
    const FOOTER_Y = BADGE_Y + 120;       // ≤ 764  (always < 900)

    const BAR_X = 48;
    const BAR_W = W - 96;

    return (
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-hero" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%"   stopColor="#0c2830" />
            <stop offset="60%"  stopColor="#10423a" />
            <stop offset="100%" stopColor="#0c3028" />
          </linearGradient>
          <linearGradient id="g-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#0d1f18" />
            <stop offset="100%" stopColor="#091510" />
          </linearGradient>
          <linearGradient id="g-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c8922a" />
            <stop offset="100%" stopColor="#f0d070" />
          </linearGradient>
          <linearGradient id="g-badge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a3828" />
            <stop offset="100%" stopColor="#0e2018" />
          </linearGradient>
        </defs>

        {/* ── BG ── */}
        <rect width={W} height={H} fill="url(#g-body)" />

        {/* Outer frame */}
        <rect x="12" y="12" width={W-24} height={H-24} rx="3"
          fill="none" stroke="rgba(200,146,42,0.28)" strokeWidth="1.5" />

        {/* ═══════════════ HERO ═══════════════ */}
        <rect width={W} height={HERO_H} fill="url(#g-hero)" />

        {/* Inner hero frame */}
        <rect x="18" y="18" width={W-36} height={HERO_H-18} rx="2"
          fill="none" stroke="rgba(200,146,42,0.15)" strokeWidth="0.75" />

        {/* Vietnam map — right watermark */}
        <g transform="translate(400, 18) scale(1.92)" opacity="0.1">
          <path d={VN} fill="white" />
        </g>

        {/* Compass rose — left */}
        <CompRose cx={90} cy={140} r={58} />

        {/* Gold star emblem */}
        <circle cx={90} cy={58} r={30} fill="rgba(200,146,42,0.14)"
          stroke="rgba(200,146,42,0.55)" strokeWidth="1.5" />
        <circle cx={90} cy={58} r={24} fill="none"
          stroke="rgba(200,146,42,0.2)" strokeWidth="0.5" />
        <Star cx={90} cy={58} r={16} fill="#c8922a" />

        {/* VIETNAM ATLAS below emblem */}
        <text x={90} y={102} textAnchor="middle"
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="7.5"
          fill="rgba(255,255,255,0.35)" letterSpacing="2.5">
          VIETNAM ATLAS
        </text>

        {/* Title block */}
        <text x={162} y={44}
          fontFamily="'Georgia','Times New Roman',serif" fontSize="11"
          fill="rgba(200,146,42,0.9)" letterSpacing="6">
          VIETNAM
        </text>
        <text x={162} y={82}
          fontFamily="'Georgia','Times New Roman',serif" fontSize="36"
          fontWeight="700" fill="#ffffff" letterSpacing="2">
          PASSPORT
        </text>
        <text x={162} y={106}
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10"
          fill="rgba(255,255,255,0.42)" letterSpacing="4.5">
          HÀNH TRÌNH CỦA BẠN
        </text>

        {/* Thin gold rule under title */}
        <line x1={162} y1={116} x2={450} y2={116}
          stroke="rgba(200,146,42,0.35)" strokeWidth="0.75" />

        {/* Province big number inside hero */}
        <text x={162} y={172}
          fontFamily="'Georgia','Times New Roman',serif"
          fontSize="68" fontWeight="700" fill="white">
          {provincesVisited}
        </text>
        <text x={162 + (provincesVisited >= 10 ? 92 : 52)} y={172}
          fontFamily="'Helvetica Neue',Arial,sans-serif"
          fontSize="24" fill="rgba(255,255,255,0.38)">
          /{total}
        </text>
        <text x={162} y={196}
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10"
          fill="rgba(255,255,255,0.42)" letterSpacing="3">
          TỈNH THÀNH ĐÃ KHÁM PHÁ
        </text>

        {/* Progress bar inside hero */}
        <rect x={162} y={212} width={BAR_W - 114} height={7} rx={3.5}
          fill="rgba(255,255,255,0.1)" />
        <rect x={162} y={212} width={Math.max(8, (BAR_W - 114) * pct)} height={7} rx={3.5}
          fill="url(#g-bar)" />

        {/* ═══════════════ STATS ROW ═══════════════ */}
        {[
          { v: provincesVisited, lbl: "Tỉnh thành" },
          { v: visitedRegions,   lbl: "Vùng miền"  },
          { v: checkins.length,  lbl: "Điểm đến"   },
          { v: badges.length,    lbl: "Huy hiệu"   },
        ].map((s, i) => {
          const sx = BAR_X + i * 132;
          return (
            <g key={s.lbl}>
              <text x={sx} y={STATS_Y + 34}
                fontFamily="'Georgia','Times New Roman',serif"
                fontSize="36" fontWeight="700" fill="white">
                {s.v}
              </text>
              <text x={sx} y={STATS_Y + 54}
                fontFamily="'Helvetica Neue',Arial,sans-serif"
                fontSize="10" fill="rgba(255,255,255,0.38)" letterSpacing="0.5">
                {s.lbl}
              </text>
            </g>
          );
        })}

        {/* Stat separators */}
        {[1,2,3].map(i => (
          <line key={i}
            x1={BAR_X + i * 132 - 16} y1={STATS_Y + 8}
            x2={BAR_X + i * 132 - 16} y2={STATS_Y + 60}
            stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
        ))}

        {/* ═══════════════ DIVIDER ═══════════════ */}
        <line x1={BAR_X} y1={DIV_Y} x2={W - BAR_X} y2={DIV_Y}
          stroke="rgba(200,146,42,0.25)" strokeWidth="0.75" />

        {/* ═══════════════ CHECKINS ═══════════════ */}
        {topCheckins.length > 0 && (
          <g>
            <text x={BAR_X} y={LIST_Y - 4}
              fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
              fill="rgba(200,146,42,0.75)" letterSpacing="3.5">
              NHỮNG NƠI ĐÃ GHÉ
            </text>
            {topCheckins.map((c, i) => {
              const ry = LIST_Y + 16 + i * LIST_ROW;
              return (
                <g key={c.id}>
                  {/* Number pill */}
                  <circle cx={BAR_X + 14} cy={ry} r={13}
                    fill="rgba(200,146,42,0.14)"
                    stroke="rgba(200,146,42,0.45)" strokeWidth="1" />
                  <text x={BAR_X + 14} y={ry + 5} textAnchor="middle"
                    fontFamily="'Helvetica Neue',Arial,sans-serif"
                    fontSize="11" fontWeight="700" fill="#c8922a">
                    {i + 1}
                  </text>
                  {/* Name */}
                  <text x={BAR_X + 36} y={ry - 3}
                    fontFamily="'Helvetica Neue',Arial,sans-serif"
                    fontSize="15" fontWeight="600" fill="rgba(255,255,255,0.92)">
                    {c.destinationName}
                  </text>
                  {/* Caption — max 48 chars */}
                  <text x={BAR_X + 36} y={ry + 16}
                    fontFamily="'Helvetica Neue',Arial,sans-serif"
                    fontSize="10.5" fill="rgba(255,255,255,0.35)">
                    {c.caption.length > 48 ? c.caption.slice(0, 48) + "…" : c.caption}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ═══════════════ BADGES ═══════════════ */}
        {topBadges.length > 0 && (
          <g>
            {/* Section bg */}
            <rect x={0} y={BADGE_Y - 12} width={W} height={108}
              fill="url(#g-badge)" />
            <line x1={BAR_X} y1={BADGE_Y - 12} x2={W - BAR_X} y2={BADGE_Y - 12}
              stroke="rgba(200,146,42,0.2)" strokeWidth="0.75" />

            <text x={W / 2} y={BADGE_Y + 8} textAnchor="middle"
              fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
              fill="rgba(200,146,42,0.75)" letterSpacing="3.5">
              HUY HIỆU
            </text>

            {topBadges.map((b, i) => {
              const gap = Math.min(96, (W - 80) / topBadges.length);
              const bx = W / 2 + (i - (topBadges.length - 1) / 2) * gap;
              const by = BADGE_Y + 54;
              return (
                <g key={b.id}>
                  <circle cx={bx} cy={by} r={30}
                    fill="#0a2028" stroke="#c8922a" strokeWidth="1.75" />
                  <circle cx={bx} cy={by} r={24}
                    fill="none" stroke="rgba(200,146,42,0.22)" strokeWidth="0.75" />
                  <text x={bx} y={by + 9} textAnchor="middle"
                    fontSize="20"
                    fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
                    {b.emoji}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ═══════════════ FOOTER ═══════════════ */}
        <line x1={BAR_X} y1={FOOTER_Y} x2={W - BAR_X} y2={FOOTER_Y}
          stroke="rgba(200,146,42,0.18)" strokeWidth="0.75" />
        <text x={W / 2} y={FOOTER_Y + 30} textAnchor="middle"
          fontFamily="'Georgia','Times New Roman',serif" fontSize="15"
          fill="rgba(255,255,255,0.5)" letterSpacing="4">
          🇻🇳  VIETNAM ATLAS
        </text>
        <text x={W / 2} y={FOOTER_Y + 52} textAnchor="middle"
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10"
          fill="rgba(255,255,255,0.22)" letterSpacing="1">
          vietnam-atlas.fechtin.workers.dev
        </text>
      </svg>
    );
  },
);
ShareCard.displayName = "ShareCard";

// ── helpers ──────────────────────────────────────────────────────────────────

function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const outer = ((i * 4 - 2) * Math.PI) / 10;
    const inner = outer + Math.PI / 5;
    return [
      cx + Math.cos(outer) * r, cy + Math.sin(outer) * r,
      cx + Math.cos(inner) * (r * 0.42), cy + Math.sin(inner) * (r * 0.42),
    ];
  }).flat();
  const d = pts.reduce((acc, v, i) =>
    i === 0 ? `M${v}` : i % 2 === 0 ? `${acc} L${v}` : `${acc},${v}`, "") + " Z";
  return <path d={d} fill={fill} />;
}

function CompRose({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g opacity="0.18">
      <circle cx={cx} cy={cy} r={r} stroke="white" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r={r * 0.62} stroke="white" strokeWidth="0.5" fill="none" />
      <polygon points={`${cx},${cy - r * 0.9} ${cx - 5},${cy} ${cx + 5},${cy}`} fill="white" />
      <polygon points={`${cx},${cy + r * 0.9} ${cx - 5},${cy} ${cx + 5},${cy}`} fill="rgba(255,255,255,0.5)" />
      <polygon points={`${cx - r * 0.9},${cy} ${cx},${cy - 5} ${cx},${cy + 5}`} fill="rgba(255,255,255,0.5)" />
      <polygon points={`${cx + r * 0.9},${cy} ${cx},${cy - 5} ${cx},${cy + 5}`} fill="rgba(255,255,255,0.5)" />
      {[0,45,90,135,180,225,270,315].map(deg => {
        const rad = deg * Math.PI / 180;
        return <line key={deg}
          x1={cx + Math.cos(rad) * (r * 0.68)} y1={cy + Math.sin(rad) * (r * 0.68)}
          x2={cx + Math.cos(rad) * (r * 0.82)} y2={cy + Math.sin(rad) * (r * 0.82)}
          stroke="white" strokeWidth="0.75" />;
      })}
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
}
