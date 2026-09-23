import { useEffect, useState, type RefObject } from "react";

/**
 * Un puesto se prende al cruzar la franja central de la pantalla, con el cursor
 * encima o con el foco del teclado dentro.
 */
export function usePuestoEncendido(ref: RefObject<HTMLElement | null>) {
  const [enCentro, setEnCentro] = useState(false);
  const [cerca, setCerca] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mostrador = new IntersectionObserver(([e]) => setEnCentro(e.isIntersecting), {
      rootMargin: "-38% 0px -38% 0px",
    });
    mostrador.observe(el);
    const revisar = () => setCerca(el.matches(":hover") || el.matches(":focus-within"));
    // Al salir se espera un cuadro: el foco puede estar pasando a otro elemento del mismo puesto
    const luego = () => requestAnimationFrame(revisar);
    el.addEventListener("pointerenter", revisar);
    el.addEventListener("pointerleave", luego);
    el.addEventListener("focusin", revisar);
    el.addEventListener("focusout", luego);
    return () => {
      mostrador.disconnect();
      el.removeEventListener("pointerenter", revisar);
      el.removeEventListener("pointerleave", luego);
      el.removeEventListener("focusin", revisar);
      el.removeEventListener("focusout", luego);
    };
  }, [ref]);

  return enCentro || cerca;
}
