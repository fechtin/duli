import { forwardRef } from "react";
import { useT } from "@/lib/i18n";

interface Props {
  provincesVisited: number;
  checkins: number;
  badges: number;
  total?: number;
}

// Self-contained SVG passport card (Bible 011 §13 viral card). Inline styles only so it
// rasterizes cleanly to PNG.
export const ShareCard = forwardRef<SVGSVGElement, Props>(
  ({ provincesVisited, checkins, badges, total = 63 }, ref) => {
    const t = useT();
    const W = 600;
    const H = 750;
    const pct = Math.min(1, provincesVisited / total);
    const barW = 520;

    return (
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16715a" />
            <stop offset="55%" stopColor="#1c4f4a" />
            <stop offset="100%" stopColor="#13303a" />
          </linearGradient>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0b354" />
            <stop offset="100%" stopColor="#b9842a" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} rx="28" fill="url(#bg)" />
        <rect x="20" y="20" width={W - 40} height={H - 40} rx="20" fill="none" stroke="#ffffff22" strokeWidth="1.5" />

        <text x={W / 2} y="96" textAnchor="middle" fontFamily="sans-serif" fontSize="26" fill="#ffffffcc">
          {t("share.brand")}
        </text>
        <text x={W / 2} y="132" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fill="#ffffff88" letterSpacing="3">
          {t("share.explored")}
        </text>

        <text x={W / 2} y="250" textAnchor="middle" fontFamily="sans-serif" fontSize="92" fontWeight="700" fill="#ffffff">
          {provincesVisited}
          <tspan fontSize="40" fill="#ffffff99"> / {total}</tspan>
        </text>
        <text x={W / 2} y="290" textAnchor="middle" fontFamily="sans-serif" fontSize="18" fill="#ffffffaa">
          {t("share.provinces")}
        </text>

        {/* progress */}
        <rect x={(W - barW) / 2} y="330" width={barW} height="16" rx="8" fill="#ffffff22" />
        <rect x={(W - barW) / 2} y="330" width={Math.max(16, barW * pct)} height="16" rx="8" fill="url(#bar)" />

        {/* stats */}
        <g fontFamily="sans-serif" textAnchor="middle">
          <text x="170" y="470" fontSize="48" fontWeight="700" fill="#ffffff">
            {checkins}
          </text>
          <text x="170" y="500" fontSize="15" fill="#ffffff99">
            {t("share.checkins")}
          </text>
          <text x="430" y="470" fontSize="48" fontWeight="700" fill="#ffffff">
            {badges}
          </text>
          <text x="430" y="500" fontSize="15" fill="#ffffff99">
            {t("share.badges")}
          </text>
        </g>
        <line x1="300" y1="440" x2="300" y2="500" stroke="#ffffff22" strokeWidth="1.5" />

        <text x={W / 2} y="660" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fill="#ffffffcc" fontWeight="600">
          {t("share.tagline")}
        </text>
        <text x={W / 2} y="694" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#ffffff77">
          vietnam-atlas
        </text>
      </svg>
    );
  },
);
ShareCard.displayName = "ShareCard";
