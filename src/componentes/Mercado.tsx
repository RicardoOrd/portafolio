import { useEffect, useRef } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { usePuestoEncendido } from "../luz/usePuestoEncendido";
import { CON_MOVIMIENTO, gsap, useGSAP } from "../movimiento/gsap";
import { abrirPuesto, colocarObjeto, subirMercancia } from "../movimiento/entradas";
import { puestos, type Mercancia as DatosMercancia, type Puesto as DatosPuesto } from "../datos/puestos";
import { useIdioma, useT } from "../idioma";
import { Odometro } from "./Odometro";
import { Rotulo } from "./Rotulo";
import { useRecorrido } from "./Recorrido";
import { useVisor } from "./Visor";

// Los puestos del tianguis. Cada uno abre al llegar (toldo, foco, mercancía y su
// objeto) y se prende al cruzar el centro de la pantalla.

// Ancho de la columna de mercancía: toda la pantalla en una columna, 500px en dos
const TAMANO_CAPTURA = "(max-width: 900px) calc(100vw - 32px), 500px";

function Mercancia({ m }: { m: DatosMercancia }) {
  const casts = useCasts();
  const visor = useVisor();

  if (m.tipo === "recortes") {
    return (
      <figure className="goods goods--cutouts">
        {m.recortes.map((r) => (
          <img key={r.src} className={`cut ${r.clase} casts`} data-shadow="img" ref={casts} src={r.src} width={r.width} height={r.height} loading="lazy" alt={r.alt} />
        ))}
        <figcaption>{m.pie}</figcaption>
      </figure>
    );
  }
  return (
    <figure className="goods goods--screen">
      <button className="lupa casts" data-shadow="img" ref={casts} type="button" aria-label={m.lupa} onClick={(e) => visor.abrir(e.currentTarget)}>
        <img src={m.imagen.src} srcSet={m.imagen.srcSet} sizes={TAMANO_CAPTURA} width={m.imagen.width} height={m.imagen.height} loading="lazy" alt={m.imagen.alt} />
      </button>
      {m.estampa && (
        <img className="goods__sticker casts" data-shadow="img" ref={casts} src={m.estampa.src} width={m.estampa.width} height={m.estampa.height} loading="lazy" alt={m.estampa.alt} />
      )}
      <figcaption>{m.pie}</figcaption>
    </figure>
  );
}

function Puesto({ p }: { p: DatosPuesto }) {
  const ref = useRef<HTMLElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();
  const { recorrer } = useRecorrido();
  const encendido = usePuestoEncendido(ref);
  const t = useT();

  useEffect(() => {
    if (encendido) recorrer(p.id);
    pedir();
  }, [encendido, p.id, recorrer, pedir]);

  useGSAP(() => {
    gsap.matchMedia().add(CON_MOVIMIENTO, () => {
      const puesto = ref.current;
      const mercancia = puesto?.querySelector(".goods");
      const objeto = puesto?.querySelector(".stall__info .tag");
      if (!puesto || !mercancia || !objeto) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: puesto,
          start: "top 88%",
          end: "top 30%",
          scrub: true,
          // Con el foco prendido, lo que se mueve cambia de sombra
          onUpdate: () => { if (puesto.classList.contains("is-lit")) pedir(); },
        },
      });
      abrirPuesto(tl, puesto, 26);
      subirMercancia(tl, mercancia);
      colocarObjeto[p.objeto](tl, objeto);
    });
  }, { scope: ref });

  return (
    <article className={`stall${p.flip ? " stall--flip" : ""}${encendido ? " is-lit" : ""}`} id={p.id} ref={ref} tabIndex={-1}>
      <div className="awning"><h3 className="awning__sign">{p.nombre}</h3></div>
      <div className="stall__body">
        <span className={`foco${encendido ? " on" : ""}`} aria-hidden="true"><i /></span>
        <Mercancia m={p.mercancia} />
        <div className="stall__info">
          <div className={`tag tag--${p.objeto} casts`} data-shadow="box" ref={casts}>
            <span className="tag__row"><span className="tag__k">{t("Origen", "Origin")}</span><span className="tag__v">{p.origen}</span></span>
            <span className="tag__row"><span className="tag__k">Commits</span><Odometro valor={String(p.commits)} activo={encendido} /></span>
            <span className="tag__row"><span className="tag__k">{t("Estado", "Status")}</span><span className={`tag__v${p.caliente ? " tag__v--hot" : ""}`}>{p.estado}</span></span>
          </div>
          <p>{p.descripcion}</p>
          <ul className="tech-tags" aria-label={t("Tecnologías", "Technologies")}>
            {p.tecnologias.map((t) => <li key={t}>{t}</li>)}
          </ul>
          {p.enlace && <a className="daylight" href={p.enlace.href} target="_blank" rel="noopener">{p.enlace.texto}</a>}
        </div>
      </div>
    </article>
  );
}

export function Mercado() {
  const idioma = useIdioma();
  const t = useT();
  return (
    <section id="puestos" className="market" tabIndex={-1}>
      <header className="market__head">
        <Rotulo>{t("Proyectos", "Projects")}</Rotulo>
        <p>{t(
          "Cada proyecto es un puesto con su foco: se prende cuando llegas a él. El número de cada cartulina son los commits de su repositorio.",
          "Each project is a market stall with its own bulb: it lights up when you reach it. The number on each tag is the commit count of its repository.",
        )}</p>
      </header>
      {puestos[idioma].map((p) => <Puesto key={p.id} p={p} />)}
    </section>
  );
}
