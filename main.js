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
  if (prendido) contar(p.querySelector(".tag__num"));
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

// Odómetro: los commits corren hasta su número la primera vez que se prende el foco
function contar(el) {
  if (!el || el.dataset.contado) return;
  el.dataset.contado = "1";
  const m = el.textContent.match(/^(d+)(.*)$/);
  if (!m || quietud.matches) return;
  const meta = +m[1], resto = m[2], t0 = performance.now(), dur = 900;
  const paso = (t) => {
    const k = Math.min(1, (t - t0) / dur), suave = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(meta * suave) + resto;
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}
setTimeout(() => contar(document.querySelector(".hero__tag .tag__num")), 1500);

// Riel: el foco de la sección en la que estás se prende solo
const enlaces = [...document.querySelectorAll(".rail__nav a[data-seccion]")];
const secciones = enlaces.map((a) => document.getElementById(a.dataset.seccion));
const espia = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    enlaces.forEach((a) => a.dataset.seccion === e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
secciones.forEach((s) => s && espia.observe(s));
const portada = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) enlaces.forEach((a) => a.removeAttribute("aria-current"));
}, { rootMargin: "-45% 0px -50% 0px" });
portada.observe(document.getElementById("inicio"));

// Cable de abajo del riel: se enciende conforme bajas
const progreso = document.querySelector(".rail__progreso span");
let pidioProgreso = false;
addEventListener("scroll", () => {
  if (pidioProgreso) return;
  pidioProgreso = true;
  requestAnimationFrame(() => {
    pidioProgreso = false;
    const tope = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progreso.style.setProperty("--p", (scrollY / tope).toFixed(4));
  });
}, { passive: true });

// Menú del celular: un toldo que se desenrolla
const riel = document.querySelector(".rail");
const botonMenu = document.querySelector(".rail__menu");
function menu(abrir) {
  riel.classList.toggle("abierto", abrir);
  botonMenu.setAttribute("aria-expanded", String(abrir));
}
botonMenu.addEventListener("click", () => menu(!riel.classList.contains("abierto")));
enlaces.forEach((a) => a.addEventListener("click", () => menu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape" && riel.classList.contains("abierto")) { menu(false); botonMenu.focus(); } });
document.addEventListener("click", (e) => { if (riel.classList.contains("abierto") && !riel.contains(e.target)) menu(false); });

// La cartulina de la portada cuelga de su cordel: agárrala y suéltala.
// Péndulo amortiguado: aceleración = -k·sen(θ) - c·ω. Solo corre mientras se mueve.
const colgada = document.querySelector(".hero__tag");
if (colgada && !quietud.matches) {
  let th = 0, w = 0, agarrada = false, corriendo = false, ultimo = 0, antTh = 0, antT = 0;
  const K = 16, C = 1.4, MAX = 1.1;
  const pivote = () => {
    const r = colgada.getBoundingClientRect();
    return [r.left + r.width / 2, r.top - 46];
  };
  const pintar = () => { colgada.style.setProperty("--ang", th.toFixed(4) + "rad"); pedir(); };
  const tic = (t) => {
    const dt = Math.min(0.033, (t - (ultimo || t)) / 1000); ultimo = t;
    if (!agarrada) {
      w += (-K * Math.sin(th) - C * w) * dt;
      th = Math.max(-MAX, Math.min(MAX, th + w * dt));
    }
    pintar();
    if (agarrada || Math.abs(w) > 0.002 || Math.abs(th) > 0.002) requestAnimationFrame(tic);
    else { corriendo = false; ultimo = 0; th = 0; w = 0; pintar(); }
  };
  const arrancar = () => { if (!corriendo) { corriendo = true; requestAnimationFrame(tic); } };
  colgada.addEventListener("pointerdown", (e) => {
    agarrada = true; colgada.classList.add("agarrada"); colgada.setPointerCapture(e.pointerId);
    antTh = th; antT = performance.now(); arrancar();
  });
  colgada.addEventListener("pointermove", (e) => {
    if (!agarrada) return;
    const [px, py] = pivote();
    const nuevo = Math.max(-MAX, Math.min(MAX, Math.atan2(-(e.clientX - px), e.clientY - py)));
    const ahora = performance.now();
    w = (nuevo - antTh) / Math.max(0.008, (ahora - antT) / 1000);
    antTh = nuevo; antT = ahora; th = nuevo;
  });
  const soltar = () => { agarrada = false; colgada.classList.remove("agarrada"); w = Math.max(-8, Math.min(8, w)); };
  colgada.addEventListener("pointerup", soltar);
  colgada.addEventListener("pointercancel", soltar);
  // De vez en cuando pasa un airecito, solo si la cartulina está en pantalla
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(colgada);
  const aire = () => {
    if (visible && !agarrada && !document.hidden) { w += (Math.random() - 0.5) * 0.9; arrancar(); }
    setTimeout(aire, 3500 + Math.random() * 4000);
  };
  setTimeout(aire, 2600);
}
