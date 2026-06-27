const API = "/api/v1/upload";

async function uploadFile(file: File, prefix: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("prefix", prefix);
  const res = await fetch(API, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json() as { url: string };
  const { url } = data;
  return url;
}

export function uploadCheckinPhoto(file: File, _destinationId: string): Promise<string> {
  return uploadFile(file, "checkins");
}

export function uploadAvatarPhoto(file: File): Promise<string> {
  return uploadFile(file, "avatars");
}
