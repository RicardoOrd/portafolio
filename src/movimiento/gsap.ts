import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Un solo lugar donde se registran los plugins: todo lo que anima importa de aquí.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/** Condición de gsap.matchMedia() para todo lo que se mueve por gusto, no por estado */
export const CON_MOVIMIENTO = "(prefers-reduced-motion: no-preference)";

const QUIETO = "(prefers-reduced-motion: reduce)";
const suscribir = (avisar: () => void) => {
  const m = matchMedia(QUIETO);
  m.addEventListener("change", avisar);
  return () => m.removeEventListener("change", avisar);
};

/** true si el visitante pidió menos movimiento. En el prerender siempre es false. */
export const useQuieto = () =>
  useSyncExternalStore(suscribir, () => matchMedia(QUIETO).matches, () => false);

export const estaQuieto = () => matchMedia(QUIETO).matches;
