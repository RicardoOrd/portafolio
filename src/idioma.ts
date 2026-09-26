import { createContext, useContext } from "react";

// El sitio sale en dos idiomas: index.html en español y en.html en inglés, con el
// mismo código. Cada texto se escribe junto a su traducción: t("Proyectos", "Projects").

export type Idioma = "es" | "en";

export type T = (es: string, en: string) => string;

/** Uno por idioma y siempre el mismo: se puede usar en las dependencias de un efecto */
export const traductores: Record<Idioma, T> = {
  es: (es) => es,
  en: (_, en) => en,
};

/**
 * La otra versión de la página: a dónde lleva el selector de idioma del riel. El archivo
 * es en.html, pero se anuncia como /portafolio/en: GitHub Pages lo sirve sin la extensión.
 */
export const otraVersion: Record<Idioma, { idioma: Idioma; href: string; nombre: string }> = {
  es: { idioma: "en", href: "en", nombre: "English" },
  en: { idioma: "es", href: "./", nombre: "Español" },
};

export const IdiomaContext = createContext<Idioma>("es");

export const useIdioma = () => useContext(IdiomaContext);

export const useT = () => traductores[useIdioma()];
