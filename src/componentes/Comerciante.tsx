import { useEffect, useRef, useState } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { CON_MOVIMIENTO, gsap, useGSAP } from "../movimiento/gsap";
import { colgar } from "../movimiento/entradas";
import { Rotulo } from "./Rotulo";
import { useT } from "../idioma";

// Sobre mí: la frase en cartulina bajo un foco que se prende a mano.
// Al llegar, el foco baja por su cable y la cartulina se mece hasta quedar colgada.

export function Comerciante() {
  const ref = useRef<HTMLElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const [prendido, setPrendido] = useState(false);
  const t = useT();

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
      <Rotulo>{t("Sobre mí", "About me")}</Rotulo>
      <div className="merchant__body">
        <figure className="merchant__cartel">
          <button
            className={`foco${prendido ? " on" : ""}`}
            type="button"
            aria-pressed={prendido}
            aria-label={t("Foco del cartel", "Sign bulb")}
            onClick={() => setPrendido((p) => !p)}
          >
            <i />
          </button>
          <blockquote className="merchant__quote tag casts" data-shadow="box" ref={casts}>
            <p>{t("Me importa que el sistema aguante el sábado a las nueve de la noche, con fila en el mostrador.", "What I care about is the system holding up at nine on a Saturday night, with a line at the counter.")}</p>
          </blockquote>
          <figcaption className="merchant__pista">{t("Prende el foco.", "Turn on the bulb.")}</figcaption>
        </figure>
        <div className="merchant__text">
          <p>{t(
            "Soy Ricardo Orduño Camacho, desarrollador full stack. Me obsesiona el detalle: cuánto tarda una transición, dónde cae una sombra, qué siente alguien que cobra con prisa en un mostrador. Por eso no me quedo en la interfaz: también hago lo que la sostiene, la base de datos, el backend, el servidor y el despliegue, y me quedo a mantenerlo cuando ya está cobrando.",
            "I'm Ricardo Orduño Camacho, a full stack developer. I'm obsessed with detail: how long a transition takes, where a shadow falls, how it feels to ring someone up in a hurry at a counter. That's why I don't stop at the interface: I also build what holds it up, the database, the backend, the server and the deployment, and I stay on to maintain it once it's taking payments.",
          )}</p>
          <p>{t(
            "Vengo de los videojuegos, y se nota: pienso en ritmo, en recompensas y en que tocar algo se sienta bien. Esta página es un ejemplo: los focos los prendes tú.",
            "I come from video games, and it shows: I think about rhythm, rewards and making things feel good to touch. This page is one example: you're the one who turns on the lights.",
          )}</p>
        </div>
      </div>
    </section>
  );
}
