// Shared interface behavior for the static NK AI Technologies portfolio.
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const revealItems = document.querySelectorAll(".reveal");
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  let scrollTicking = false;

  const syncNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  syncNavbar();
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      syncNavbar();
      scrollTicking = false;
    });
  }, { passive: true });

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
    if (window.innerWidth < 1024) return;
    const viewportCenter = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.12);
      const rect = item.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportCenter) * speed;
      item.style.transform = `translate3d(0, ${offset * -0.18}px, 0)`;
    });
  };

  if (parallaxItems.length) {
    let parallaxTicking = false;
    syncParallax();
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        syncParallax();
        parallaxTicking = false;
      });
    }, { passive: true });
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
  canvas.remove();
}
