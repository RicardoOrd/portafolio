// Mete la página ya renderizada en cada HTML de dist/, en el lugar de <!--app-->:
// index.html en español y en.html en inglés.
import { readFile, rm, writeFile } from "node:fs/promises";

const { render } = await import("../dist-ssr/entry-server.js");
const paginas = [["dist/index.html", "es"], ["dist/en.html", "en"]];
for (const [archivo, idioma] of paginas) {
  const plantilla = await readFile(archivo, "utf8");
  if (!plantilla.includes("<!--app-->")) throw new Error(`${archivo} no trae <!--app-->`);
  await writeFile(archivo, plantilla.replace("<!--app-->", render(idioma)));
}
await rm("dist-ssr", { recursive: true, force: true });
console.log(`Prerender listo: ${paginas.map(([archivo]) => archivo).join(" y ")}`);
