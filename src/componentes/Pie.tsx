import { useEffect, useState } from "react";
import { useT } from "../idioma";

export function Pie() {
  const [anio, setAnio] = useState(2026);
  const t = useT();
  useEffect(() => setAnio(new Date().getFullYear()), []);
  return (
    <footer className="footer">
      <p>© {anio} Ricardo Orduño Camacho · {t("Hecho a mano, con React y GSAP.", "Handmade, with React and GSAP.")}</p>
    </footer>
  );
}
