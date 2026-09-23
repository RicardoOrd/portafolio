import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePedirLuz } from "../luz/Luz";
import { estaQuieto } from "../movimiento/gsap";

// Siete focos colgados de un cable con vuelos, de lado a lado de la portada.
// Cada uno se prende o se apaga al tocarlo; las sombras de la portada salen del más cercano.

// Posición de cada foco: izquierda en % del ancho y altura del cable en px
const focos: [number, number][] = [[12.5, 45], [25, 20], [37.5, 45], [50, 20], [62.5, 45], [75, 20], [87.5, 45]];

const pasos: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function Guirnalda() {
  const [prendidos, setPrendidos] = useState(() => focos.map(() => false));
  // Un solo tabulador para los siete focos; las flechas pasan de uno a otro
  const [activo, setActivo] = useState(0);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const pedir = usePedirLuz();

  // Llegada: la guirnalda se prende foco por foco (el momento orquestado de la página)
  useEffect(() => {
    if (estaQuieto()) { setPrendidos(focos.map(() => true)); return; }
    const prender = (i: number) => setPrendidos((p) => p.map((on, j) => (j === i ? true : on)));
    const esperas = focos.map((_, i) => setTimeout(() => prender(i), 350 + i * 170));
    return () => esperas.forEach(clearTimeout);
  }, []);

  useEffect(() => { pedir(); }, [prendidos, pedir]);

  const alTeclear = (e: KeyboardEvent, i: number) => {
    const paso = pasos[e.key];
    if (!paso) return;
    e.preventDefault();
    const sig = (i + paso + focos.length) % focos.length;
    setActivo(sig);
    botones.current[sig]?.focus();
  };

  return (
    <div className="guirnalda" role="group" aria-label="Guirnalda: prende y apaga los focos con clic o con las flechas">
      <svg viewBox="0 0 1000 90" preserveAspectRatio="none" focusable="false" aria-hidden="true">
        <path d="M0 20 Q125 70 250 20 Q375 70 500 20 Q625 70 750 20 Q875 70 1000 20" />
      </svg>
      {focos.map(([x, y], i) => (
        <button
          key={x}
          ref={(el) => { botones.current[i] = el; }}
          className={`foco${prendidos[i] ? " on" : ""}`}
          type="button"
          style={{ left: `${x}%`, top: `${y}px` }}
          aria-pressed={prendidos[i]}
          aria-label={`Foco ${i + 1} de ${focos.length}`}
          tabIndex={i === activo ? 0 : -1}
          onClick={() => setPrendidos((p) => p.map((on, j) => (j === i ? !on : on)))}
          onKeyDown={(e) => alTeclear(e, i)}
        >
          <i />
        </button>
      ))}
    </div>
  );
}
