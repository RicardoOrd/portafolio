import { useEffect, useState } from "react";

export function Pie() {
  const [anio, setAnio] = useState(2026);
  useEffect(() => setAnio(new Date().getFullYear()), []);
  return (
    <footer className="footer">
      <p>© {anio} Ricardo Orduño Camacho · Hecho a mano, con React y GSAP.</p>
    </footer>
  );
}
