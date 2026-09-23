# Portafolio · Bazar de sombras

Sitio personal de Ricardo Orduño Camacho. Un tianguis de noche: cada proyecto es
un puesto con su foco, y la luz de los focos proyecta las sombras de la página.

HTML, CSS y JS a mano, sin dependencias ni paso de build.

## Correr en local

Abrir `index.html` en el navegador, o servir la carpeta:

```
npx serve .
```

## Publicar

GitHub Pages publica la rama `main` desde la raíz. Todas las rutas son relativas
porque el sitio vive en `/portafolio/`.

## Editar

- Textos y proyectos: `index.html`. Cada proyecto es un `<article class="stall">`.
- Colores, tipografía y materiales: variables al inicio de `styles.css`.
- Focos, sombras y animaciones: `main.js`. Todo elemento con la clase `casts` y un
  `data-shadow` (`box` o `img`) proyecta sombra desde el foco encendido más cercano.

## Secreto

↑ ↑ ↓ ↓ ← → ← → B A
