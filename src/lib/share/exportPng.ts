// Rasterize an <svg> share card to PNG, then share (Web Share API) or download.

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

export async function svgToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const w = svg.viewBox.baseVal.width || svg.clientWidth || 600;
  const h = svg.viewBox.baseVal.height || svg.clientHeight || 960;
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;

  const img = new Image();
  img.decoding = "async";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("svg-image"));
    img.src = svg64;
  });

  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png"),
  );
}

export async function shareOrDownload(svg: SVGSVGElement, filename = "vietnam-passport.png") {
  const blob = await svgToPngBlob(svg);
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
