# Portafolio · Bazar de sombras

Sitio personal de Ricardo Orduño Camacho. Un bazar nocturno: cada proyecto es un
puesto, la luna es la única luz y todo recalcula su sombra en vivo según dónde
esté la luna.

HTML, CSS y JS a mano, sin dependencias ni paso de build.

## Correr en local

Abrir `index.html` en el navegador, o servir la carpeta:

```
npx serve .
```

## Publicar

Cualquier hosting estático sirve tal cual (Vercel, Netlify, GitHub Pages): la raíz
del sitio es la raíz del repo. `.impeccable/` y `PRODUCT.md` son material de
diseño y no hace falta publicarlos.

## Editar

- Textos y proyectos: `index.html`. Cada proyecto es un `<article class="stall">`.
- Colores, tipografía y materiales: variables al inicio de `styles.css`.
- La luna y las sombras: `main.js`. Todo elemento con la clase `casts` y un
  `data-shadow` (`text`, `box` o `img`) proyecta sombra.
- Imágenes en `img/`; cada PNG lleva su origen incrustado
  (`impeccable embed-prompt --read img/<archivo>`).

## Secreto

↑ ↑ ↓ ↓ ← → ← → B A
