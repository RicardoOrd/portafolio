import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// El aviso de logro: una cartulina que sale abajo al centro y se va sola.

type Avisar = (titulo: string, texto: string) => void;

const AvisoContext = createContext<Avisar | null>(null);

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<{ titulo: string; texto: string } | null>(null);
  const ocultar = useRef<ReturnType<typeof setTimeout>>(undefined);

  const avisar = useCallback<Avisar>((titulo, texto) => {
    setAviso({ titulo, texto });
    clearTimeout(ocultar.current);
    ocultar.current = setTimeout(() => setAviso(null), 4200);
  }, []);
  useEffect(() => () => clearTimeout(ocultar.current), []);

  return (
    <AvisoContext value={avisar}>
      {children}
      <div className="toast" role="status" aria-live="polite" hidden={!aviso}>
        <strong>{aviso?.titulo}</strong>
        <span>{aviso?.texto}</span>
      </div>
    </AvisoContext>
  );
}

export function useAviso() {
  const avisar = useContext(AvisoContext);
  if (!avisar) throw new Error("useAviso va dentro de <AvisoProvider>");
  return avisar;
}
