import { useRef, type ReactNode } from "react";
import { CON_MOVIMIENTO, gsap, useGSAP } from "../movimiento/gsap";

// Título de sección pintado a mano: al llegar, el rotulista lo pinta de izquierda a
// derecha, con todo y su sombra roja. Los márgenes negativos dejan ver esa sombra.

export function Rotulo({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(CON_MOVIMIENTO, () => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(-20% 100% -30% -4%)" },
        {
          clipPath: "inset(-20% -8% -30% -4%)",
          ease: "power1.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 92%", end: "top 62%", scrub: true },
        },
      );
    });
  });

  return <h2 className="section-title" ref={ref}>{children}</h2>;
}
