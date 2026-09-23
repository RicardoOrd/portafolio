// Convierte los originales de imagenes/ a WebP en public/img/, en los anchos que
// usa la página. Se corre a mano cuando cambia una imagen: npm run imagenes
// Los archivos salen sin metadatos.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";

const salida = "public/img";
mkdirSync(salida, { recursive: true });

// [original, anchos, calidad]. Las capturas llevan texto chico: van con más calidad.
const trabajos = [
  ["akora-portada.png", [560, 1080], 86],
  ["pos-comanda.jpg", [560, 1120], 86],
  ["leche-hoy.jpg", [720, 1440], 86],
  ["akora-gatita.png", [227], 82],
  ["ht-poster-0day.png", [512], 80],
  ["ht-mascara-oni.png", [512], 80],
  ["luna-lro.jpg", [168], 78],
];

for (const [original, anchos, quality] of trabajos) {
  const base = original.replace(/\.\w+$/, "");
  for (const ancho of anchos) {
    const destino = `${salida}/${base}-${ancho}.webp`;
    await sharp(`imagenes/${original}`)
      .resize({ width: ancho, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(destino);
    const antes = Math.round(statSync(`imagenes/${original}`).size / 1024);
    console.log(`${destino}: ${Math.round(statSync(destino).size / 1024)} KB (original ${antes} KB)`);
  }
}
