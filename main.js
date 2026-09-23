// Bazar de sombras: la luz la dan los focos del tianguis. Cada .casts recibe la
// dirección y el largo de su sombra desde el foco encendido más cercano.

document.getElementById("anio").textContent = new Date().getFullYear();
document.body.classList.add("js");

const quietud = matchMedia("(prefers-reduced-motion: reduce)");
const proyectores = [...document.querySelectorAll(".casts, .hero__actions, .deal__actions")];
const focosPortada = [...document.querySelectorAll(".guirnalda .foco")];
const puestos = [...document.querySelectorAll(".stall")];
const visibles = new Set();
let pendiente = false;

const centro = (foco) => {
  const r = foco.querySelector("i").getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

// De qué foco le llega la luz a un elemento: el de su puesto, o el más cercano de la guirnalda
function luzPara(el, x, y) {
  if (document.body.classList.contains("apagon")) return null;
  const puesto = el.closest(".stall");
  if (puesto) return puesto.classList.contains("is-lit") ? centro(puesto.querySelector(".foco")) : null;
  if (!el.closest(".hero")) return null;
  let mejor = null, dmin = Infinity;
  for (const f of focosPortada) {
    if (!f.classList.contains("on")) continue;
    const [fx, fy] = centro(f), d = Math.hypot(x - fx, y - fy);
    if (d < dmin) { dmin = d; mejor = [fx, fy]; }
  }
  return mejor;
}

function proyectar() {
  pendiente = false;
  for (const el of visibles) {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const luz = luzPara(el, x, y);
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
const enPantalla = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target);
  pedir();
}, { rootMargin: "120px 0px" });
proyectores.forEach((el) => enPantalla.observe(el));
addEventListener("scroll", pedir, { passive: true });
addEventListener("resize", pedir);

// Guirnalda: cada foco se prende o se apaga al tocarlo
focosPortada.forEach((f) => f.addEventListener("click", () => { f.classList.toggle("on"); pedir(); }));

// Llegada: la guirnalda se prende foco por foco (el único momento orquestado)
if (quietud.matches) {
  focosPortada.forEach((f) => f.classList.add("on"));
  pedir();
} else {
  focosPortada.forEach((f, i) => setTimeout(() => { f.classList.add("on"); pedir(); }, 350 + i * 170));
}

// Puestos: su foco se prende cuando cruza el centro de la pantalla o cuando le pasas el cursor
const enCentro = new Set();
function actualizar(p) {
  const prendido = enCentro.has(p) || p.matches(":hover");
  p.classList.toggle("is-lit", prendido);
  p.querySelector(".foco").classList.toggle("on", prendido);
  pedir();
}
const mostrador = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.isIntersecting ? enCentro.add(e.target) : enCentro.delete(e.target);
  entradas.forEach((e) => actualizar(e.target));
}, { rootMargin: "-38% 0px -38% 0px" });
puestos.forEach((p) => {
  mostrador.observe(p);
  p.addEventListener("pointerenter", () => actualizar(p));
  p.addEventListener("pointerleave", () => requestAnimationFrame(() => actualizar(p)));
});

// Secreto de gamer: el código Konami tumba la luz del tianguis
const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const logro = document.getElementById("logro");
let avance = 0, ocultar;
addEventListener("keydown", (e) => {
  const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  avance = tecla === konami[avance] ? avance + 1 : (tecla === konami[0] ? 1 : 0);
  if (avance < konami.length) return;
  avance = 0;
  const apagon = document.body.classList.toggle("apagon");
  logro.querySelector("strong").textContent = apagon ? "Se fue la luz" : "Regresó la luz";
  logro.querySelector("span:last-child").textContent = apagon
    ? "Logro desbloqueado. Vuelve a teclear el código para que regrese."
    : "El tianguis vuelve a abrir.";
  logro.hidden = false;
  clearTimeout(ocultar);
  ocultar = setTimeout(() => { logro.hidden = true; }, 4200);
  pedir();
});
