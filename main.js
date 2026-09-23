document.getElementById("anio").textContent = new Date().getFullYear();

// Las tarjetas aparecen al entrar en pantalla. Sin IntersectionObserver se ven desde el inicio.
if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll(".project, .skill, .about").forEach((el) => {
    el.classList.add("reveal");
    observador.observe(el);
  });
}
