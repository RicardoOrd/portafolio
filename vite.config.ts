import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Las fuentes del texto y del rótulo de la primera pantalla se piden desde el <head>,
// sin esperar a que el CSS diga que hacen falta. El plumón (66 KB) no: solo lo usa la
// cartulina y, precargado, le quitaba ancho de banda al texto principal en celular.
function precargarFuentes(): Plugin {
  const primeras = /(archivo-latin-standard-normal|bungee-latin-400-normal)-[\w-]+\.woff2$/;
  return {
    name: "precargar-fuentes",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const tags = Object.keys(ctx.bundle)
          .filter((archivo) => primeras.test(archivo))
          .map((archivo) => ({
            tag: "link",
            attrs: { rel: "preload", href: `./${archivo}`, as: "font", type: "font/woff2", crossorigin: "" },
            injectTo: "head" as const,
          }));
        return { html, tags };
      },
    },
  };
}

// El sitio vive en /portafolio/ dentro de GitHub Pages: todas las rutas son relativas.
// Dos páginas en la misma carpeta, así las rutas relativas sirven igual en las dos:
// index.html en español y en.html en inglés.
export default defineConfig({
  base: "./",
  plugins: [react(), precargarFuentes()],
  build: { rolldownOptions: { input: ["index.html", "en.html"] } },
  // En el prerender, GSAP y Lenis van dentro del paquete: sus módulos no cargan sueltos en Node
  ssr: { noExternal: ["gsap", "@gsap/react", "lenis"] },
});
