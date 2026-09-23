import type { Objeto } from "../datos/puestos";

// Cómo abre un puesto al llegar a él. Todo va atado al scroll (scrub): si te detienes,
// el puesto se queda a medio abrir; si regresas, se vuelve a cerrar. Sin JavaScript
// o con "reducir movimiento" no se crea nada y el puesto ya está abierto.

type Linea = gsap.core.Timeline;

/** El toldo se desenrolla y el foco baja por su cable hasta quedar colgado */
export function abrirPuesto(tl: Linea, puesto: HTMLElement, cable: number) {
  const toldo = puesto.querySelector(".awning");
  const foco = puesto.querySelector(".stall__body > .foco");
  if (toldo) {
    tl.fromTo(toldo, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% -10% 0%)", duration: 0.4, ease: "power1.out" }, 0);
  }
  if (foco) {
    tl.fromTo(foco, { "--cable": "0px" }, { "--cable": `${cable}px`, duration: 0.3, ease: "power2.out" }, 0.3);
  }
}

/** La mercancía se sube al mostrador desde abajo */
export function subirMercancia(tl: Linea, mercancia: Element) {
  tl.fromTo(mercancia, { y: 64 }, { y: 0, duration: 0.55, ease: "power2.out" }, 0.15);
}

/** Cada objeto llega como llega en su mundo; la rotación final es la de su CSS */
export const colocarObjeto: Record<Objeto, (tl: Linea, el: Element) => void> = {
  // Akora: la etiqueta se pega en la caja de un manotazo
  sticker: (tl, el) => {
    tl.from(el, { scale: 1.3, rotation: "-=16", duration: 0.4, ease: "power3.out" }, 0.45);
  },
  // POS: la comanda sale de la impresora térmica, de arriba hacia abajo
  comanda: (tl, el) => {
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "steps(14)" }, 0.4);
  },
  // Sistema de Leche: el arete se columpia desde su ojal hasta quedarse quieto
  arete: (tl, el) => {
    tl.fromTo(el, { rotation: 21 }, { rotation: -10, duration: 0.2, ease: "sine.inOut" }, 0.35)
      .to(el, { rotation: 2, duration: 0.15, ease: "sine.inOut" })
      .to(el, { rotation: -3, duration: 0.12, ease: "sine.out" });
  },
  // Hacker Tycoon: el gafete cae de su cordón
  gafete: (tl, el) => {
    tl.from(el, { y: -70, rotation: "+=7", duration: 0.45, ease: "power3.out" }, 0.4);
  },
};

/** Algo que cuelga de un foco (la cartulina de Sobre mí, la de Contacto) se mece hasta su lugar */
export function colgar(tl: Linea, el: Element, desde: number, posicion: number) {
  tl.fromTo(el, { rotation: desde, y: -24 }, { rotation: 0, y: 0, duration: 0.5, ease: "back.out(1.4)" }, posicion);
}
