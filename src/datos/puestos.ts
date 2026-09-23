// Los puestos del tianguis. Los commits son reales: se sacan de git de cada repo, no se inventan.

export type Objeto = "sticker" | "comanda" | "arete" | "gafete";

export interface Imagen {
  src: string;
  width: number;
  height: number;
  alt: string;
}

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

export const puestos: Puesto[] = [
  {
    id: "akora",
    nombre: "Akora Repostería",
    corto: "Akora",
    objeto: "sticker",
    flip: false,
    origen: "Una repostería de Navojoa",
    commits: 267,
    estado: "En producción",
    caliente: true,
    descripcion:
      "Tienda web y punto de venta: catálogo, carrito, pago en línea con Openpay (BBVA), panel administrativo y POS para tablet. Cobra de verdad. Las imágenes se construyen en GitHub Actions y el servidor solo las baja y las levanta, con respaldo de la base antes de cada despliegue.",
    tecnologias: ["Angular", "NestJS", "PostgreSQL", "Docker", "Caddy", "GitHub Actions"],
    mercancia: {
      tipo: "captura",
      imagen: {
        src: "img/akora-portada.png",
        width: 1080,
        height: 675,
        alt: "Portada de akora.mx: «Postres que enamoran», botones Ver menú y Pedir por WhatsApp, y una galleta con fresas y chocolate.",
      },
      lupa: "Ampliar la captura de akora.mx",
      pie: "Captura de akora.mx en vivo",
      estampa: { src: "img/akora-gatita.png", width: 227, height: 283, alt: "" },
    },
    enlace: { href: "https://akora.mx", texto: "Visitar akora.mx" },
  },
  {
    id: "pos",
    nombre: "POS de taquería",
    corto: "POS",
    objeto: "comanda",
    flip: true,
    origen: "El mostrador de una taquería",
    commits: 29,
    estado: "En producción",
    caliente: true,
    descripcion:
      "La caja con la que cobra una taquería de barbacoa. Toma comandas por asiento en tablet o teléfono, sincroniza entre aparatos en tiempo real y guarda todo en el servidor. Es la segunda versión: reescribí el sistema original para que aguantara el ritmo del mostrador un sábado en la noche.",
    tecnologias: ["Next.js", "TypeScript", "SQLite", "Tailwind", "Vitest"],
    mercancia: {
      tipo: "captura",
      imagen: {
        src: "img/pos-comanda.jpg",
        width: 1120,
        height: 1000,
        alt: "Caja del POS tomando la orden de la mesa 2: menú de barbacoa, dorados y quesadillas a la izquierda; a la derecha la orden por asiento con total de 260 pesos y el botón Cobrar.",
      },
      lupa: "Ampliar la captura de la caja",
      pie: "La caja corriendo en local, con el menú real del cartel",
    },
  },
  {
    id: "sistema-de-leche",
    nombre: "Sistema de Leche",
    corto: "Leche",
    objeto: "arete",
    flip: false,
    origen: "Un rancho lechero",
    commits: 25,
    estado: "Rediseño en curso",
    caliente: false,
    descripcion:
      "App de escritorio para Windows que administra un hato lechero: padrón animal, reproducción, producción, sanidad con control de retiros, insumos y costos. Funciona sin internet, con la base en la computadora del rancho.",
    tecnologias: ["Electron", "TypeScript", "Drizzle ORM", "SQLite"],
    mercancia: {
      tipo: "captura",
      imagen: {
        src: "img/leche-hoy.jpg",
        width: 1440,
        height: 900,
        alt: "Pantalla Hoy de Sistema de Leche: 679 litros al tanque en dos ordeños, aviso de la vaca 214 en retiro de medicamento, pendientes de reproducción y cómo va el rancho.",
      },
      lupa: "Ampliar la captura de Sistema de Leche",
      pie: "La app corriendo en local, con un hato de demostración",
    },
  },
  {
    id: "hacker-tycoon",
    nombre: "Hacker Tycoon",
    corto: "Tycoon",
    objeto: "gafete",
    flip: true,
    origen: "La Ciudad de Neón, en Roblox",
    commits: 61,
    estado: "En desarrollo",
    caliente: false,
    descripcion:
      "Juego tycoon con tema de hackers: levantas un búnker de cuatro plantas, compras máquinas que producen y sales a robar la bóveda de otros jugadores mientras defiendes la tuya. Economía, progresión y diseño documentados de principio a fin.",
    tecnologias: ["Luau", "Rojo", "Wally", "Selene", "StyLua"],
    mercancia: {
      tipo: "recortes",
      recortes: [
        {
          clase: "cut--poster",
          src: "img/ht-poster-0day.png",
          width: 512,
          height: 716,
          alt: "Póster del juego: un candado cian roto sobre salpicaduras rojas.",
        },
        {
          clase: "cut--mask",
          src: "img/ht-mascara-oni.png",
          width: 512,
          height: 256,
          alt: "Máscara oni del juego, con cuernos y ojos rojos encendidos.",
        },
      ],
      pie: "Arte final del juego",
    },
  },
];

/** Suma de los commits de todos los puestos, redondeada hacia abajo a la decena: "380+" */
export const commitsTotales = `${Math.floor(puestos.reduce((s, p) => s + p.commits, 0) / 10) * 10}+`;
