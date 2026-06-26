// Thin client for the Worker API (/api/v1). The Worker reads D1; the client never
// touches the database directly (Bible 015 §2).

const API = "/api/v1";

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as Envelope<T>;
  if (!json.success) throw new Error(json.error?.message ?? "API error");
  return json.data;
}
