import { useRef } from "react";
import { useCasts, usePedirLuz } from "../luz/Luz";
import { CON_MOVIMIENTO, gsap, useGSAP } from "../movimiento/gsap";
import { puestos } from "../datos/puestos";
import { Guirnalda } from "./Guirnalda";
import { CartulinaColgada } from "./CartulinaColgada";
import { useRecorrido } from "./Recorrido";

// La portada. Al bajar, lo que cuelga se queda atrás con profundidad: la luna, que
// está lejísimos, casi no se mueve; la guirnalda y su cartulina se rezagan menos;
// el letrero apenas, y se apaga un poco. La calle en miniatura va al frente.

function Calle() {
  const { recorridos } = useRecorrido();
  return (
    <nav className="calle" aria-label="Los puestos del tianguis">
      <p className="calle__cuenta" aria-live="polite">{`${recorridos.size} de ${puestos.length} puestos recorridos`}</p>
      {puestos.map((p) => (
        <a key={p.id} className={`calle__puesto${recorridos.has(p.id) ? " visto" : ""}`} href={`#${p.id}`} aria-label={p.nombre}>
          <span className="calle__toldo" aria-hidden="true" />
          <span className="calle__mostrador" aria-hidden="true">
            <span className="calle__foco" />
            <span className="calle__largo">{p.nombre}</span>
            <span className="calle__corto">{p.corto}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}

export function Portada() {
  const hero = useRef<HTMLElement>(null);
  const casts = useCasts();
  const pedir = usePedirLuz();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // En una sola columna todo va apilado (letrero, cartulina, calle): si algo se
    // rezagara se encimaría con lo de abajo. Ahí solo se queda atrás la luna.
    mm.add({ movimiento: CON_MOVIMIENTO, anchas: "(min-width: 901px)" }, (ctx) => {
      const el = hero.current;
      if (!el || !ctx.conditions?.movimiento) return;
      const anchas = Boolean(ctx.conditions.anchas);
      const alto = () => el.offsetHeight;
      gsap.fromTo(
        el,
        { "--atras-luna": "0px", "--atras-cable": "0px", "--atras-letrero": "0px", "--tenue": 0 },
        {
          "--atras-luna": () => `${alto() * (anchas ? 0.55 : 0.35)}px`,
          "--atras-cable": () => `${anchas ? alto() * 0.2 : 0}px`,
          "--atras-letrero": () => `${anchas ? alto() * 0.06 : 0}px`,
          "--tenue": 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            // La portada empieza bajo el riel de 68px
            start: "top 68px",
            end: "bottom 68px",
            scrub: true,
            invalidateOnRefresh: true,
            // Los botones se mueven respecto a los focos: su sombra cambia al bajar
            onUpdate: pedir,
          },
        },
      );
    });
  }, { scope: hero });

  return (
    <section id="inicio" className="hero" ref={hero} tabIndex={-1}>
      <Guirnalda />
      <img className="hero__luna" src="img/luna-lro-168.webp" width={168} height={168} alt="" aria-hidden="true" />

      <div className="hero__copy">
        <h1 className="hero__name">Ricardo<br />Orduño</h1>
        <p className="hero__lead">
          Desarrollador full stack en Sonora, México. Hago de principio a fin, de la
          interfaz al servidor, las tiendas, cajas y apps con las que cobran negocios de
          aquí: una repostería en Navojoa vende con mi tienda y una taquería cobra con mi caja.
        </p>
        <div className="hero__actions" ref={casts}>
          <a className="ticket-btn casts" data-shadow="box" href="#puestos" ref={casts}>Ver proyectos</a>
          <a className="line-btn" href="https://www.linkedin.com/in/ricardo-orduno-camacho/" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>

      <CartulinaColgada />
      <Calle />
    </section>
  );
}
