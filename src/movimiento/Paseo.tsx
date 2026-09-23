import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, estaQuieto } from "./gsap";

// El paseo por el tianguis: la rueda se desliza con inercia (Lenis) y los enlaces
// internos llevan caminando a su sección en vez de saltar. Con "reducir movimiento"
// el scroll es el nativo y los enlaces llegan de golpe, pero el foco del teclado
// siempre aterriza en la sección de destino.

interface Paseo {
  irA(id: string): void;
  /** Detiene el scroll de la página mientras hay algo encima, como el visor de capturas */
  pausar(pausado: boolean): void;
}

const PaseoContext = createContext<Paseo | null>(null);

// Arranca rápido y llega frenando: el clic se siente al instante
const llegada = (t: number) => 1 - Math.pow(1 - t, 4);

export function PaseoProvider({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const quietud = matchMedia("(prefers-reduced-motion: reduce)");
    const tic = (t: number) => lenis.current?.raf(t * 1000);
    const montar = () => {
      lenis.current?.destroy();
      lenis.current = null;
      if (quietud.matches) return;
      const l = new Lenis({ autoRaf: false });
      l.on("scroll", ScrollTrigger.update);
      lenis.current = l;
    };
    // Un solo reloj para Lenis y GSAP: el scroll y lo que depende de él se pintan en el mismo cuadro
    gsap.ticker.add(tic);
    gsap.ticker.lagSmoothing(0);
    montar();
    quietud.addEventListener("change", montar);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      quietud.removeEventListener("change", montar);
      gsap.ticker.remove(tic);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  const [paseo] = useState<Paseo>(() => ({
    irA(id) {
      const destino = document.getElementById(id);
      if (!destino) return;
      const margen = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const y = Math.max(0, destino.getBoundingClientRect().top + scrollY - margen);
      const llegar = () => {
        if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
        destino.focus({ preventScroll: true });
      };
      const l = lenis.current;
      if (!l || estaQuieto()) { scrollTo(0, y); llegar(); return; }
      // Más lejos, más tiempo, pero nunca una espera
      const distancia = Math.abs(y - l.animatedScroll);
      l.scrollTo(y, { duration: Math.min(1.6, 0.6 + distancia / 5000), easing: llegada, onComplete: llegar });
    },
    pausar(pausado) {
      if (pausado) lenis.current?.stop(); else lenis.current?.start();
    },
  }));

  // Todo enlace a una sección de la página camina hasta ella
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      paseo.irA(id);
    };
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, [paseo]);

  return <PaseoContext value={paseo}>{children}</PaseoContext>;
}

export function usePaseo() {
  const paseo = useContext(PaseoContext);
  if (!paseo) throw new Error("usePaseo va dentro de <PaseoProvider>");
  return paseo;
}
