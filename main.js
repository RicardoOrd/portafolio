// Bazar de sombras: la luna es la única luz. Cada .casts recibe la dirección
// y el largo de su sombra según dónde esté la luna respecto a él.

document.getElementById("anio").textContent = new Date().getFullYear();
document.body.classList.add("js");

const raiz = document.documentElement;
const ancho = () => raiz.clientWidth;   // sin barra de scroll ni desbordes
const quietud = matchMedia("(prefers-reduced-motion: reduce)");
const tactil = matchMedia("(hover: none)");

// La luna vive en el cielo de la portada: al bajar, sale por arriba y sigue
// alumbrando desde fuera de la pantalla. El cursor la mueve de lado a lado.
const luna = { x: 0, y: 0, meta: { x: 0, y: 0 } };
const radioLuna = () => document.getElementById("luna").offsetWidth / 2;
const alturaLuna = () => (ancho() < 640 ? 64 + radioLuna() + 14 : 118);
const acotarX = (x) => Math.min(Math.max(x, radioLuna() + 16), ancho() - radioLuna() - 16);
const proyectores = [...document.querySelectorAll(".casts, .hero__actions, .deal__actions, .stall")];
const visibles = new Set();
let pendiente = false;

function reposoDeLuna() {
  return { x: acotarX(ancho() * 0.8), y: alturaLuna() };
}

// En pantallas táctiles la luna cruza el cielo conforme bajas por el callejón
function lunaPorScroll() {
  const tope = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const p = Math.min(1, Math.max(0, scrollY / tope));
  return { x: acotarX(ancho() * (0.84 - 0.68 * p)), y: alturaLuna() };
}

function sombraDeTexto(ux, uy, largo) {
  const capas = [`${(-ux * 1.2).toFixed(2)}px ${(-uy * 1.2).toFixed(2)}px 0 rgb(230 237 245 / .28)`];
  const n = Math.round(largo);
  for (let i = 1; i <= n; i++) {
    const a = (0.8 * (1 - i / (n + 2))).toFixed(3);
    capas.push(`${(ux * i).toFixed(2)}px ${(uy * i).toFixed(2)}px 0 rgb(2 4 8 / ${a})`);
  }
  capas.push(`${(ux * n * 1.4).toFixed(2)}px ${(uy * n * 1.4).toFixed(2)}px ${n}px rgb(2 4 8 / .45)`);
  return capas.join(",");
}

function proyectar() {
  pendiente = false;
  const suave = !quietud.matches && !tactil.matches;
  luna.x += (luna.meta.x - luna.x) * (suave ? 0.14 : 1);
  luna.y = luna.meta.y;
  const cieloY = luna.y - scrollY;               // dónde se ve la luna
  const luzY = Math.max(cieloY, -260);            // de dónde sale la luz

  raiz.style.setProperty("--mx", `${luna.x.toFixed(1)}px`);
  raiz.style.setProperty("--my", `${cieloY.toFixed(1)}px`);
  raiz.style.setProperty("--mxp", `${((luna.x / ancho()) * 100).toFixed(1)}%`);
  raiz.style.setProperty("--myp", `${((luzY / innerHeight) * 100).toFixed(1)}%`);

  for (const el of visibles) {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - luna.x;
    const dy = r.top + r.height / 2 - luzY;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    const largo = Math.min(18, Math.max(3, d / 70));
    el.style.setProperty("--sx", (ux * largo).toFixed(2));
    el.style.setProperty("--sy", (uy * largo).toFixed(2));
    el.style.setProperty("--len", largo.toFixed(1));
    el.style.setProperty("--rx", (-ux * 1.5).toFixed(2));
    el.style.setProperty("--ry", (-uy * 1.5).toFixed(2));
    if (el.dataset.shadow === "text") {
      const escala = el.classList.contains("hero__name") ? 1.3 : 0.8;
      el.style.setProperty("--ts", sombraDeTexto(ux, uy, largo * escala));
    }
  }

  if (Math.abs(luna.meta.x - luna.x) > 0.5) pedir();
}

function pedir() {
  if (!pendiente) { pendiente = true; requestAnimationFrame(proyectar); }
}

function ubicarLuna() {
  if (quietud.matches) luna.meta = reposoDeLuna();
  else if (tactil.matches) luna.meta = lunaPorScroll();
  pedir();
}

// Solo se recalculan los que están en pantalla
const enPantalla = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target);
  pedir();
}, { rootMargin: "120px 0px" });
proyectores.forEach((el) => enPantalla.observe(el));

addEventListener("pointermove", (e) => {
  if (quietud.matches || e.pointerType !== "mouse") return;
  luna.meta = { x: acotarX(e.clientX), y: alturaLuna() };
  pedir();
}, { passive: true });
addEventListener("scroll", () => { tactil.matches ? ubicarLuna() : pedir(); }, { passive: true });
addEventListener("resize", ubicarLuna);
quietud.addEventListener("change", ubicarLuna);

luna.meta = reposoDeLuna();
luna.x = luna.meta.x; luna.y = luna.meta.y;
ubicarLuna();

// La venta activa: el puesto que cruza el centro de la pantalla sale a la luz
const puestos = document.querySelectorAll(".stall");
const mostrador = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.target.classList.toggle("is-lit", e.isIntersecting);
}, { rootMargin: "-38% 0px -38% 0px" });
puestos.forEach((p) => mostrador.observe(p));

// Secreto de gamer: el código Konami apaga la luna
const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const logro = document.getElementById("logro");
let avance = 0, ocultar;
addEventListener("keydown", (e) => {
  const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  avance = tecla === konami[avance] ? avance + 1 : (tecla === konami[0] ? 1 : 0);
  if (avance < konami.length) return;
  avance = 0;
  const eclipse = document.body.classList.toggle("eclipse");
  logro.querySelector("strong").textContent = eclipse ? "Eclipse" : "Luna llena";
  logro.querySelector("span:last-child").textContent = eclipse
    ? "Apagaste la luna. Vuelve a teclear el código para prenderla."
    : "La luna regresó. El bazar vuelve a abrir.";
  logro.hidden = false;
  clearTimeout(ocultar);
  ocultar = setTimeout(() => { logro.hidden = true; }, 4200);
});
