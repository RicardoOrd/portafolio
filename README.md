# Portafolio · Bazar de sombras

Sitio personal de Ricardo Orduño Camacho. Un tianguis de noche: cada proyecto es
un puesto con su foco, y la luz de los focos proyecta las sombras de la página.

React 19 con TypeScript y Vite. El movimiento ligado al scroll es de GSAP
(ScrollTrigger) y la rueda se desliza con Lenis. La página se prerenderiza al
construir, así que se lee completa aun sin JavaScript.

## Correr en local

```
npm install
npm run dev
```

Para ver la versión de producción, con el HTML prerenderizado:

```
npm run build
npm run preview
```

## Publicar

GitHub Actions construye el sitio en cada pull request y lo publica en GitHub
Pages al fusionar a `main` (`.github/workflows/publicar.yml`). Las rutas son
relativas (`base: "./"`) porque el sitio vive en `/portafolio/`.

## Editar

- Idiomas: `index.html` es la versión en español y `en.html` la de inglés, que se
  publica como `/portafolio/en` (GitHub Pages la sirve sin la extensión). Cada
  texto va junto a su traducción, `t("Proyectos", "Projects")` (`src/idioma.ts`);
  al cambiar un texto, cambia los dos.
- CV: `public/ricardo-orduno-camacho-cv.pdf`. Para actualizarlo, reemplaza ese
  archivo con el mismo nombre.
- Proyectos: `src/datos/puestos.ts`. Los commits de cada cartulina son reales.
- Secciones: `src/componentes/`, una por archivo.
- Colores, tipografía y materiales: variables al inicio de `src/styles.css`. Las
  fuentes (Archivo, Bungee y Caveat Brush) se sirven desde el sitio con Fontsource.
- Imágenes: los originales viven en `imagenes/`; `npm run imagenes` genera los WebP
  de `public/img/` en los anchos que usa la página. `public/og.jpg` es la captura de
  la portada que se ve al compartir el enlace.
- Luz y sombras: `src/luz/`. Todo elemento con la clase `casts`, un `data-shadow`
  (`box` o `img`) y el ref de `useCasts()` proyecta sombra desde el foco
  encendido más cercano.
- Movimiento: `src/movimiento/`. `entradas.ts` dice cómo abre cada puesto al
  llegar; `Paseo.tsx` maneja Lenis y los enlaces internos. Todo lo que se mueve
  por gusto va dentro de `gsap.matchMedia()` con "reducir movimiento" en cuenta.

## Secreto

↑ ↑ ↓ ↓ ← → ← → B A
