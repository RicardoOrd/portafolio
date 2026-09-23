import { useEffect, useRef, useState } from "react";
import { estaQuieto } from "../movimiento/gsap";

/**
 * Los commits de la cartulina corren de 0 a su valor la primera vez que se prende
 * su foco, para que se lean como un conteo real. Hasta entonces muestran el valor final.
 */
export function Odometro({ valor, activo }: { valor: string; activo: boolean }) {
  const [texto, setTexto] = useState(valor);
  const contado = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!activo || contado.current || !el) return;
    contado.current = true;
    const m = valor.match(/^(\d+)(.*)$/);
    if (!m || estaQuieto()) return;
    const meta = Number(m[1]), resto = m[2], dur = 900;
    // El ancho queda fijo en el del número final: los dígitos no bailan mientras corren
    el.style.minInlineSize = `${el.getBoundingClientRect().width}px`;
    let t0 = 0, cuadro = 0, termino = false;
    const paso = (t: number) => {
      t0 ||= t;
      const k = Math.min(1, (t - t0) / dur), suave = 1 - Math.pow(1 - k, 3);
      setTexto(`${Math.round(meta * suave)}${resto}`);
      if (k < 1) cuadro = requestAnimationFrame(paso);
      else { termino = true; el.style.minInlineSize = ""; }
    };
    cuadro = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(cuadro);
      if (termino) return;
      // Interrumpido a medias: queda el valor final y se puede volver a contar
      contado.current = false;
      el.style.minInlineSize = "";
      setTexto(valor);
    };
  }, [activo, valor]);

  return <span className="tag__num" ref={ref}>{texto}</span>;
}
