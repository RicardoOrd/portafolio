import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { usePaseo } from "../movimiento/Paseo";
import { estaQuieto } from "../movimiento/gsap";
import { useT } from "../idioma";

// Las capturas se toman del puesto para verlas de cerca: la imagen sale de su lugar
// hacia el visor con View Transitions y regresa al cerrar. Sin soporte, abre directo.

interface Visor {
  abrir(boton: HTMLButtonElement): void;
}

const VisorContext = createContext<Visor | null>(null);

const transicion = (cambio: () => void) =>
  "startViewTransition" in document && !estaQuieto()
    ? document.startViewTransition(cambio).finished.catch(() => {})
    : Promise.resolve(cambio());

export function VisorProvider({ children }: { children: ReactNode }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const foto = useRef<HTMLImageElement>(null);
  const origen = useRef<HTMLButtonElement | null>(null);
  const paseo = usePaseo();
  const t = useT();

  // El cambio de la transición tiene que ser síncrono: el visor se maneja directo en el DOM
  const [visor] = useState(() => ({
    abrir(boton: HTMLButtonElement) {
      const img = boton.querySelector("img");
      const d = dialogo.current, f = foto.current;
      if (!img || !d || !f) return;
      origen.current = boton;
      // El src es la versión más grande; la de la página puede ser una chica del srcset
      f.src = img.src;
      f.alt = img.alt;
      f.width = Number(img.getAttribute("width")) || img.naturalWidth;
      f.height = Number(img.getAttribute("height")) || img.naturalHeight;
      paseo.pausar(true);
      img.style.viewTransitionName = "captura";
      transicion(() => {
        img.style.viewTransitionName = "";
        f.style.viewTransitionName = "captura";
        d.showModal();
      }).then(() => { f.style.viewTransitionName = ""; });
    },
    cerrar() {
      const d = dialogo.current, f = foto.current;
      if (!d?.open || !f) return;
      const img = origen.current?.querySelector("img");
      f.style.viewTransitionName = "captura";
      transicion(() => {
        f.style.viewTransitionName = "";
        d.close();
        if (img) img.style.viewTransitionName = "captura";
      }).then(() => {
        if (img) img.style.viewTransitionName = "";
        paseo.pausar(false);
        origen.current?.focus();
      });
    },
  }));

  return (
    <VisorContext value={visor}>
      {children}
      <dialog
        className="visor"
        aria-label={t("Captura ampliada", "Enlarged screenshot")}
        ref={dialogo}
        data-lenis-prevent
        onCancel={(e) => { e.preventDefault(); visor.cerrar(); }}
        onClick={(e) => {
          const t = e.target as Element;
          if (t === e.currentTarget || t.classList.contains("visor__lienzo")) visor.cerrar();
        }}
      >
        <button className="visor__cerrar" type="button" onClick={visor.cerrar}>{t("Cerrar", "Close")}</button>
        <div className="visor__lienzo"><img ref={foto} alt="" src="data:," decoding="async" /></div>
      </dialog>
    </VisorContext>
  );
}

export function useVisor() {
  const visor = useContext(VisorContext);
  if (!visor) throw new Error("useVisor va dentro de <VisorProvider>");
  return visor;
}
