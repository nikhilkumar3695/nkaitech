// Shared interface behavior for the static NK AI Technologies portfolio.
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const revealItems = document.querySelectorAll(".reveal");
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  const syncNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  syncNavbar();
  window.addEventListener("scroll", syncNavbar, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));

  const syncParallax = () => {
    const viewportCenter = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.12);
      const rect = item.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportCenter) * speed;
      item.style.transform = `translate3d(0, ${offset * -0.18}px, 0)`;
    });
  };

  if (parallaxItems.length) {
    syncParallax();
    window.addEventListener("scroll", syncParallax, { passive: true });
    window.addEventListener("resize", syncParallax);
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "Signal received. Replace this static handler with your email or backend endpoint.";
      contactForm.reset();
    });
  }

  initParticles();
});

function initParticles() {
  const canvas = document.querySelector("#particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = null;

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = reducedMotion ? 24 : Math.min(92, Math.max(42, Math.floor(width / 18)));
    particles.length = 0;

    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        radius: Math.random() * 1.8 + 0.6,
        hue: Math.random() > 0.55 ? "125, 249, 255" : "156, 92, 255"
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.hue}, 0.72)`;
      ctx.shadowBlur = 16;
      ctx.shadowColor = `rgba(${particle.hue}, 0.55)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 118) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(125, 249, 255, ${0.12 * (1 - distance / 118)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  };

  resize();
  draw();

  if (reducedMotion) return;

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    draw();
  });
}
