// Mete la página ya renderizada en dist/index.html, en el lugar de <!--app-->.
import { readFile, rm, writeFile } from "node:fs/promises";

const { render } = await import("../dist-ssr/entry-server.js");
const plantilla = await readFile("dist/index.html", "utf8");
if (!plantilla.includes("<!--app-->")) throw new Error("dist/index.html no trae <!--app-->");
await writeFile("dist/index.html", plantilla.replace("<!--app-->", render()));
await rm("dist-ssr", { recursive: true, force: true });
console.log("Prerender listo: dist/index.html");
