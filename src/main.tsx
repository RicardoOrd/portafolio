import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const raiz = document.getElementById("app")!;
const app = <StrictMode><App /></StrictMode>;

// En producción el HTML ya viene prerenderizado: React solo lo hidrata
if (raiz.firstElementChild) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
