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

- Proyectos: `src/datos/puestos.ts`. Los commits de cada cartulina son reales.
- Secciones: `src/componentes/`, una por archivo.
- Colores, tipografía y materiales: variables al inicio de `src/styles.css`.
- Luz y sombras: `src/luz/`. Todo elemento con la clase `casts`, un `data-shadow`
  (`box` o `img`) y el ref de `useCasts()` proyecta sombra desde el foco
  encendido más cercano.
- Movimiento: `src/movimiento/`. `entradas.ts` dice cómo abre cada puesto al
  llegar; `Paseo.tsx` maneja Lenis y los enlaces internos. Todo lo que se mueve
  por gusto va dentro de `gsap.matchMedia()` con "reducir movimiento" en cuenta.

## Secreto

↑ ↑ ↓ ↓ ← → ← → B A
