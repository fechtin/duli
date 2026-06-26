import {
  Building2,
  Landmark,
  Mountain,
  Waves,
  Droplets,
  TreePine,
  Home,
  Store,
  Sparkles,
  Castle,
  Footprints,
  type LucideIcon,
} from "lucide-react";
import type { DestinationType } from "@/lib/types";

// One icon system only (Bible 002 §13, 007 §10 — Lucide).
const icons: Record<DestinationType, LucideIcon> = {
  beach: Waves,
  mountain: Mountain,
  temple: Landmark,
  museum: Landmark,
  unesco: Sparkles,
  waterfall: Droplets,
  island: Waves,
  cave: Footprints,
  park: TreePine,
  village: Home,
  lake: Waves,
  bridge: Footprints,
  city: Building2,
  market: Store,
};

export function markerIcon(type: DestinationType): LucideIcon {
  return icons[type] ?? Castle;
}
