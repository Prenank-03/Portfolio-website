const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
let scrollFrame = 0;

const updateOnScroll = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    scrollFrame = 0;
  });
};

window.addEventListener("scroll", updateOnScroll, { passive: true });
window.addEventListener("resize", updateOnScroll, { passive: true });
updateOnScroll();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  navLinks.classList.toggle("open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    navLinks.classList.remove("open");
  });
});

document.querySelector("#year").textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealItems = document.querySelectorAll(".section-heading, .about-copy, .principle, .project-card, .skill-group, .contact-content > *");
  document.body.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

if ("IntersectionObserver" in window) {
  const sectionLinks = [...navItems].filter((link) => link.hash);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reducedMotion) {
  const hero = document.querySelector(".hero");
  const portrait = document.querySelector(".portrait-card");

  hero.addEventListener("pointermove", (event) => {
    const heroRect = hero.getBoundingClientRect();
    const x = ((event.clientX - heroRect.left) / heroRect.width) * 100;
    const y = ((event.clientY - heroRect.top) / heroRect.height) * 100;
    hero.style.setProperty("--light-x", `${x}%`);
    hero.style.setProperty("--light-y", `${y}%`);

    const portraitRect = portrait.getBoundingClientRect();
    const tiltX = ((event.clientX - portraitRect.left) / portraitRect.width - 0.5) * 5;
    const tiltY = ((event.clientY - portraitRect.top) / portraitRect.height - 0.5) * -5;
    portrait.style.setProperty("--portrait-tilt-x", `${tiltX}deg`);
    portrait.style.setProperty("--portrait-tilt-y", `${tiltY}deg`);
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--light-x", "50%");
    hero.style.setProperty("--light-y", "45%");
    portrait.style.setProperty("--portrait-tilt-x", "0deg");
    portrait.style.setProperty("--portrait-tilt-y", "0deg");
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--spot-x", `${x * 100}%`);
      card.style.setProperty("--spot-y", `${y * 100}%`);
      card.style.setProperty("--tilt-x", `${(x - 0.5) * 2.2}deg`);
      card.style.setProperty("--tilt-y", `${(0.5 - y) * 1.5}deg`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}
