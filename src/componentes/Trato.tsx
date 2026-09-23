import { useEffect, useRef, useState } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { usePuestoEncendido } from "../luz/usePuestoEncendido";
import { CON_MOVIMIENTO, estaQuieto, gsap, useGSAP } from "../movimiento/gsap";
import { abrirPuesto, colgar } from "../movimiento/entradas";

// Contacto es el último puesto: cierra la venta que la portada puso precio.
// "Copiar correo" usa el portapapeles y un sello de "Apartado" cae sobre "Disponible".

const CORREO = "ricardoordunoc@gmail.com";

export function Trato() {
  const ref = useRef<HTMLElement>(null);
  const correo = useRef<HTMLParagraphElement>(null);
  const trato = useRef<HTMLDivElement>(null);
  const sello = useRef<HTMLSpanElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const encendido = usePuestoEncendido(ref);
  const [aviso, setAviso] = useState("");

  useEffect(() => { pedir(); }, [encendido, pedir]);

  useGSAP(() => {
    gsap.matchMedia().add(CON_MOVIMIENTO, () => {
      const puesto = ref.current;
      if (!puesto || !trato.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: puesto,
          start: "top 88%",
          end: "top 35%",
          scrub: true,
          onUpdate: () => { if (puesto.classList.contains("is-lit")) pedir(); },
        },
      });
      abrirPuesto(tl, puesto, 26);
      colgar(tl, trato.current, -12, 0.35);
    });
  }, { scope: ref });

  // El golpe del sello sacude la cartulina
  const sellar = () => {
    const s = sello.current, t = trato.current;
    if (!s || !t) return;
    if (estaQuieto()) { gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.12 }); return; }
    gsap.timeline()
      .fromTo(s, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 0.94, duration: 0.2, ease: "power2.in" })
      .to(s, { scale: 1, duration: 0.06 })
      .to(t, { y: 4, duration: 0.08, ease: "power1.out" }, 0.2)
      .to(t, { y: 0, duration: 0.24, ease: "expo.out" });
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(CORREO);
      setAviso("Listo, el correo está en tu portapapeles.");
      sellar();
    } catch {
      const el = correo.current;
      if (el) {
        const r = document.createRange(), s = getSelection();
        r.selectNodeContents(el);
        s?.removeAllRanges();
        s?.addRange(r);
      }
      setAviso("No pude copiarlo solo: ya está seleccionado, cópialo con Ctrl+C.");
    }
  };

  return (
    <section id="trato" className={`deal stall${encendido ? " is-lit" : ""}`} ref={ref} tabIndex={-1}>
      <div className="awning"><h2 className="awning__sign">Contacto</h2></div>
      <div className="stall__body deal__body">
        <span className={`foco${encendido ? " on" : ""}`} aria-hidden="true"><i /></span>
        <div className="deal__texto">
          <p className="deal__lead">Busco un equipo donde el detalle de la interfaz importe.</p>
          <p className="deal__sub">Escríbeme por correo o por LinkedIn y platicamos.</p>
          <p className="deal__correo" ref={correo}>{CORREO}</p>
          <div className="deal__actions" ref={casts}>
            <button className="ticket-btn casts" data-shadow="box" type="button" ref={casts} onClick={copiar}>Copiar correo</button>
            <a className="line-btn" href={`mailto:${CORREO}`}>Escribir</a>
            <a className="line-btn" href="https://www.linkedin.com/in/ricardo-orduno-camacho/" target="_blank" rel="noopener">LinkedIn</a>
            <a className="line-btn" href="https://github.com/RicardoOrd" target="_blank" rel="noopener">GitHub</a>
          </div>
          <p className="deal__aviso" role="status" aria-live="polite">{aviso}</p>
        </div>
        <div className="deal__trato tag casts" data-shadow="box" ref={(el) => { trato.current = el; return casts(el); }}>
          <span className="tag__row"><span className="tag__k">Puesto</span><span className="tag__v">Frontend y UI/UX</span></span>
          <span className="tag__row"><span className="tag__k">Precio</span><span className="tag__v">Una entrevista</span></span>
          <span className="tag__row"><span className="tag__k">Estado</span><span className="tag__v tag__v--hot">Disponible</span></span>
          <span className="sello" aria-hidden="true" ref={sello}>Apartado</span>
        </div>
      </div>
    </section>
  );
}
