import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El sitio vive en /portafolio/ dentro de GitHub Pages: todas las rutas son relativas.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // En el prerender, GSAP y Lenis van dentro del paquete: sus módulos no cargan sueltos en Node
  ssr: { noExternal: ["gsap", "@gsap/react", "lenis"] },
});
