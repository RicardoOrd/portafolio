import { CV } from "../datos/contacto";
import { useT } from "../idioma";

// El CV en PDF se descarga directo, con su nombre de archivo. Está en inglés en las
// dos versiones de la página: hrefLang se lo dice al navegador y al lector de pantalla.

export function BotonCV() {
  const t = useT();
  return (
    <a className="line-btn line-btn--cv" href={CV.href} download={CV.archivo} type="application/pdf" hrefLang="en">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M8 2.5v7.5M4.75 6.75 8 10l3.25-3.25M3 13.5h10" />
      </svg>
      {t("Descargar CV", "Download CV")}
    </a>
  );
}
