import { useEffect, useRef, useState } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { usePuestoEncendido } from "../luz/usePuestoEncendido";
import { CON_MOVIMIENTO, estaQuieto, gsap, useGSAP } from "../movimiento/gsap";
import { abrirPuesto, colgar } from "../movimiento/entradas";
import { CORREO, GITHUB, LINKEDIN } from "../datos/contacto";
import { useT } from "../idioma";
import { BotonCV } from "./BotonCV";

// Contacto es el último puesto: cierra la venta que la portada puso precio.
// "Copiar correo" usa el portapapeles y un sello de "Apartado" cae sobre "Disponible".

export function Trato() {
  const ref = useRef<HTMLElement>(null);
  const correo = useRef<HTMLParagraphElement>(null);
  const trato = useRef<HTMLDivElement>(null);
  const sello = useRef<HTMLSpanElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const encendido = usePuestoEncendido(ref);
  const [aviso, setAviso] = useState("");
  const t = useT();

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
      setAviso(t("Listo, el correo está en tu portapapeles.", "Done, the email is on your clipboard."));
      sellar();
    } catch {
      const el = correo.current;
      if (el) {
        const r = document.createRange(), s = getSelection();
        r.selectNodeContents(el);
        s?.removeAllRanges();
        s?.addRange(r);
      }
      setAviso(t("No pude copiarlo solo: ya está seleccionado, cópialo con Ctrl+C.", "I couldn't copy it on my own: it's selected, so copy it with Ctrl+C."));
    }
  };

  return (
    <section id="trato" className={`deal stall${encendido ? " is-lit" : ""}`} ref={ref} tabIndex={-1}>
      <div className="awning"><h2 className="awning__sign">{t("Contacto", "Contact")}</h2></div>
      <div className="stall__body deal__body">
        <span className={`foco${encendido ? " on" : ""}`} aria-hidden="true"><i /></span>
        <div className="deal__texto">
          <p className="deal__lead">{t("Busco un equipo donde importe todo el camino, de la interfaz al servidor.", "I'm looking for a team that cares about the whole road, from the interface to the server.")}</p>
          <p className="deal__sub">{t("Escríbeme por correo o por LinkedIn y platicamos. Mi CV está en inglés.", "Email me or message me on LinkedIn and let's talk.")}</p>
          <p className="deal__correo" ref={correo}>{CORREO}</p>
          <div className="deal__actions" ref={casts}>
            <button className="ticket-btn casts" data-shadow="box" type="button" ref={casts} onClick={copiar}>{t("Copiar correo", "Copy email")}</button>
            <a className="line-btn" href={`mailto:${CORREO}`}>{t("Escribir", "Email me")}</a>
            <a className="line-btn" href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
            <a className="line-btn" href={GITHUB} target="_blank" rel="noopener">GitHub</a>
            <BotonCV />
          </div>
          <p className="deal__aviso" role="status" aria-live="polite">{aviso}</p>
        </div>
        <div className="deal__trato tag casts" data-shadow="box" ref={(el) => { trato.current = el; return casts(el); }}>
          <span className="tag__row"><span className="tag__k">{t("Puesto", "Role")}</span><span className="tag__v">Full stack</span></span>
          <span className="tag__row"><span className="tag__k">{t("Precio", "Price")}</span><span className="tag__v">{t("Una entrevista", "One interview")}</span></span>
          <span className="tag__row"><span className="tag__k">{t("Estado", "Status")}</span><span className="tag__v tag__v--hot">{t("Disponible", "Available")}</span></span>
          <span className="sello" aria-hidden="true" ref={sello}>{t("Apartado", "Reserved")}</span>
        </div>
      </div>
    </section>
  );
}
