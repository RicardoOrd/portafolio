import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { puestos } from "../datos/puestos";
import { useAviso } from "./Aviso";

// Qué puestos ya visitaste en esta pestaña. La calle de la portada prende su farol
// y al completarlos sale el logro.

const ids = new Set(puestos.map((p) => p.id));
const CLAVE = "recorridos";

interface Recorrido {
  recorridos: ReadonlySet<string>;
  recorrer(id: string): void;
}

const RecorridoContext = createContext<Recorrido | null>(null);

function guardar(recorridos: ReadonlySet<string>) {
  try { sessionStorage.setItem(CLAVE, JSON.stringify([...recorridos])); } catch { /* sin almacenamiento */ }
}

export function RecorridoProvider({ children }: { children: ReactNode }) {
  const [recorridos, setRecorridos] = useState<ReadonlySet<string>>(() => new Set());
  // Copia al día para decidir sin esperar al siguiente render
  const actuales = useRef(recorridos);
  const avisar = useAviso();

  const fijar = useCallback((nuevos: ReadonlySet<string>) => {
    actuales.current = nuevos;
    setRecorridos(nuevos);
    guardar(nuevos);
  }, []);

  // Se lee después de hidratar: el HTML prerenderizado siempre empieza en cero.
  // Lo que ya venía guardado no cuenta como recorrido nuevo y no repite el logro.
  useEffect(() => {
    try {
      const guardados: unknown = JSON.parse(sessionStorage.getItem(CLAVE) || "[]");
      if (!Array.isArray(guardados)) return;
      const validos = guardados.filter((id): id is string => typeof id === "string" && ids.has(id));
      if (validos.length) fijar(new Set([...actuales.current, ...validos]));
    } catch { /* sin almacenamiento: se empieza de cero */ }
  }, [fijar]);

  const recorrer = useCallback((id: string) => {
    if (!ids.has(id) || actuales.current.has(id)) return;
    const nuevos = new Set(actuales.current).add(id);
    fijar(nuevos);
    if (nuevos.size === ids.size) avisar("Terminaste el mercado", "Logro desbloqueado: pasaste por todos los puestos.");
  }, [avisar, fijar]);

  return <RecorridoContext value={{ recorridos, recorrer }}>{children}</RecorridoContext>;
}

export function useRecorrido() {
  const recorrido = useContext(RecorridoContext);
  if (!recorrido) throw new Error("useRecorrido va dentro de <RecorridoProvider>");
  return recorrido;
}
