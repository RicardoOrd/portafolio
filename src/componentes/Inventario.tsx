import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useCasts } from "../luz/Luz";
import { Rotulo } from "./Rotulo";

// Habilidades: una cartulina a todo lo ancho con los precios a tratar. Lo más fuerte
// lleva una marca de plumón rojo que se barre la primera vez que ves la lista.

type Articulo = string | { texto: string; marca: "circulo" | "raya" };

const inventario: { clave: string; articulos: Articulo[] }[] = [
  {
    clave: "Interfaz",
    articulos: [
      { texto: "TypeScript", marca: "circulo" }, { texto: "React", marca: "circulo" }, "Next.js",
      { texto: "Angular", marca: "circulo" }, "RxJS", "Zustand", "TanStack Query", "Tailwind", "Vite", "HTML y CSS a mano",
    ],
  },
  {
    clave: "Movimiento",
    articulos: [
      "Transiciones y animación en CSS y JavaScript",
      { texto: "luz y sombras calculadas en vivo", marca: "raya" },
      "respeto a quien pide menos movimiento",
    ],
  },
  { clave: "Backend", articulos: ["Java con Spring Boot", "Node.js", "NestJS", "Python", "API REST", "tiempo real con WebSockets y Socket.IO"] },
  { clave: "Datos", articulos: ["PostgreSQL", "SQLite", "Prisma", "Drizzle ORM", "IndexedDB con Dexie para trabajar sin conexión", "respaldos y recuperación"] },
  { clave: "Seguridad y calidad", articulos: ["JWT y Passport", "Argon2 y bcrypt", "validación con Zod", "pruebas con Jest, Vitest, Supertest y Karma", "monitoreo con Sentry y Pino"] },
  { clave: "Servicios", articulos: ["Pagos con Openpay", "imágenes con Cloudinary", "correo con Resend"] },
  { clave: "Servidor", articulos: ["Docker", "Caddy", "nginx", "GitHub Actions", "Oracle Cloud", "Vercel", "Linux"] },
  { clave: "Juegos y escritorio", articulos: ["Roblox con Luau", "Rojo", "Wally", "Electron"] },
  { clave: "Oficio", articulos: ["Git con ramas y pull requests", "revisión de código", "PowerShell y Bash"] },
];

// Un círculo a mano alzada y una raya ondulada: se barren, así no dependen del largo del trazo
const trazos = {
  circulo: { caja: "0 0 100 40", d: "M10 24 C 6 8, 90 2, 95 18 C 99 33, 30 40, 8 30 C 1 25, 12 12, 42 9" },
  raya: { caja: "0 0 100 10", d: "M1 6 C 20 3, 40 8, 60 5 S 90 3, 99 6" },
};

function Marcado({ texto, marca, orden }: { texto: string; marca: "circulo" | "raya"; orden: number }) {
  const t = trazos[marca];
  return (
    <span className={`marcado${marca === "raya" ? " marcado--raya" : ""}`} style={{ "--i": orden } as CSSProperties}>
      {texto}
      <svg className="marca" viewBox={t.caja} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path pathLength={1} d={t.d} />
      </svg>
    </span>
  );
}

export function Inventario() {
  const lista = useRef<HTMLDivElement>(null);
  const casts = useCasts();
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const vista = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisto(true); vista.disconnect(); }
    }, { threshold: 0.35 });
    vista.observe(el);
    return () => vista.disconnect();
  }, []);

  let orden = 0;
  return (
    <section id="inventario" className="inventory" tabIndex={-1}>
      <Rotulo>Habilidades</Rotulo>
      <div
        className={`ledger casts${visto ? " visto" : ""}`}
        data-shadow="box"
        id="lista"
        ref={(el) => { lista.current = el; return casts(el); }}
      >
        <p className="ledger__note">Precios a tratar</p>
        <dl>
          {inventario.map(({ clave, articulos }) => (
            <div className="ledger__row" key={clave}>
              <dt>{clave}</dt>
              <dd>
                {articulos.map((a, i) => (
                  <Fragment key={typeof a === "string" ? a : a.texto}>
                    {i > 0 && " · "}
                    {typeof a === "string" ? a : <Marcado texto={a.texto} marca={a.marca} orden={orden++} />}
                  </Fragment>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
