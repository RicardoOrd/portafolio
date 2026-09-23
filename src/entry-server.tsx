import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

// Lo usa scripts/prerender.mjs: la página sale en el HTML y se lee aun sin JavaScript
export const render = () => renderToString(<StrictMode><App /></StrictMode>);
