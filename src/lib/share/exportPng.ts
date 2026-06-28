// Rasterize the passport panel to PNG, then share (Web Share API) or download.

import { toBlob } from "html-to-image";

export async function htmlToPngBlob(el: HTMLElement, scale = 2): Promise<Blob> {
  const blob = await toBlob(el, {
    pixelRatio: scale,
    backgroundColor: "#081420",
    width: el.offsetWidth,
    height: el.scrollHeight,
    skipFonts: true,
    filter: (node) => !(node instanceof HTMLElement && node.hasAttribute("data-html2canvas-ignore")),
  });
  if (!blob) throw new Error("blob");
  return blob;
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
