import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useCasts } from "../luz/Luz";
import { Rotulo } from "./Rotulo";
import { useT, type T } from "../idioma";

// Habilidades: una cartulina a todo lo ancho con los precios a tratar. Lo más fuerte
// lleva una marca de plumón rojo que se barre la primera vez que ves la lista.

type Articulo = string | { texto: string; marca: "circulo" | "raya" };

const inventario = (t: T): { clave: string; articulos: Articulo[] }[] => [
  {
    clave: t("Interfaz", "Frontend"),
    articulos: [
      { texto: "TypeScript", marca: "circulo" }, { texto: "React", marca: "circulo" }, "Next.js",
      { texto: "Angular", marca: "circulo" }, "RxJS", "Zustand", "TanStack Query", "Tailwind", "Vite", t("HTML y CSS a mano", "hand-written HTML and CSS"),
    ],
  },
  {
    clave: t("Movimiento", "Motion"),
    articulos: [
      t("Transiciones y animación en CSS y JavaScript", "Transitions and animation in CSS and JavaScript"),
      { texto: t("luz y sombras calculadas en vivo", "light and shadows computed live"), marca: "raya" },
      t("respeto a quien pide menos movimiento", "respect for anyone who asks for less motion"),
    ],
  },
  {
    clave: "Backend",
    articulos: [
      t("Java con Spring Boot", "Java with Spring Boot"), "Node.js", "NestJS", "Python", t("API REST", "REST APIs"),
      t("tiempo real con WebSockets y Socket.IO", "real time with WebSockets and Socket.IO"),
    ],
  },
  {
    clave: t("Datos", "Data"),
    articulos: [
      "PostgreSQL", "SQLite", "Prisma", "Drizzle ORM",
      t("IndexedDB con Dexie para trabajar sin conexión", "IndexedDB with Dexie for offline work"), t("respaldos y recuperación", "backups and recovery"),
    ],
  },
  {
    clave: t("Seguridad y calidad", "Security and quality"),
    articulos: [
      t("JWT y Passport", "JWT and Passport"), t("Argon2 y bcrypt", "Argon2 and bcrypt"), t("validación con Zod", "validation with Zod"),
      t("pruebas con Jest, Vitest, Supertest y Karma", "testing with Jest, Vitest, Supertest and Karma"), t("monitoreo con Sentry y Pino", "monitoring with Sentry and Pino"),
    ],
  },
  {
    clave: t("Servicios", "Services"),
    articulos: [t("Pagos con Openpay", "Payments with Openpay"), t("imágenes con Cloudinary", "images with Cloudinary"), t("correo con Resend", "email with Resend")],
  },
  { clave: t("Servidor", "Servers"), articulos: ["Docker", "Caddy", "nginx", "GitHub Actions", "Oracle Cloud", "Vercel", "Linux"] },
  { clave: t("Juegos y escritorio", "Games and desktop"), articulos: [t("Roblox con Luau", "Roblox with Luau"), "Rojo", "Wally", "Electron"] },
  {
    clave: t("Oficio", "Craft"),
    articulos: [t("Git con ramas y pull requests", "Git with branches and pull requests"), t("revisión de código", "code review"), t("PowerShell y Bash", "PowerShell and Bash")],
  },
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
  const t = useT();

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
      <Rotulo>{t("Habilidades", "Skills")}</Rotulo>
      <div
        className={`ledger casts${visto ? " visto" : ""}`}
        data-shadow="box"
        id="lista"
        ref={(el) => { lista.current = el; return casts(el); }}
      >
        <p className="ledger__note">{t("Precios a tratar", "Prices negotiable")}</p>
        <dl>
          {inventario(t).map(({ clave, articulos }) => (
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
