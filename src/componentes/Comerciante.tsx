import { useEffect, useRef, useState } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { CON_MOVIMIENTO, gsap, useGSAP } from "../movimiento/gsap";
import { colgar } from "../movimiento/entradas";
import { Rotulo } from "./Rotulo";

// Sobre mí: la frase en cartulina bajo un foco que se prende a mano.
// Al llegar, el foco baja por su cable y la cartulina se mece hasta quedar colgada.

export function Comerciante() {
  const ref = useRef<HTMLElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const [prendido, setPrendido] = useState(false);

  useEffect(() => { pedir(); }, [prendido, pedir]);

  useGSAP(() => {
    gsap.matchMedia().add(CON_MOVIMIENTO, () => {
      const cartel = ref.current?.querySelector(".merchant__cartel");
      const foco = cartel?.querySelector(".foco");
      const frase = cartel?.querySelector(".merchant__quote");
      if (!cartel || !foco || !frase) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cartel,
          start: "top 85%",
          end: "top 40%",
          scrub: true,
          onUpdate: () => { if (ref.current?.classList.contains("is-lit")) pedir(); },
        },
      });
      tl.fromTo(foco, { "--cable": "0px" }, { "--cable": "30px", duration: 0.35, ease: "power2.out" }, 0);
      colgar(tl, frase, 9, 0.15);
    });
  }, { scope: ref });

  return (
    <section id="comerciante" className={`merchant${prendido ? " is-lit" : ""}`} ref={ref} tabIndex={-1}>
      <Rotulo>Sobre mí</Rotulo>
      <div className="merchant__body">
        <figure className="merchant__cartel">
          <button
            className={`foco${prendido ? " on" : ""}`}
            type="button"
            aria-pressed={prendido}
            aria-label="Foco del cartel"
            onClick={() => setPrendido((p) => !p)}
          >
            <i />
          </button>
          <blockquote className="merchant__quote tag casts" data-shadow="box" ref={casts}>
            <p>Me importa que el sistema aguante el sábado a las nueve de la noche, con fila en el mostrador.</p>
          </blockquote>
          <figcaption className="merchant__pista">Prende el foco.</figcaption>
        </figure>
        <div className="merchant__text">
          <p>Soy Ricardo Orduño Camacho. Me obsesiona el detalle: cuánto tarda una transición, dónde cae una sombra, qué siente alguien que cobra con prisa en un mostrador. Por eso diseño la interfaz y también todo lo que la sostiene: la base de datos, el backend, el servidor y el despliegue.</p>
          <p>Vengo de los videojuegos, y se nota: pienso en ritmo, en recompensas y en que tocar algo se sienta bien. Esta página es un ejemplo: los focos los prendes tú.</p>
        </div>
      </div>
    </section>
  );
}
