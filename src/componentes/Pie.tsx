import { useEffect, useState } from "react";

// El pie: un letrero de horario con la hora real de Sonora, que no cambia de horario.

const horaSonora = new Intl.DateTimeFormat("en-US", { timeZone: "America/Hermosillo", hour: "numeric", hourCycle: "h23" });
const reloj = new Intl.DateTimeFormat("es-MX", { timeZone: "America/Hermosillo", hour: "numeric", minute: "2-digit" });

function Horario() {
  // Hasta hidratar se ve como el HTML prerenderizado; después, la hora de verdad
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    let espera: ReturnType<typeof setTimeout>;
    const pintar = () => {
      setAhora(new Date());
      clearTimeout(espera);
      espera = setTimeout(pintar, 60000 - (Date.now() % 60000));
    };
    const alCambiar = () => { if (document.hidden) clearTimeout(espera); else pintar(); };
    pintar();
    document.addEventListener("visibilitychange", alCambiar);
    return () => {
      clearTimeout(espera);
      document.removeEventListener("visibilitychange", alCambiar);
    };
  }, []);

  const h = ahora ? Number(horaSonora.format(ahora)) : 21;
  const abierto = h >= 21 || h < 3;
  return (
    <div className={`horario${ahora && abierto ? " abierto" : ""}`}>
      <span className={`foco${ahora && abierto ? " on" : ""}`} aria-hidden="true"><i /></span>
      <p className="horario__letrero">
        <span className="horario__estado">{abierto ? "Abierto" : "Cerrado"}</span>{" "}
        <span className="horario__hora">{ahora ? `${reloj.format(ahora)} en Sonora` : ""}</span>
      </p>
      <p className="horario__nota">
        {abierto
          ? "Abierto de 9 p.m. hasta que compile. No se aceptan devoluciones."
          : "Abro a las 9 p.m.; los correos los contesto igual. Sonora no cambia de horario: UTC−7 todo el año."}
      </p>
    </div>
  );
}

export function Pie() {
  const [anio, setAnio] = useState(2026);
  useEffect(() => setAnio(new Date().getFullYear()), []);
  return (
    <footer className="footer">
      <Horario />
      <p>© {anio} Ricardo Orduño Camacho · Hecho a mano, con React y GSAP.</p>
    </footer>
  );
}
