# Spike — Ambient video layer (pre-030)

Throwaway spike to answer three questions before writing `docs/030.md`. **Not production code.**

## Setup
- One clip, Ha Long Bay. Ken Burns palindrome (zoom in + reversed) rendered from the existing
  `public/img/halong-1.webp` with ffmpeg, so the loop point is seamless and there is no licensing
  question during the spike.
- Two variants: hero `900x674`, medallion `256x256`. AV1/WebM + H.264/MP4 each.
- A/B on ONE build via the `?novideo=1` kill switch. Chrome, 1440x900, local `vite` + `wrangler dev`.
- Harness: `scripts/perf-video.mjs`. Scenario: deep-link to Ha Long → measure LCP → zoom to
  level 4 → continuous 2s mouse drag while sampling `requestAnimationFrame` intervals.

## Results

| Metric | video OFF | video ON | verdict |
|---|---|---|---|
| LCP | 1588 ms | 1544 ms | no regression (delta is noise) |
| FPS during drag | 60.0 | 59.7 | pass (budget: ≥ 55) |
| avg frame | 16.67 ms | 16.74 ms | pass |
| p95 frame | 17.2 ms | 17.5 ms | pass |
| frames > 33 ms | 0 / 203 | 1 / 218 | pass |
| JS added (gzip) | — | **+1.03 KB** | pass (budget: < 3 KB) |
| video bytes fetched | 0 KB | 763 KB | see caveat |

Both decode slots were occupied during the drag (hero 900px + medallion 256px playing
simultaneously) — i.e. the measured case is the worst case the budget permits.

## Answers to the three spike questions

1. **Can living medallions hold 60fps while panning?** Yes. 59.7 fps with two decoders live.
   The camera path was never the bottleneck; the existing rAF-throttled viewport culling already
   does the expensive work, and the video layers are pure GPU composite.
2. **Is 2.5 MB/clip enough quality?** Unanswered, and the byte numbers here must NOT be used to
   set the production budget. A Ken Burns move over a still compresses far better than real
   footage; genuine motion will be several times larger at equal quality.
3. **Is the photo → video handover clean?** Yes. Fading in on the `playing` event (not
   `canplay`) means no black first frame, no letterbox, no layout shift. Screenshots with and
   without video are pixel-identical in framing.

## The clip was invisible at first — two separate causes

Worth recording, because both would have shipped a broken feature that *measured* fine.

1. **`zoompan` with `d=1` does not accumulate zoom.** The first master rendered as a static
   image with a video codec wrapped around it. Every perf number was still valid (a real decode
   was happening) but nothing moved on screen, and no metric could have caught it. The working
   idiom is a single input frame with `d=<total frames>` and an `on`-driven ramp:
   `zoompan=z='1+0.34*on/119':d=120:s=900x674:fps=30`.
2. **The first "subtle" grade was too subtle to judge.** 13% zoom over 3s is indistinguishable
   from a still in a screenshot and nearly so in motion. Spike clips must be graded to be
   obviously alive; taste comes after the mechanism is confirmed.

Verification that actually works: seek the element to fixed `currentTime` values and compare
frames. Wall-clock screenshots are useless here — two arbitrary moments in a palindrome loop can
land at near-identical zoom by chance, which is what happened and briefly sent me chasing a
"video keeps restarting" theory that the currentTime trace disproved.

## Does clip DURATION cost anything? (`scripts/perf-duration.mjs`)

8s loop vs a 32s cut of the same move, plus a no-video arm in the identical scenario.

| | no video | 8s (639 KB) | 32s (1744 KB) |
|---|---|---|---|
| LCP | 1992 ms | 1640 ms | 1740 ms |
| first video frame on screen | — | 993 ms | 963 ms |
| video KB by first frame | 0 | 639 | 1743 |
| video KB by 12s | 0 | 639 | 1743 |
| FPS during drag | 28.7 | 29.0 | 30.1 |

**Duration does not affect speed or responsiveness.** Time-to-first-frame, LCP and FPS are flat
across 4x duration; the 32s clip actually painted marginally sooner. Decode cost is per frame,
not per file, and it runs off the main thread.

**Duration is a direct, linear data-cost multiplier, and there is no streaming discount.** The
element had the *entire* file buffered by the time the first frame appeared (`buffered: [32]`).
That is not a `preload` misconfiguration to tune away: an ambient clip loops forever, so the
whole file is fetched within the first cycle no matter what. 4x the duration is 4x the bytes for
every viewer, every visit. **The only lever on ambient video bandwidth is keeping clips short.**

**Unrelated pre-existing finding:** in this scenario (panel open, overview zoom, continuous drag)
all three arms sit at ~29 FPS, including the no-video baseline — so video is not the cause. The
earlier harness measured 60 FPS with the panel closed at zoom level 4. Whether this is a real
regression at overview zoom or an artifact of the CDP-driven drag loop is unresolved and worth
its own investigation; it has nothing to do with this spike.

## Findings worth keeping

- **Codec ranking flips with the content, so it must be measured per clip.** On the static first
  master AV1 *lost* to H.264 (327 KB vs 242 KB). On the real-motion master VP9 beat H.264
  (639 KB vs 696 KB). Neither codec is reliably the winner; the encode step must produce both and
  ship the smaller file.
- **Real motion costs ~3x the bytes of the static grade** (654 KB vs 242 KB for the same 8s at
  comparable quality) — and this is still a Ken Burns move over a still, not footage. The
  production budget has to be derived from real clips, not from these.
- **The medallion payoff is weak at 28 px.** It works technically, but at marker size the motion
  is barely perceptible — it reads as a small photo. Either the medallion has to grow when
  selected, or Đề xuất B is not worth its complexity. This is a design call, not a perf one.
- **`useUrlSync` strips unknown query params.** It rebuilds the path from selection state, so
  `?novideo=1` vanished before any gate could read it — the first A/B run silently measured
  video-on twice. Any future query flag must be read once at module load.
- **A poster-less surface needs its own fallback story.** The medallion passes `posterReady`
  unconditionally because the icon underneath is the fallback. That is fine, but it means the
  medallion skips gate 1 — worth stating explicitly in the spec.

## Not yet measured
- Real hardware: this ran on an M-series Mac. The 1-slot mobile cap is untested on a real phone.
- Real footage (bitrate, and whether genuine motion changes the FPS picture).
- Memory over a long session with many marker mount/unmount cycles.

## Files (all removable in one pass)
- `src/lib/media/videoBudget.ts` — decode-slot registry + global gates
- `src/components/ui/AmbientVideo.tsx` — the gated layer
- `src/components/map/LiveMedallion.tsx` — living marker medallion
- `src/lib/media/spikeClips.ts` — hand-wired clip table (would become a generated manifest)
- `scripts/perf-video.mjs` — A/B harness
- `public/video/*` — 4 generated clips
- `data-zoom-level` attribute on the map root (test hook, kept)
