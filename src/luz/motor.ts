// La luz la dan los focos. Cada elemento registrado recibe en --sx, --sy y --len
// la dirección y el largo de su sombra desde el foco encendido más cercano.

export interface MotorDeLuz {
  /** Pide recalcular las sombras en el siguiente cuadro (varias peticiones se juntan en una) */
  pedir(): void;
  /** Empieza a proyectar la sombra de un elemento; devuelve cómo dejar de hacerlo */
  registrar(el: HTMLElement): () => void;
  apagon: boolean;
}

type Punto = [number, number];

const centro = (foco: Element): Punto => {
  const r = (foco.querySelector("i") ?? foco).getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

export function crearMotor(): MotorDeLuz {
  const visibles = new Set<HTMLElement>();
  let pendiente = false;
  let apagon = false;
  let observador: IntersectionObserver | null = null;

  function proyectar() {
    pendiente = false;
    // Primero todas las lecturas...
    const guirnalda = apagon ? [] : [...document.querySelectorAll(".guirnalda .foco.on")].map(centro);
    const lecturas: [HTMLElement, number, number, Punto | null][] = [];
    for (const el of visibles) {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      let luz: Punto | null = null;
      if (!apagon) {
        const lugar = el.closest(".stall, .merchant");
        if (lugar) {
          const foco = lugar.querySelector(".foco");
          if (lugar.classList.contains("is-lit") && foco) luz = centro(foco);
        } else if (el.closest(".hero")) {
          let dmin = Infinity;
          for (const f of guirnalda) {
            const d = Math.hypot(x - f[0], y - f[1]);
            if (d < dmin) { dmin = d; luz = f; }
          }
        }
      }
      lecturas.push([el, x, y, luz]);
    }
    // ...y luego todas las escrituras, para no forzar el layout en cada vuelta
    for (const [el, x, y, luz] of lecturas) {
      if (!luz) {  // sin foco: una sombra corta y plana, como de noche
        el.style.setProperty("--sx", "0");
        el.style.setProperty("--sy", "3");
        el.style.setProperty("--len", "4");
        continue;
      }
      const dx = x - luz[0], dy = y - luz[1];
      const d = Math.hypot(dx, dy) || 1;
      const largo = Math.min(22, Math.max(4, d / 40));
      el.style.setProperty("--sx", ((dx / d) * largo).toFixed(2));
      el.style.setProperty("--sy", ((dy / d) * largo).toFixed(2));
      el.style.setProperty("--len", largo.toFixed(1));
    }
  }

  function pedir() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(proyectar); }
  }

  // Solo se recalculan los que están en pantalla
  const observar = () => observador ??= new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const el = e.target as HTMLElement;
      if (e.isIntersecting) visibles.add(el); else visibles.delete(el);
    }
    pedir();
  }, { rootMargin: "120px 0px" });

  return {
    pedir,
    registrar(el) {
      observar().observe(el);
      return () => { observador?.unobserve(el); visibles.delete(el); };
    },
    get apagon() { return apagon; },
    set apagon(v) { apagon = v; pedir(); },
  };
}
