// Rasterize an <svg> share card to PNG, then share (Web Share API) or download.
// Worker-side SVG->PNG is the production path (Bible 015 §12); this is the client fallback.

export async function svgToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const w = svg.viewBox.baseVal.width || svg.clientWidth || 600;
  const h = svg.viewBox.baseVal.height || svg.clientHeight || 750;
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
