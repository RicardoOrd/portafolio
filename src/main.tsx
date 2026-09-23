import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
// Fuentes servidas desde el propio sitio: sin la ida a Google que bloqueaba el primer dibujo
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/archivo/standard-italic.css";
import "@fontsource/bungee/latin-400.css";
import "@fontsource/caveat-brush/latin-400.css";
import "./styles.css";

const raiz = document.getElementById("app")!;
const app = <StrictMode><App /></StrictMode>;

// En producción el HTML ya viene prerenderizado: React solo lo hidrata
if (raiz.firstElementChild) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
