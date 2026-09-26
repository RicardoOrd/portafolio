import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { crearMotor, type MotorDeLuz } from "./motor";
import { useAviso } from "../componentes/Aviso";
import { useT } from "../idioma";

interface Luz {
  motor: MotorDeLuz;
  apagon: boolean;
}

const LuzContext = createContext<Luz | null>(null);

// Secreto de gamer: el código Konami tumba la luz del tianguis
const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function LuzProvider({ children }: { children: ReactNode }) {
  const [motor] = useState(crearMotor);
  const [apagon, setApagon] = useState(false);
  const avisar = useAviso();
  const t = useT();

  useEffect(() => {
    let avance = 0;
    const alTeclear = (e: KeyboardEvent) => {
      const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      avance = tecla === konami[avance] ? avance + 1 : (tecla === konami[0] ? 1 : 0);
      if (avance < konami.length) return;
      avance = 0;
      const ahora = !document.body.classList.contains("apagon");
      setApagon(ahora);
      if (ahora) avisar(t("Se fue la luz", "Lights out"), t("Logro desbloqueado. Vuelve a teclear el código para que regrese.", "Achievement unlocked. Type the code again to bring it back."));
      else avisar(t("Regresó la luz", "Power's back"), t("El tianguis vuelve a abrir.", "The market is open again."));
    };
    addEventListener("keydown", alTeclear);
    return () => removeEventListener("keydown", alTeclear);
  }, [avisar, t]);

  useEffect(() => {
    document.body.classList.toggle("apagon", apagon);
    motor.apagon = apagon;
  }, [apagon, motor]);

  return <LuzContext value={{ motor, apagon }}>{children}</LuzContext>;
}

function useLuz() {
  const luz = useContext(LuzContext);
  if (!luz) throw new Error("useLuz va dentro de <LuzProvider>");
  return luz;
}

/** Pide recalcular las sombras: cuando algo se prende, se apaga o se mueve respecto a su foco */
export const usePedirLuz = () => useLuz().motor.pedir;

export const useApagon = () => useLuz().apagon;

/**
 * Ref para todo lo que proyecta sombra: `<div className="tag casts" data-shadow="box" ref={casts}>`.
 * El CSS lee --sx, --sy y --len; el motor las escribe mientras el elemento está en pantalla.
 */
export function useCasts() {
  const { motor } = useLuz();
  return useCallback((el: HTMLElement | null) => (el ? motor.registrar(el) : undefined), [motor]);
}
