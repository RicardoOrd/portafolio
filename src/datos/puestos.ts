// Los puestos del tianguis. Los commits son reales: `git rev-list --all --count` en cada
// repo (todas sus ramas), no se inventan. Último conteo: 2026-09-23.
// Cada texto va en español y en inglés, uno junto al otro: t("español", "English").

import { traductores, type Idioma, type T } from "../idioma";

export type Objeto = "sticker" | "comanda" | "arete" | "gafete";

export interface Imagen {
  /** El ancho más grande: es el que abre el visor */
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
}

/** Una captura en WebP con sus anchos (los genera scripts/imagenes.mjs) */
const webp = (nombre: string, anchos: number[]) => ({
  src: `img/${nombre}-${Math.max(...anchos)}.webp`,
  srcSet: anchos.map((a) => `img/${nombre}-${a}.webp ${a}w`).join(", "),
});

export type Mercancia =
  | { tipo: "captura"; imagen: Imagen; lupa: string; pie: string; estampa?: Imagen }
  | { tipo: "recortes"; recortes: (Imagen & { clase: string })[]; pie: string };

export interface Puesto {
  id: string;
  nombre: string;
  /** Cómo se lee en la calle de la portada cuando no cabe el nombre completo */
  corto: string;
  objeto: Objeto;
  flip: boolean;
  origen: string;
  commits: number;
  estado: string;
  /** "En producción": el estado va en rojo de rotulista */
  caliente: boolean;
  descripcion: string;
  tecnologias: string[];
  mercancia: Mercancia;
  enlace?: { href: string; texto: string };
}

const armar = (t: T): Puesto[] => [
  {
    id: "akora",
    nombre: "Akora Repostería",
    corto: "Akora",
    objeto: "sticker",
    flip: false,
    origen: t("Una repostería de Navojoa", "A pastry shop in Navojoa"),
    commits: 273,
    estado: t("En producción", "In production"),
    caliente: true,
    descripcion: t(
      "La hice de cero hasta producción y la sigo manteniendo. Tienda web y punto de venta: catálogo, carrito, pagos con Openpay (BBVA), panel administrativo y POS para tablet, en Angular. Detrás, una API en NestJS con PostgreSQL y Prisma, en contenedores Docker detrás de Caddy con HTTPS. Cada cambio pasa por lint, pruebas y build en GitHub Actions; Sentry avisa de errores y un vigilante externo revisa cada 10 minutos que la tienda responda. La mudé de DigitalOcean a Oracle Cloud.",
      "I built it from scratch to production and I still maintain it. Online store and point of sale: catalog, cart, Openpay (BBVA) payments, an admin panel and a tablet POS, in Angular. Behind it, a NestJS API with PostgreSQL and Prisma, in Docker containers behind Caddy with HTTPS. Every change goes through lint, tests and a build on GitHub Actions; Sentry reports errors and an outside monitor checks every 10 minutes that the store is up. I moved it from DigitalOcean to Oracle Cloud.",
    ),
    tecnologias: ["Angular", "NestJS", "PostgreSQL", "Prisma", "Docker", "Caddy", "GitHub Actions", "Sentry"],
    mercancia: {
      tipo: "captura",
      imagen: {
        ...webp("akora-portada", [560, 1080]),
        width: 1080,
        height: 675,
        alt: t(
          "Portada de akora.mx: «Postres que enamoran», botones Ver menú y Pedir por WhatsApp, y una galleta con fresas y chocolate.",
          "The akora.mx home page: “Postres que enamoran” (desserts to fall in love with), buttons to see the menu and order on WhatsApp, and a cookie with strawberries and chocolate.",
        ),
      },
      lupa: t("Ampliar la captura de akora.mx", "Enlarge the akora.mx screenshot"),
      pie: t("Captura de akora.mx en vivo", "Live screenshot of akora.mx"),
      estampa: { src: "img/akora-gatita-227.webp", width: 227, height: 283, alt: "" },
    },
    enlace: { href: "https://akora.mx", texto: t("Visitar akora.mx", "Visit akora.mx") },
  },
  {
    id: "pos",
    nombre: t("POS de taquería", "Taquería POS"),
    corto: "POS",
    objeto: "comanda",
    flip: true,
    origen: t("El mostrador de una taquería", "A taquería's front counter"),
    commits: 29,
    estado: t("En producción", "In production"),
    caliente: true,
    descripcion: t(
      "La caja con la que cobra una taquería de barbacoa. Toma comandas por asiento en tablet o teléfono, sincroniza entre aparatos en tiempo real y guarda todo en el servidor. Es la segunda versión: reescribí el sistema original para que aguantara el ritmo del mostrador un sábado en la noche.",
      "The register a barbacoa taquería rings up every order on. It takes orders by seat on a tablet or phone, syncs across devices in real time and keeps everything on the server. It's the second version: I rewrote the original system so it could keep up with the counter on a Saturday night.",
    ),
    tecnologias: ["Next.js", "TypeScript", "SQLite", "Tailwind", "Vitest"],
    mercancia: {
      tipo: "captura",
      imagen: {
        ...webp("pos-comanda", [560, 1120]),
        width: 1120,
        height: 1000,
        alt: t(
          "Caja del POS tomando la orden de la mesa 2: menú de barbacoa, dorados y quesadillas a la izquierda; a la derecha la orden por asiento con total de 260 pesos y el botón Cobrar.",
          "The POS register taking the order for table 2: a menu of barbacoa, dorados and quesadillas on the left; on the right, the order by seat with a 260-peso total and the Cobrar (charge) button.",
        ),
      },
      lupa: t("Ampliar la captura de la caja", "Enlarge the register screenshot"),
      pie: t("La caja corriendo en local, con el menú real del cartel", "The register running locally, with the real menu off the wall sign"),
    },
  },
  {
    id: "sistema-de-leche",
    nombre: "Sistema de Leche",
    corto: t("Leche", "Dairy"),
    objeto: "arete",
    flip: false,
    origen: t("Un rancho lechero", "A dairy ranch"),
    commits: 25,
    estado: t("Rediseño en curso", "Redesign in progress"),
    caliente: false,
    descripcion: t(
      "App de escritorio para Windows que administra un hato lechero: padrón animal, reproducción, producción, sanidad con control de retiros, insumos y costos. Funciona sin internet, con la base en la computadora del rancho.",
      "A Windows desktop app that runs a dairy herd: animal registry, reproduction, milk production, health with medication withdrawal tracking, supplies and costs. It works without internet, with the database on the ranch's own computer.",
    ),
    tecnologias: ["Electron", "TypeScript", "Drizzle ORM", "SQLite"],
    mercancia: {
      tipo: "captura",
      imagen: {
        ...webp("leche-hoy", [720, 1440]),
        width: 1440,
        height: 900,
        alt: t(
          "Pantalla Hoy de Sistema de Leche: 679 litros al tanque en dos ordeños, aviso de la vaca 214 en retiro de medicamento, pendientes de reproducción y cómo va el rancho.",
          "The Today screen of Sistema de Leche: 679 liters into the tank over two milkings, an alert for cow 214 in medication withdrawal, pending reproduction tasks and how the ranch is doing.",
        ),
      },
      lupa: t("Ampliar la captura de Sistema de Leche", "Enlarge the Sistema de Leche screenshot"),
      pie: t("La app corriendo en local, con un hato de demostración", "The app running locally, with a demo herd"),
    },
  },
  {
    id: "hacker-tycoon",
    nombre: "Hacker Tycoon",
    corto: "Tycoon",
    objeto: "gafete",
    flip: true,
    origen: t("La Ciudad de Neón, en Roblox", "Neon City, on Roblox"),
    commits: 64,
    estado: t("En desarrollo", "In development"),
    caliente: false,
    descripcion: t(
      "Juego tycoon con tema de hackers: levantas un búnker de cuatro plantas, compras máquinas que producen y sales a robar la bóveda de otros jugadores mientras defiendes la tuya. Economía, progresión y diseño documentados de principio a fin.",
      "A hacker-themed tycoon game: you build a four-floor bunker, buy machines that produce, and head out to raid other players' vaults while you defend your own. Economy, progression and design documented from start to finish.",
    ),
    tecnologias: ["Luau", "Rojo", "Wally", "Selene", "StyLua"],
    mercancia: {
      tipo: "recortes",
      recortes: [
        {
          clase: "cut--poster",
          src: "img/ht-poster-0day-512.webp",
          width: 512,
          height: 716,
          alt: t("Póster del juego: un candado cian roto sobre salpicaduras rojas.", "Game poster: a broken cyan padlock over red splatters."),
        },
        {
          clase: "cut--mask",
          src: "img/ht-mascara-oni-512.webp",
          width: 512,
          height: 256,
          alt: t("Máscara oni del juego, con cuernos y ojos rojos encendidos.", "The game's oni mask, with horns and glowing red eyes."),
        },
      ],
      pie: t("Arte final del juego", "Final game art"),
    },
  },
];

export const puestos: Record<Idioma, Puesto[]> = { es: armar(traductores.es), en: armar(traductores.en) };

/** Suma de los commits de todos los puestos, redondeada hacia abajo a la decena: "380+" */
export const commitsTotales = `${Math.floor(puestos.es.reduce((s, p) => s + p.commits, 0) / 10) * 10}+`;
