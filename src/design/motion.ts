// Motion tokens (Bible 006). Components must use these — never hard-code durations.
import type { Transition } from "motion/react";

/** Durations in seconds (Bible 006 §4). */
export const duration = {
  instant: 0,
  fast: 0.12,
  normal: 0.18,
  medium: 0.25,
  slow: 0.32,
} as const;

/** The single approved easing + springs (Bible 006 §5). */
export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const springSoft: Transition = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };
export const springMedium: Transition = { type: "spring", stiffness: 240, damping: 28, mass: 1 };
export const springCamera: Transition = { type: "spring", stiffness: 150, damping: 26, mass: 1.1 };

/** Panel slide-in (desktop right panel / mobile sheet). */
export const panelTransition: Transition = { ...springMedium };

/** Standard fade. */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.normal, ease: easeOut },
};

/** Subtle rise-and-fade used for content reveal (progressive disclosure). */
export const rise = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: { duration: duration.medium, ease: easeOut },
};
