import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "../movimiento/gsap";
import { otraVersion, useIdioma, useT } from "../idioma";

// El riel: un cable del que cuelgan las secciones como cartulinas. El foco de la
// sección en pantalla se prende solo y el cable de abajo se enciende conforme bajas.
// Al final cuelga el selector de idioma: lleva a la misma sección en la otra versión.

const secciones = [
  { id: "puestos", nombre: ["Proyectos", "Projects"] },
  { id: "comerciante", nombre: ["Sobre mí", "About me"] },
  { id: "inventario", nombre: ["Habilidades", "Skills"] },
  { id: "trato", nombre: ["Contacto", "Contact"] },
] as const;

export function Riel() {
  const riel = useRef<HTMLElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const progreso = useRef<HTMLSpanElement>(null);
  const [actual, setActual] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);
  const t = useT();
  const otra = otraVersion[useIdioma()];

  // Sección actual: la que cruza la mitad de la pantalla. En la portada no hay ninguna.
  useEffect(() => {
    const espia = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) setActual(e.target.id === "inicio" ? null : e.target.id);
    }, { rootMargin: "-45% 0px -50% 0px" });
    for (const id of ["inicio", ...secciones.map((s) => s.id)]) {
      const s = document.getElementById(id);
      if (s) espia.observe(s);
    }
    return () => espia.disconnect();
  }, []);

  // El progreso es estado, no adorno: sigue aunque se pida menos movimiento
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (st) => progreso.current?.style.setProperty("--p", st.progress.toFixed(4)),
    });
  });

  // El menú de celular se enrolla con Escape o al tocar fuera
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setAbierto(false); boton.current?.focus(); }
    };
    const alTocar = (e: MouseEvent) => {
      if (!riel.current?.contains(e.target as Node)) setAbierto(false);
    };
    addEventListener("keydown", alTeclear);
    document.addEventListener("click", alTocar);
    return () => {
      removeEventListener("keydown", alTeclear);
      document.removeEventListener("click", alTocar);
    };
  }, [abierto]);

  return (
    <header
      className={`rail${abierto ? " abierto" : ""}`}
      ref={riel}
      // Si el tabulador sale del menú, el menú se enrolla: nunca tapa lo que tiene el foco
      onBlur={(e) => { if (abierto && !riel.current?.contains(e.relatedTarget as Node | null)) setAbierto(false); }}
    >
      <div className="rail__inner">
        <a className="rail__brand" href="#inicio" aria-label={t("Ricardo Orduño, volver al inicio", "Ricardo Orduño, back to the top")}>
          <span className="rail__lampara" aria-hidden="true" />
          <span className="rail__placa" aria-hidden="true">
            {/* El espacio no se ve (el flex lo ignora), pero hace que el texto diga "Ricardo Orduño" */}
            <span className="rail__nombre">Ricardo</span>{" "}
            <span className="rail__apellido">Orduño</span>
          </span>
        </a>
        <button
          className="rail__menu"
          type="button"
          ref={boton}
          aria-expanded={abierto}
          aria-controls="secciones"
          onClick={() => setAbierto((a) => !a)}
        >
          <span className="rail__foco" aria-hidden="true" />
          <span className="rail__tag">{t("Menú", "Menu")}</span>
        </button>
        <nav className="rail__nav" id="secciones" aria-label={t("Secciones", "Sections")}>
          <span className="rail__cable" aria-hidden="true" />
          {secciones.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={s.id === "trato" ? "rail__deal" : undefined}
              aria-current={actual === s.id ? "location" : undefined}
              onClick={() => setAbierto(false)}
            >
              <span className="rail__foco" aria-hidden="true" />
              <span className="rail__tag">{t(s.nombre[0], s.nombre[1])}</span>
            </a>
          ))}
        </nav>
        <a
          className="rail__idioma"
          href={actual ? `${otra.href}#${actual}` : otra.href}
          hrefLang={otra.idioma}
          lang={otra.idioma}
        >
          <span className="rail__tag">
            <span className="rail__idioma-largo">{otra.nombre}</span>
            <span className="rail__idioma-corto" aria-hidden="true">{otra.idioma.toUpperCase()}</span>
          </span>
        </a>
      </div>
      <div className="rail__progreso" aria-hidden="true"><span ref={progreso} /></div>
    </header>
  );
}
