// Rasterize the passport export card to PNG, then share (Web Share API) or download.

import html2canvas from "html2canvas";
import type { Checkin } from "@/lib/types";
import imageManifest from "@/data/generated/image-manifest.json";

const manifest = imageManifest as Record<string, { src: string }>;

async function urlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Pre-fetch all checkin photos as base64 data URIs for canvas-safe embedding. */
export async function fetchCheckinPhotos(checkins: Checkin[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  await Promise.all(
    checkins.slice(0, 4).map(async (c) => {
      const url = c.photoUrl ?? manifest[c.photoSeed]?.src;
      if (!url) return;
      const data = await urlToBase64(url);
      if (data) result[c.id] = data;
    }),
  );
  return result;
}

/** Pre-fetch user avatar as base64 data URI. */
export async function fetchAvatarBase64(avatarUrl: string | null | undefined): Promise<string | null> {
  if (!avatarUrl) return null;
  return urlToBase64(avatarUrl);
}

export async function htmlToPngBlob(el: HTMLElement, scale = 2): Promise<Blob> {
  // Capture full scrollable height, not just visible viewport
  const fullHeight = el.scrollHeight;
  const canvas = await html2canvas(el, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#081420",
    logging: false,
    width: el.offsetWidth,
    height: fullHeight,
    windowWidth: el.offsetWidth,
    windowHeight: fullHeight,
    scrollY: -el.scrollTop,
  });
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png"),
  );
}

export async function shareOrDownload(el: HTMLElement, filename = "vietnam-passport.png") {
  const blob = await htmlToPngBlob(el);
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Vietnam Passport" });
      return;
    } catch {
      // fall through to download on cancel/failure
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
