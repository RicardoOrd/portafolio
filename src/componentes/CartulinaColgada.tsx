import { useEffect, useRef, useState } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { useQuieto } from "../movimiento/gsap";
import { commitsTotales } from "../datos/puestos";
import { Odometro } from "./Odometro";
import { useT } from "../idioma";

// La cartulina de la portada cuelga del cable de la guirnalda. Se puede agarrar y
// soltar: la mueve un péndulo amortiguado que solo corre mientras se mueve.

/** Cuánto se quedó atrás el cable al bajar (lo escribe la salida de la portada) */
const atras = (hero: HTMLElement) => parseFloat(getComputedStyle(hero).getPropertyValue("--atras-cable")) || 0;

export function CartulinaColgada() {
  const ref = useRef<HTMLElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const quieto = useQuieto();
  const t = useT();
  const [agarrada, setAgarrada] = useState(false);
  const [contar, setContar] = useState(false);

  useEffect(() => {
    const espera = setTimeout(() => setContar(true), 1500);
    return () => clearTimeout(espera);
  }, []);

  // En escritorio el cordel sube hasta el cable. El cable es una curva cuadrática
  // por tramos de 250 unidades: y = 20 + 100·t·(1 − t), con t la posición en el tramo.
  useEffect(() => {
    const colgada = ref.current;
    const hero = colgada?.closest<HTMLElement>(".hero");
    const cable = hero?.querySelector(".guirnalda svg");
    const tag = colgada?.querySelector<HTMLElement>(".tag");
    if (!colgada || !hero || !cable || !tag) return;
    const medir = () => {
      const dosColumnas = getComputedStyle(hero).gridTemplateColumns.trim().split(/\s+/).length > 1;
      if (!dosColumnas) { colgada.style.removeProperty("--cordel"); pedir(); return; }
      const hr = hero.getBoundingClientRect(), sr = cable.getBoundingClientRect();
      const cx = colgada.offsetLeft + colgada.offsetWidth / 2;
      const vbx = ((hr.left + cx - sr.left) / sr.width) * 1000;
      const t = (((vbx % 250) + 250) % 250) / 250;
      // El cable y la cartulina se quedan atrás juntos: se mide como si no se hubieran movido
      const yCable = (sr.top - atras(hero) - hr.top) + (20 + 100 * t * (1 - t)) * (sr.height / 90);
      const topTag = tag.offsetParent === hero ? tag.offsetTop : colgada.offsetTop + tag.offsetTop;
      colgada.style.setProperty("--cordel", `${Math.max(40, topTag + 17 - yCable).toFixed(0)}px`);
      pedir();
    };
    medir();
    document.fonts?.ready.then(medir);
    addEventListener("resize", medir);
    return () => removeEventListener("resize", medir);
  }, [pedir]);

  // Péndulo amortiguado: aceleración = −(g/L)·sen θ − c·ω
  useEffect(() => {
    const colgada = ref.current;
    const hero = colgada?.closest<HTMLElement>(".hero");
    if (quieto || !colgada || !hero) return;
    let th = 0, w = 0, agarrado = false, corriendo = false, ultimo = 0, antTh = 0, antT = 0;
    let piv: [number, number] = [0, 0], cuadro = 0, aire: ReturnType<typeof setTimeout>;
    const largo = () => parseFloat(getComputedStyle(colgada).getPropertyValue("--cordel")) || 64;
    const pintar = () => { colgada.style.setProperty("--ang", `${th.toFixed(4)}rad`); pedir(); };
    const tic = (t: number) => {
      const dt = Math.min(0.033, (t - (ultimo || t)) / 1000);
      ultimo = t;
      const L = largo(), K = 1100 / L, MAX = Math.min(1.1, 90 / L);
      if (!agarrado) {
        w += (-K * Math.sin(th) - 1.3 * w) * dt;
        th = Math.max(-MAX, Math.min(MAX, th + w * dt));
      }
      pintar();
      if (agarrado || Math.abs(w) > 0.003 || Math.abs(th) > 0.003) cuadro = requestAnimationFrame(tic);
      else { corriendo = false; ultimo = 0; th = 0; w = 0; pintar(); }
    };
    const arrancar = () => { if (!corriendo) { corriendo = true; cuadro = requestAnimationFrame(tic); } };

    const agarrar = (e: PointerEvent) => {
      // El eje se toma al agarrar: la caja de un elemento girado se mueve mientras se columpia
      const hr = hero.getBoundingClientRect();
      piv = [hr.left + colgada.offsetLeft + colgada.offsetWidth / 2, hr.top + colgada.offsetTop + 17 - largo() + atras(hero)];
      agarrado = true;
      setAgarrada(true);
      colgada.setPointerCapture(e.pointerId);
      antTh = th; antT = performance.now();
      arrancar();
    };
    const mover = (e: PointerEvent) => {
      if (!agarrado) return;
      const MAX = Math.min(1.1, 90 / largo());
      const nuevo = Math.max(-MAX, Math.min(MAX, Math.atan2(-(e.clientX - piv[0]), e.clientY - piv[1])));
      const ahora = performance.now();
      w = (nuevo - antTh) / Math.max(0.008, (ahora - antT) / 1000);
      antTh = nuevo; antT = ahora; th = nuevo;
    };
    const soltar = () => {
      if (!agarrado) return;
      agarrado = false;
      setAgarrada(false);
      w = Math.max(-6, Math.min(6, w));
    };
    colgada.addEventListener("pointerdown", agarrar);
    colgada.addEventListener("pointermove", mover);
    colgada.addEventListener("pointerup", soltar);
    colgada.addEventListener("pointercancel", soltar);

    // Un airecito de vez en cuando, solo con la cartulina en pantalla y la pestaña visible
    let visible = true;
    const vista = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    vista.observe(colgada);
    const soplar = () => {
      if (visible && !agarrado && !corriendo && !document.hidden) { w += (Math.random() - 0.5) * 0.5; arrancar(); }
      aire = setTimeout(soplar, 9000 + Math.random() * 7000);
    };
    aire = setTimeout(soplar, 4000);

    return () => {
      colgada.removeEventListener("pointerdown", agarrar);
      colgada.removeEventListener("pointermove", mover);
      colgada.removeEventListener("pointerup", soltar);
      colgada.removeEventListener("pointercancel", soltar);
      vista.disconnect();
      clearTimeout(aire);
      cancelAnimationFrame(cuadro);
      colgada.style.removeProperty("--ang");
    };
  }, [quieto, pedir]);

  return (
    <aside
      ref={ref}
      className={`hero__tag${quieto ? "" : " colgante"}${agarrada ? " agarrada" : ""}`}
      aria-label={t("Cartulina con mis datos", "Price tag with my details")}
    >
      <div className="tag casts" data-shadow="box" ref={casts}>
        <span className="tag__row"><span className="tag__k">{t("Origen", "Origin")}</span><span className="tag__v">{t("Sonora, México", "Sonora, Mexico")}</span></span>
        <span className="tag__row"><span className="tag__k">Commits</span><Odometro valor={commitsTotales} activo={contar} /></span>
        <span className="tag__row"><span className="tag__k">{t("Estado", "Status")}</span><span className="tag__v">{t("Buscando equipo", "Looking for a team")}</span></span>
        <span className="tag__row"><span className="tag__k">{t("Precio", "Price")}</span><span className="tag__v">{t("Una entrevista", "One interview")}</span></span>
      </div>
    </aside>
  );
}
