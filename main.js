// Bazar de sombras: un tianguis de noche. La luz la dan los focos y cada .casts
// recibe la dirección y el largo de su sombra desde el foco encendido más cercano.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

document.getElementById("anio").textContent = new Date().getFullYear();
document.body.classList.add("js");

const quietud = matchMedia("(prefers-reduced-motion: reduce)");
const quieto = () => quietud.matches;

// ---------- Aviso (logros) ----------

const logro = $("#logro");
let ocultarAviso;
function avisar(titulo, texto) {
  logro.querySelector("strong").textContent = titulo;
  logro.querySelector("span").textContent = texto;
  logro.hidden = false;
  clearTimeout(ocultarAviso);
  ocultarAviso = setTimeout(() => { logro.hidden = true; }, 4200);
}

// ---------- Luz y sombras ----------

const proyectores = $$(".casts, .hero__actions, .deal__actions");
const focosPortada = $$(".guirnalda .foco");
const visibles = new Set();
let pendiente = false;

const centro = (foco) => {
  const r = foco.querySelector("i").getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

function proyectar() {
  pendiente = false;
  const apagon = document.body.classList.contains("apagon");
  // Primero todas las lecturas...
  const guirnalda = apagon ? [] : focosPortada.filter((f) => f.classList.contains("on")).map(centro);
  const lecturas = [];
  for (const el of visibles) {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    let luz = null;
    if (!apagon) {
      const lugar = el.closest(".stall, .merchant");
      if (lugar) {
        if (lugar.classList.contains("is-lit")) luz = centro(lugar.querySelector(".foco"));
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

// Solo se recalculan los que están en pantalla. El scroll no cambia nada:
// cada foco se mueve junto con lo que alumbra.
const enPantalla = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target);
  pedir();
}, { rootMargin: "120px 0px" });
proyectores.forEach((el) => enPantalla.observe(el));

// ---------- Guirnalda de la portada ----------

function prender(foco, on) {
  foco.classList.toggle("on", on);
  foco.setAttribute("aria-pressed", String(on));
  pedir();
}
// Un solo tabulador para los siete focos; las flechas pasan de uno a otro
focosPortada.forEach((f, i) => {
  f.tabIndex = i === 0 ? 0 : -1;
  f.addEventListener("click", () => prender(f, !f.classList.contains("on")));
  f.addEventListener("keydown", (e) => {
    const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!paso) return;
    e.preventDefault();
    const sig = focosPortada[(i + paso + focosPortada.length) % focosPortada.length];
    f.tabIndex = -1; sig.tabIndex = 0; sig.focus();
  });
});
// Llegada: la guirnalda se prende foco por foco (el momento orquestado de la página)
if (quieto()) focosPortada.forEach((f) => prender(f, true));
else focosPortada.forEach((f, i) => setTimeout(() => prender(f, true), 350 + i * 170));

// ---------- Odómetro de commits ----------

function contar(el) {
  if (!el || el.dataset.contado) return;
  el.dataset.contado = "1";
  const m = el.textContent.match(/^(\d+)(.*)$/);
  if (!m || quieto()) return;
  const meta = +m[1], resto = m[2], t0 = performance.now(), dur = 900;
  // El ancho queda fijo en el del número final: los dígitos no bailan mientras corren
  el.style.minInlineSize = el.getBoundingClientRect().width + "px";
  const paso = (t) => {
    const k = Math.min(1, (t - t0) / dur), suave = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(meta * suave) + resto;
    if (k < 1) requestAnimationFrame(paso);
    else el.style.minInlineSize = "";
  };
  requestAnimationFrame(paso);
}
setTimeout(() => contar($(".hero__tag .tag__num")), 1500);

// ---------- Puestos y calle ----------

const puestos = $$(".stall");
const calle = new Map($$(".calle__puesto").map((a) => [a.getAttribute("href").slice(1), a]));
const cuenta = $(".calle__cuenta");
let recorridos = new Set();
try { recorridos = new Set(JSON.parse(sessionStorage.getItem("recorridos") || "[]").filter((id) => calle.has(id))); } catch {}

function pintarCuenta() {
  recorridos.forEach((id) => calle.get(id)?.classList.add("visto"));
  if (cuenta) cuenta.textContent = `${recorridos.size} de ${calle.size} puestos recorridos`;
}
function recorrer(id) {
  if (!calle.has(id) || recorridos.has(id)) return;
  recorridos.add(id);
  try { sessionStorage.setItem("recorridos", JSON.stringify([...recorridos])); } catch {}
  pintarCuenta();
  if (recorridos.size === calle.size) avisar("Terminaste el mercado", "Logro desbloqueado: pasaste por todos los puestos.");
}
pintarCuenta();

// Un puesto se prende al cruzar el centro de la pantalla, con el cursor encima o con el foco del teclado dentro
const enCentro = new Set();
function actualizar(p) {
  const prendido = enCentro.has(p) || p.matches(":hover") || p.matches(":focus-within");
  p.classList.toggle("is-lit", prendido);
  p.querySelector(".foco").classList.toggle("on", prendido);
  if (prendido) { contar(p.querySelector(".tag__num")); recorrer(p.id); }
  pedir();
}
const mostrador = new IntersectionObserver((entradas) => {
  for (const e of entradas) e.isIntersecting ? enCentro.add(e.target) : enCentro.delete(e.target);
  entradas.forEach((e) => actualizar(e.target));
}, { rootMargin: "-38% 0px -38% 0px" });
puestos.forEach((p) => {
  mostrador.observe(p);
  const luego = () => requestAnimationFrame(() => actualizar(p));
  p.addEventListener("pointerenter", () => actualizar(p));
  p.addEventListener("pointerleave", luego);
  p.addEventListener("focusin", () => actualizar(p));
  p.addEventListener("focusout", luego);
});

// ---------- Habilidades: los círculos de plumón se dibujan la primera vez que ves la lista ----------

const lista = $("#lista");
if (lista) new IntersectionObserver(([e], obs) => {
  if (e.isIntersecting) { lista.classList.add("visto"); obs.disconnect(); }
}, { threshold: 0.35 }).observe(lista);

// ---------- Sobre mí: el foco lo prendes tú ----------

const cartel = $(".merchant");
const focoCartel = $(".merchant .foco");
focoCartel?.addEventListener("click", () => {
  const on = !cartel.classList.contains("is-lit");
  cartel.classList.toggle("is-lit", on);
  prender(focoCartel, on);
});

// ---------- Riel: sección actual, progreso y menú ----------

const enlaces = $$(".rail__nav a[data-seccion]");
const espia = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    enlaces.forEach((a) => a.dataset.seccion === e.target.id ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
enlaces.forEach((a) => { const s = document.getElementById(a.dataset.seccion); if (s) espia.observe(s); });
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) enlaces.forEach((a) => a.removeAttribute("aria-current"));
}, { rootMargin: "-45% 0px -50% 0px" }).observe($("#inicio"));

const progreso = $(".rail__progreso span");
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

const riel = $(".rail");
const botonMenu = $(".rail__menu");
function menu(abrir) {
  riel.classList.toggle("abierto", abrir);
  botonMenu.setAttribute("aria-expanded", String(abrir));
}
botonMenu.addEventListener("click", () => menu(!riel.classList.contains("abierto")));
enlaces.forEach((a) => a.addEventListener("click", () => menu(false)));
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && riel.classList.contains("abierto")) { menu(false); botonMenu.focus(); }
});
document.addEventListener("click", (e) => { if (riel.classList.contains("abierto") && !riel.contains(e.target)) menu(false); });
// Si el tabulador sale del menú, el menú se enrolla: nunca tapa lo que tiene el foco
riel.addEventListener("focusout", (e) => {
  if (riel.classList.contains("abierto") && !riel.contains(e.relatedTarget)) menu(false);
});

// ---------- La cartulina cuelga del cable de la guirnalda ----------

const hero = $(".hero");
const colgada = $(".hero__tag");
const cableSvg = $(".guirnalda svg");

// En escritorio el cordel sube hasta el cable. El cable es una curva cuadrática
// por tramos de 250 unidades: y = 20 + 100·t·(1 − t), con t la posición en el tramo.
function medirCordel() {
  if (!colgada) return;
  const dosColumnas = getComputedStyle(hero).gridTemplateColumns.trim().split(/\s+/).length > 1;
  if (!dosColumnas) { colgada.style.removeProperty("--cordel"); return; }
  const tag = colgada.querySelector(".tag");
  const hr = hero.getBoundingClientRect(), sr = cableSvg.getBoundingClientRect();
  const cx = colgada.offsetLeft + colgada.offsetWidth / 2;
  const vbx = ((hr.left + cx - sr.left) / sr.width) * 1000;
  const t = (((vbx % 250) + 250) % 250) / 250;
  const yCable = (sr.top - hr.top) + (20 + 100 * t * (1 - t)) * (sr.height / 90);
  const topTag = tag.offsetParent === hero ? tag.offsetTop : colgada.offsetTop + tag.offsetTop;
  const largo = Math.max(40, topTag + 17 - yCable);
  colgada.style.setProperty("--cordel", largo.toFixed(0) + "px");
}
medirCordel();
document.fonts?.ready.then(() => { medirCordel(); pedir(); });
addEventListener("resize", () => { medirCordel(); pedir(); });

// Péndulo amortiguado: aceleración = −(g/L)·sen θ − c·ω. Solo corre mientras se mueve.
if (colgada && !quieto()) {
  colgada.classList.add("colgante");
  let th = 0, w = 0, agarrada = false, corriendo = false, ultimo = 0, antTh = 0, antT = 0, piv = [0, 0];
  const largo = () => parseFloat(getComputedStyle(colgada).getPropertyValue("--cordel")) || 64;
  const pintar = () => { colgada.style.setProperty("--ang", th.toFixed(4) + "rad"); pedir(); };
  const tic = (t) => {
    const dt = Math.min(0.033, (t - (ultimo || t)) / 1000); ultimo = t;
    const L = largo(), K = 1100 / L, MAX = Math.min(1.1, 90 / L);
    if (!agarrada) {
      w += (-K * Math.sin(th) - 1.3 * w) * dt;
      th = Math.max(-MAX, Math.min(MAX, th + w * dt));
    }
    pintar();
    if (agarrada || Math.abs(w) > 0.003 || Math.abs(th) > 0.003) requestAnimationFrame(tic);
    else { corriendo = false; ultimo = 0; th = 0; w = 0; pintar(); }
  };
  const arrancar = () => { if (!corriendo) { corriendo = true; requestAnimationFrame(tic); } };
  colgada.addEventListener("pointerdown", (e) => {
    // El eje se toma al agarrar: la caja de un elemento girado se mueve mientras se columpia
    const hr = hero.getBoundingClientRect();
    piv = [hr.left + colgada.offsetLeft + colgada.offsetWidth / 2, hr.top + colgada.offsetTop + 17 - largo()];
    agarrada = true; colgada.classList.add("agarrada"); colgada.setPointerCapture(e.pointerId);
    antTh = th; antT = performance.now(); arrancar();
  });
  colgada.addEventListener("pointermove", (e) => {
    if (!agarrada) return;
    const MAX = Math.min(1.1, 90 / largo());
    const nuevo = Math.max(-MAX, Math.min(MAX, Math.atan2(-(e.clientX - piv[0]), e.clientY - piv[1])));
    const ahora = performance.now();
    w = (nuevo - antTh) / Math.max(0.008, (ahora - antT) / 1000);
    antTh = nuevo; antT = ahora; th = nuevo;
  });
  const soltar = () => { agarrada = false; colgada.classList.remove("agarrada"); w = Math.max(-6, Math.min(6, w)); };
  colgada.addEventListener("pointerup", soltar);
  colgada.addEventListener("pointercancel", soltar);
  // Un airecito de vez en cuando, solo con la cartulina en pantalla y la pestaña visible
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(colgada);
  const aire = () => {
    if (visible && !agarrada && !corriendo && !document.hidden) { w += (Math.random() - 0.5) * 0.5; arrancar(); }
    setTimeout(aire, 9000 + Math.random() * 7000);
  };
  setTimeout(aire, 4000);
}

// ---------- Capturas: se toman del puesto para verlas de cerca ----------

const visor = $(".visor");
const visorImg = $(".visor img");
let origen = null;
const transicion = (fn) => (document.startViewTransition && !quieto())
  ? document.startViewTransition(fn).finished.catch(() => {})
  : Promise.resolve(fn());

function abrir(boton) {
  const img = boton.querySelector("img");
  origen = boton;
  visorImg.src = img.currentSrc || img.src;
  visorImg.alt = img.alt;
  visorImg.width = +img.getAttribute("width") || img.naturalWidth;
  visorImg.height = +img.getAttribute("height") || img.naturalHeight;
  img.style.viewTransitionName = "captura";
  transicion(() => {
    img.style.viewTransitionName = "";
    visorImg.style.viewTransitionName = "captura";
    visor.showModal();
  }).then(() => { visorImg.style.viewTransitionName = ""; });
}
function cerrar() {
  if (!visor.open) return;
  const img = origen?.querySelector("img");
  visorImg.style.viewTransitionName = "captura";
  transicion(() => {
    visorImg.style.viewTransitionName = "";
    visor.close();
    if (img) img.style.viewTransitionName = "captura";
  }).then(() => { if (img) img.style.viewTransitionName = ""; origen?.focus(); });
}
$$(".lupa").forEach((b) => b.addEventListener("click", () => abrir(b)));
visor?.addEventListener("cancel", (e) => { e.preventDefault(); cerrar(); });
visor?.addEventListener("click", (e) => { if (e.target === visor || e.target.classList.contains("visor__lienzo")) cerrar(); });
$(".visor__cerrar")?.addEventListener("click", cerrar);

// ---------- Contacto: copiar el correo y apartar la entrevista ----------

const copiar = $("#copiar");
const avisoTrato = $(".deal__aviso");
const sello = $(".sello");
function sellar() {
  if (quieto()) { sello.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: "both" }); return; }
  sello.animate([
    { opacity: 0, transform: "rotate(-14deg) scale(1.8)" },
    { opacity: 1, transform: "rotate(-14deg) scale(.94)", offset: 0.78 },
    { opacity: 1, transform: "rotate(-14deg) scale(1)" },
  ], { duration: 260, easing: "cubic-bezier(.55, 0, 1, .45)", fill: "both" });
  // El golpe del sello sacude la cartulina
  sello.closest(".tag").animate([
    { transform: "translateY(0)" }, { transform: "translateY(4px)", offset: 0.25 }, { transform: "translateY(0)" },
  ], { duration: 320, delay: 200, easing: "cubic-bezier(.16, 1, .3, 1)" });
}
copiar?.addEventListener("click", async () => {
  const correo = copiar.dataset.correo;
  try {
    await navigator.clipboard.writeText(correo);
    avisoTrato.textContent = "Listo, el correo está en tu portapapeles.";
    sellar();
  } catch {
    const r = document.createRange(), s = getSelection();
    r.selectNodeContents($("#correo"));
    s.removeAllRanges(); s.addRange(r);
    avisoTrato.textContent = "No pude copiarlo solo: ya está seleccionado, cópialo con Ctrl+C.";
  }
});

// ---------- Pie: el horario con la hora real de Sonora ----------

const horaSonora = new Intl.DateTimeFormat("en-US", { timeZone: "America/Hermosillo", hour: "numeric", hourCycle: "h23" });
const reloj = new Intl.DateTimeFormat("es-MX", { timeZone: "America/Hermosillo", hour: "numeric", minute: "2-digit" });
const horario = $(".horario");
let cuandoHorario;
function pintarHorario() {
  if (!horario) return;
  const ahora = new Date();
  const h = +horaSonora.format(ahora);
  const abierto = h >= 21 || h < 3;
  horario.classList.toggle("abierto", abierto);
  horario.querySelector(".foco").classList.toggle("on", abierto);
  $(".horario__estado", horario).textContent = abierto ? "Abierto" : "Cerrado";
  $(".horario__hora", horario).textContent = reloj.format(ahora) + " en Sonora";
  $(".horario__nota", horario).textContent = abierto
    ? "Abierto de 9 p.m. hasta que compile. No se aceptan devoluciones."
    : "Abro a las 9 p.m.; los correos los contesto igual. Sonora no cambia de horario: UTC−7 todo el año.";
  clearTimeout(cuandoHorario);
  cuandoHorario = setTimeout(pintarHorario, 60000 - (Date.now() % 60000));
}
pintarHorario();
document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(cuandoHorario); else pintarHorario(); });

// ---------- Secreto de gamer: el código Konami tumba la luz del tianguis ----------

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let avance = 0;
addEventListener("keydown", (e) => {
  const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  avance = tecla === konami[avance] ? avance + 1 : (tecla === konami[0] ? 1 : 0);
  if (avance < konami.length) return;
  avance = 0;
  const apagon = document.body.classList.toggle("apagon");
  if (apagon) avisar("Se fue la luz", "Logro desbloqueado. Vuelve a teclear el código para que regrese.");
  else avisar("Regresó la luz", "El tianguis vuelve a abrir.");
  pedir();
});
