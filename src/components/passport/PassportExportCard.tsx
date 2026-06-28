/**
 * HTML export card — single source of truth for the shareable passport image.
 * Rendered off-screen at a fixed 420px width, then captured with html2canvas.
 * Must use only inline styles (no Tailwind) so html2canvas can read them.
 */
import { forwardRef } from "react";
import { Star } from "lucide-react";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import type { Checkin, AwardedBadge } from "@/lib/types";
import type { AuthUser } from "@/lib/store/useAuthStore";

interface Props {
  checkins: Checkin[];
  badges: AwardedBadge[];
  visitedProvincesCount: number;
  visitedRegionsCount: number;
  user: AuthUser | null;
  customAvatarUrl?: string | null;
}

const GOLD = "#c8922a";
const CARD_BG = "#0d1e2b";
const ROOT_BG = "#081420";

export const PassportExportCard = forwardRef<HTMLDivElement, Props>(
  ({ checkins, badges, visitedProvincesCount, visitedRegionsCount, user, customAvatarUrl }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const progressPct = Math.min(1, visitedProvincesCount / 63);

    return (
      <div
        ref={ref}
        style={{
          width: 420,
          background: ROOT_BG,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: "#fff",
          paddingBottom: 24,
        }}
      >
        {/* ── Cover ── */}
        <div style={{
          background: "linear-gradient(160deg, #0d2a35 0%, #16504a 55%, #0e3030 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "24px 24px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}>
          {/* inner border */}
          <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }} />

          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              {(customAvatarUrl || user?.photoURL) ? (
                <img
                  src={customAvatarUrl || user?.photoURL!}
                  alt={user?.displayName ?? ""}
                  style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `1px solid ${GOLD}66` }}
                />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${GOLD}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 700, color: GOLD,
                }}>
                  {user?.displayName?.[0]?.toUpperCase() ?? "V"}
                </div>
              )}
              <div style={{
                position: "absolute", bottom: -4, right: -4,
                width: 20, height: 20, borderRadius: "50%",
                background: `${GOLD}33`, border: `1px solid ${GOLD}80`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Star size={9} fill={GOLD} color={GOLD} />
              </div>
            </div>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {user?.displayName ? user.displayName.split(" ").slice(-1)[0].toUpperCase() : "VIETNAM ATLAS"}
            </p>
          </div>

          {/* Title + stats */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}cc`, margin: "0 0 2px" }}>
              Hộ chiếu du lịch
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 12px" }}>
              VIETNAM<br />PASSPORT
            </h2>

            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Đã khám phá</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {visitedProvincesCount}<span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 11 }}>/63</span>
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${Math.max(progressPct * 100, checkins.length > 0 ? 3 : 0)}%`,
                background: "linear-gradient(90deg, #d4a84b, #e8c878)",
              }} />
            </div>

            {/* Mini stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", marginTop: 12, textAlign: "center" }}>
              {[
                { v: visitedProvincesCount, l: "Tỉnh" },
                { v: visitedRegionsCount, l: "Vùng" },
                { v: checkins.length, l: "Check-in" },
                { v: badges.length, l: "Huy hiệu" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ── Visited places ── */}
          {checkins.length > 0 && (
            <div style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
                  Những nơi đáng nhớ
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 12px 14px" }}>
                {checkins.slice(0, 4).map((c) => {
                  const d = new Date(c.createdAt);
                  const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                  return (
                    <div key={c.id} style={{ background: "#0a1520", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.destinationName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <IllustratedImage seed={c.photoSeed} ratio="4/3" className="w-full" />
                        )}
                      </div>
                      <div style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                          <span style={{ fontSize: 9, color: GOLD }}>📍</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: GOLD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.destinationName}
                          </span>
                        </div>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {c.caption}
                        </p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", margin: 0 }}>{dateLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Badges ── */}
          {badges.length > 0 && (
            <div style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
                  Huy hiệu của bạn
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, overflowX: "hidden", padding: "0 16px 14px", flexWrap: "wrap" }}>
                {badges.slice(0, 6).map((b) => (
                  <div key={b.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 64 }}>
                    <BadgeMedalExport emoji={b.emoji} />
                    <span style={{ fontSize: 10, fontWeight: 600, textAlign: "center", color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Timeline ── */}
          {checkins.length > 0 && (
            <div style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
                  Dòng thời gian hành trình
                </span>
              </div>
              <div style={{ overflowX: "hidden", padding: "0 16px 14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {[...checkins].reverse().slice(0, 6).map((c, i, arr) => {
                    const d = new Date(c.createdAt);
                    const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 64 }}>
                          <span style={{ fontSize: 9, color: GOLD, marginBottom: 6 }}>{dateLabel}</span>
                          <div style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD, border: `2px solid ${GOLD}66`, marginBottom: 8, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, textAlign: "center", color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}>
                            {c.destinationName}
                          </span>
                          <span style={{ fontSize: 8, textAlign: "center", color: "rgba(255,255,255,0.4)", lineHeight: 1.3, marginTop: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {c.caption}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{ width: 16, height: 1, background: `${GOLD}55`, borderTop: `1px dashed ${GOLD}55`, flexShrink: 0, marginBottom: 24 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 4 }}>
            <p style={{ fontSize: 13, letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", margin: 0 }}>🇻🇳  VIETNAM ATLAS</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", marginTop: 4, letterSpacing: "0.05em" }}>vietnam-atlas.fechtin.workers.dev</p>
          </div>
        </div>
      </div>
    );
  },
);
PassportExportCard.displayName = "PassportExportCard";

function BadgeMedalExport({ emoji }: { emoji: string }) {
  const S = 52;
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
      <circle cx={S / 2} cy={S / 2} r={S / 2 - 1} fill="#0d2a2e" stroke="#c49a2a" strokeWidth="2" />
      <circle cx={S / 2} cy={S / 2} r={S / 2 - 6} fill="none" stroke="rgba(212,168,75,0.35)" strokeWidth="1" />
      <text x={S / 2} y={S / 2 + 8} textAnchor="middle" fontSize="20"
        fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
        {emoji}
      </text>
    </svg>
  );
}
