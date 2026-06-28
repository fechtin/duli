import { forwardRef } from "react";
import type { AwardedBadge, Checkin } from "@/lib/types";
import type { ProvinceShape } from "@/lib/map/projection";
import type { AuthUser } from "@/lib/store/useAuthStore";

interface Props {
  provincesVisited: number;
  visitedRegions: number;
  visitedProvinceSlugs: string[];
  checkins: Checkin[];
  badges: AwardedBadge[];
  total?: number;
  user?: AuthUser | null;
  customAvatarUrl?: string | null;
  /** Base64 data URIs keyed by checkin id, for embedding in canvas. */
  photosBase64?: Record<string, string>;
  /** Pre-computed province shapes for the mini-map. */
  mapProvinces?: ProvinceShape[];
  mapWidth?: number;
  mapHeight?: number;
}

// Card dimensions
const W = 600;
const H = 960;

export const ShareCard = forwardRef<SVGSVGElement, Props>(
  (
    {
      provincesVisited,
      visitedRegions,
      visitedProvinceSlugs,
      checkins,
      badges,
      total = 63,
      user,
      customAvatarUrl,
      photosBase64 = {},
      mapProvinces = [],
      mapWidth = 1000,
      mapHeight = 2200,
    },
    ref,
  ) => {
    const pct = Math.min(1, provincesVisited / total);
    const topCheckins = checkins.slice(0, 4);
    const topBadges = badges.slice(0, 6);
    const visitedSet = new Set(visitedProvinceSlugs);
    const avatarUrl = customAvatarUrl || user?.photoURL;
    const displayName = user?.displayName ?? "Hành trình của bạn";

    // Layout constants
    const HERO_H = 300;
    const STATS_Y = HERO_H + 4;    // 304
    const STATS_H = 80;
    const PHOTOS_Y = STATS_Y + STATS_H + 16;  // 400
    const PHOTO_ROWS = topCheckins.length > 2 ? 2 : 1;
    const PHOTO_GAP = 8;
    const PHOTO_COLS = 2;
    const PAD = 24;
    const PHOTO_W = (W - PAD * 2 - PHOTO_GAP) / PHOTO_COLS;  // 272
    const PHOTO_H = 140;
    const PHOTOS_H = PHOTO_ROWS * PHOTO_H + (PHOTO_ROWS - 1) * PHOTO_GAP + 36; // label
    const BADGE_Y = PHOTOS_Y + PHOTOS_H + 12;
    const BADGE_H = topBadges.length > 0 ? 124 : 0;
    const TIMELINE_Y = BADGE_Y + BADGE_H + 12;

    // Mini-map: fit inside right portion of hero
    const MAP_X = 360;
    const MAP_Y = 30;
    const MAP_AREA_W = W - MAP_X - 20;  // 220
    const MAP_AREA_H = HERO_H - 60;     // 240
    const mapScale = Math.min(MAP_AREA_W / mapWidth, MAP_AREA_H / mapHeight);

    // Compute how tall the card needs to be
    const timelineItems = checkins.slice(0, 8);
    const TIMELINE_H = timelineItems.length > 0 ? 72 : 0;
    const FOOTER_Y = TIMELINE_Y + TIMELINE_H + 12;
    const totalH = Math.max(H, FOOTER_Y + 60);

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${totalH}`}
        width={W}
        height={totalH}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient id="sc-hero" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#0b2830" />
            <stop offset="55%" stopColor="#0f3f38" />
            <stop offset="100%" stopColor="#0b2e28" />
          </linearGradient>
          <linearGradient id="sc-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1f18" />
            <stop offset="100%" stopColor="#091510" />
          </linearGradient>
          <linearGradient id="sc-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8922a" />
            <stop offset="100%" stopColor="#f0d070" />
          </linearGradient>
          <linearGradient id="sc-badge-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3828" />
            <stop offset="100%" stopColor="#0e2018" />
          </linearGradient>
          <clipPath id="sc-avatar-clip">
            <circle cx="0" cy="0" r="22" />
          </clipPath>
        </defs>

        {/* ── Background ── */}
        <rect width={W} height={totalH} fill="url(#sc-body)" />
        {/* Outer gold frame */}
        <rect x="10" y="10" width={W - 20} height={totalH - 20} rx="4"
          fill="none" stroke="rgba(200,146,42,0.3)" strokeWidth="1.5" />

        {/* ══════════════ HERO ══════════════ */}
        <rect width={W} height={HERO_H} fill="url(#sc-hero)" />
        <rect x="16" y="16" width={W - 32} height={HERO_H - 16} rx="2"
          fill="none" stroke="rgba(200,146,42,0.12)" strokeWidth="0.75" />

        {/* Left: title block */}
        <text x={PAD} y={52}
          fontFamily="'Georgia','Times New Roman',serif" fontSize="10"
          fill="rgba(200,146,42,0.9)" letterSpacing="6">
          VIETNAM
        </text>
        <text x={PAD} y={90}
          fontFamily="'Georgia','Times New Roman',serif" fontSize="38"
          fontWeight="700" fill="#ffffff" letterSpacing="1">
          PASSPORT
        </text>
        <text x={PAD} y={112}
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
          fill="rgba(255,255,255,0.38)" letterSpacing="4">
          HÀNH TRÌNH CỦA BẠN
        </text>
        <line x1={PAD} y1={120} x2={340} y2={120}
          stroke="rgba(200,146,42,0.3)" strokeWidth="0.75" />

        {/* User info row */}
        <g transform={`translate(${PAD}, 148)`}>
          {avatarUrl ? (
            <image
              href={avatarUrl}
              x="-22" y="-22" width="44" height="44"
              clipPath="url(#sc-avatar-clip)"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <>
              <circle r="22" fill="rgba(200,146,42,0.25)" />
              <text textAnchor="middle" y="8" fontSize="18"
                fontFamily="'Helvetica Neue',Arial,sans-serif" fill="#c8922a" fontWeight="700">
                {displayName[0].toUpperCase()}
              </text>
            </>
          )}
          <circle r="22" fill="none" stroke="rgba(200,146,42,0.5)" strokeWidth="1.5" />
          <text x="30" y="-5"
            fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="13"
            fontWeight="600" fill="rgba(255,255,255,0.9)">
            {displayName.length > 24 ? displayName.slice(0, 24) + "…" : displayName}
          </text>
          <text x="30" y="12"
            fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10"
            fill="rgba(255,255,255,0.38)">
            Vietnam Atlas
          </text>
        </g>

        {/* Province count */}
        <g transform={`translate(${PAD}, 210)`}>
          <text fontFamily="'Georgia','Times New Roman',serif"
            fontSize="54" fontWeight="700" fill="white" y="0">
            {provincesVisited}
          </text>
          <text x={provincesVisited >= 10 ? 76 : 42} y="0"
            fontFamily="'Helvetica Neue',Arial,sans-serif"
            fontSize="20" fill="rgba(255,255,255,0.35)">
            /{total}
          </text>
          <text y="22"
            fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
            fill="rgba(255,255,255,0.38)" letterSpacing="3">
            TỈNH THÀNH ĐÃ KHÁM PHÁ
          </text>
          {/* Progress bar */}
          <rect y="34" width={320} height="6" rx="3" fill="rgba(255,255,255,0.1)" />
          <rect y="34" width={Math.max(8, 320 * pct)} height="6" rx="3" fill="url(#sc-bar)" />
        </g>

        {/* ── Mini Vietnam Map (right side of hero) ── */}
        {mapProvinces.length > 0 && (
          <g transform={`translate(${MAP_X}, ${MAP_Y})`}>
            {/* Subtle bg glow */}
            <ellipse cx={MAP_AREA_W / 2} cy={MAP_AREA_H / 2}
              rx={MAP_AREA_W * 0.5} ry={MAP_AREA_H * 0.45}
              fill="rgba(200,146,42,0.04)" />
            <g transform={`scale(${mapScale})`}>
              {mapProvinces.map((p) => (
                <path
                  key={p.slug}
                  d={p.d}
                  fill={visitedSet.has(p.slug) ? "#c8922a" : "rgba(0,80,60,0.35)"}
                  stroke={visitedSet.has(p.slug) ? "rgba(240,208,112,0.6)" : "rgba(200,146,42,0.15)"}
                  strokeWidth={visitedSet.has(p.slug) ? 3 : 2}
                />
              ))}
            </g>
          </g>
        )}

        {/* ══════════════ STATS ROW ══════════════ */}
        {[
          { v: provincesVisited, lbl: "Tỉnh thành" },
          { v: visitedRegions, lbl: "Vùng miền" },
          { v: checkins.length, lbl: "Điểm đến" },
          { v: badges.length, lbl: "Huy hiệu" },
        ].map((s, i) => {
          const sx = PAD + i * ((W - PAD * 2) / 4);
          return (
            <g key={s.lbl}>
              {i > 0 && (
                <line
                  x1={sx - 4} y1={STATS_Y + 10}
                  x2={sx - 4} y2={STATS_Y + 62}
                  stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"
                />
              )}
              <text x={sx} y={STATS_Y + 40}
                fontFamily="'Georgia','Times New Roman',serif"
                fontSize="30" fontWeight="700" fill="white">
                {s.v}
              </text>
              <text x={sx} y={STATS_Y + 58}
                fontFamily="'Helvetica Neue',Arial,sans-serif"
                fontSize="9" fill="rgba(255,255,255,0.38)" letterSpacing="0.5">
                {s.lbl}
              </text>
            </g>
          );
        })}

        <line x1={PAD} y1={STATS_Y + STATS_H} x2={W - PAD} y2={STATS_Y + STATS_H}
          stroke="rgba(200,146,42,0.2)" strokeWidth="0.75" />

        {/* ══════════════ PHOTOS ══════════════ */}
        {topCheckins.length > 0 && (
          <g>
            <text x={PAD} y={PHOTOS_Y + 16}
              fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
              fill="rgba(200,146,42,0.75)" letterSpacing="3.5">
              NHỮNG NƠI ĐÁNG NHỚ
            </text>
            {topCheckins.map((c, i) => {
              const col = i % PHOTO_COLS;
              const row = Math.floor(i / PHOTO_COLS);
              const px = PAD + col * (PHOTO_W + PHOTO_GAP);
              const py = PHOTOS_Y + 24 + row * (PHOTO_H + PHOTO_GAP);
              const photoSrc = photosBase64[c.id];
              return (
                <g key={c.id}>
                  {/* Photo frame */}
                  <rect x={px} y={py} width={PHOTO_W} height={PHOTO_H} rx="6"
                    fill="rgba(255,255,255,0.06)" stroke="rgba(200,146,42,0.2)" strokeWidth="1" />
                  {photoSrc ? (
                    <image
                      href={photoSrc}
                      x={px} y={py} width={PHOTO_W} height={PHOTO_H}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#clip-photo-${i})`}
                    />
                  ) : (
                    <IllustratedRect x={px} y={py} w={PHOTO_W} h={PHOTO_H} seed={c.photoSeed} index={i} />
                  )}
                  {/* Define clipPath for each photo */}
                  <defs>
                    <clipPath id={`clip-photo-${i}`}>
                      <rect x={px} y={py} width={PHOTO_W} height={PHOTO_H} rx="6" />
                    </clipPath>
                  </defs>
                  {/* Dark overlay at bottom */}
                  <rect x={px} y={py + PHOTO_H - 44} width={PHOTO_W} height={44} rx="0"
                    fill="url(#sc-photo-overlay)" />
                  {/* Number badge */}
                  <circle cx={px + 16} cy={py + 16} r={12}
                    fill="rgba(0,0,0,0.55)" stroke="rgba(200,146,42,0.5)" strokeWidth="1" />
                  <text x={px + 16} y={py + 20} textAnchor="middle"
                    fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="10"
                    fontWeight="700" fill="#c8922a">
                    {i + 1}
                  </text>
                  {/* Name */}
                  <text x={px + 10} y={py + PHOTO_H - 26}
                    fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="12"
                    fontWeight="700" fill="white">
                    {c.destinationName.length > 22 ? c.destinationName.slice(0, 22) + "…" : c.destinationName}
                  </text>
                  {/* Caption */}
                  <text x={px + 10} y={py + PHOTO_H - 12}
                    fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
                    fill="rgba(255,255,255,0.6)">
                    {c.caption.length > 30 ? c.caption.slice(0, 30) + "…" : c.caption}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Photo overlay gradient */}
        <defs>
          <linearGradient id="sc-photo-overlay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
          </linearGradient>
        </defs>

        {/* ══════════════ BADGES ══════════════ */}
        {topBadges.length > 0 && (
          <g>
            <rect x={0} y={BADGE_Y} width={W} height={BADGE_H}
              fill="url(#sc-badge-bg)" />
            <line x1={PAD} y1={BADGE_Y} x2={W - PAD} y2={BADGE_Y}
              stroke="rgba(200,146,42,0.2)" strokeWidth="0.75" />
            <text x={W / 2} y={BADGE_Y + 20} textAnchor="middle"
              fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
              fill="rgba(200,146,42,0.75)" letterSpacing="3.5">
              HUY HIỆU CỦA BẠN
            </text>
            {topBadges.map((b, i) => {
              const gap = Math.min(88, (W - 80) / topBadges.length);
              const bx = W / 2 + (i - (topBadges.length - 1) / 2) * gap;
              const by = BADGE_Y + 72;
              return (
                <g key={b.id}>
                  <circle cx={bx} cy={by} r={28}
                    fill="#0a2028" stroke="#c8922a" strokeWidth="1.75" />
                  <circle cx={bx} cy={by} r={22}
                    fill="none" stroke="rgba(200,146,42,0.22)" strokeWidth="0.75" />
                  <text x={bx} y={by + 8} textAnchor="middle"
                    fontSize="18"
                    fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
                    {b.emoji}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ══════════════ TIMELINE ══════════════ */}
        {timelineItems.length > 0 && (
          <g>
            <line x1={PAD} y1={TIMELINE_Y} x2={W - PAD} y2={TIMELINE_Y}
              stroke="rgba(200,146,42,0.2)" strokeWidth="0.75" />
            <text x={PAD} y={TIMELINE_Y + 18}
              fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
              fill="rgba(200,146,42,0.75)" letterSpacing="3.5">
              DÒNG THỜI GIAN
            </text>
            {/* Horizontal line */}
            <line
              x1={PAD + 4} y1={TIMELINE_Y + 40}
              x2={W - PAD - 4} y2={TIMELINE_Y + 40}
              stroke="rgba(200,146,42,0.2)" strokeWidth="1" strokeDasharray="4 3"
            />
            {timelineItems.map((c, i) => {
              const itemW = (W - PAD * 2) / timelineItems.length;
              const tx = PAD + i * itemW + itemW / 2;
              const d = new Date(c.createdAt);
              const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;
              return (
                <g key={c.id}>
                  <text x={tx} y={TIMELINE_Y + 30} textAnchor="middle"
                    fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="7.5"
                    fill="rgba(200,146,42,0.75)">
                    {dateLabel}
                  </text>
                  <circle cx={tx} cy={TIMELINE_Y + 40} r={5}
                    fill="#c8922a" stroke="rgba(240,208,112,0.5)" strokeWidth="1.5" />
                  <text x={tx} y={TIMELINE_Y + 60} textAnchor="middle"
                    fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8"
                    fill="rgba(255,255,255,0.5)">
                    {c.destinationName.length > 10 ? c.destinationName.slice(0, 9) + "…" : c.destinationName}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ══════════════ FOOTER ══════════════ */}
        <line x1={PAD} y1={FOOTER_Y} x2={W - PAD} y2={FOOTER_Y}
          stroke="rgba(200,146,42,0.15)" strokeWidth="0.75" />
        <text x={W / 2} y={FOOTER_Y + 28} textAnchor="middle"
          fontFamily="'Georgia','Times New Roman',serif" fontSize="13"
          fill="rgba(255,255,255,0.45)" letterSpacing="4">
          🇻🇳  VIETNAM ATLAS
        </text>
        <text x={W / 2} y={FOOTER_Y + 46} textAnchor="middle"
          fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"
          fill="rgba(255,255,255,0.2)" letterSpacing="1">
          vietnam-atlas.fechtin.workers.dev
        </text>
      </svg>
    );
  },
);
ShareCard.displayName = "ShareCard";

// Placeholder colored rect when no photo available
function IllustratedRect({
  x, y, w, h, seed, index,
}: {
  x: number; y: number; w: number; h: number; seed: string; index: number;
}) {
  const hue = (seed.charCodeAt(0) * 37 + index * 60) % 360;
  const id = `sc-illus-${index}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue},35%,18%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 40) % 360},30%,12%)`} />
        </linearGradient>
        <clipPath id={`clip-illus-${index}`}>
          <rect x={x} y={y} width={w} height={h} rx="6" />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} clipPath={`url(#clip-illus-${index})`} />
    </g>
  );
}
