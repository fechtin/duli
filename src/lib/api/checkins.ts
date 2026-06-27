import type { Checkin } from "@/lib/types";
import { auth } from "@/lib/firebase";

async function authHeader(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchServerCheckins(): Promise<Checkin[]> {
  const res = await fetch("/api/v1/me/checkins", { headers: await authHeader() });
  if (!res.ok) return [];
  const data = await res.json() as { data: Checkin[] };
  return data.data ?? [];
}

export async function saveServerCheckin(checkin: Checkin): Promise<void> {
  await fetch("/api/v1/me/checkins", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify(checkin),
  });
}

export async function deleteServerCheckin(id: string): Promise<void> {
  await fetch(`/api/v1/me/checkins/${id}`, {
    method: "DELETE",
    headers: await authHeader(),
  });
}
