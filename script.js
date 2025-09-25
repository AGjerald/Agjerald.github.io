/* == TRANSLATOR ==*/
document.addEventListener("DOMContentLoaded", () => {
  let currentLang = "en";

  const langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "no" : "en";
      langBtn.textContent = currentLang === "en" ? "Norsk" : "English";

      document.querySelectorAll("[data-en]").forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`) ?? "";
        if (el.hasAttribute("data-html")) el.innerHTML = text;
        else el.textContent = text;
      });
    });
  }

  /*== CONTACTBUTTON ==*/
  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      location.href = "mailto:andersgjerald@gmail.com";
    });
  }

  /* == Sticky scrolling navbar == */
  let lastScroll = 0;
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (header) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add("hide");   // nedover: skjul
      } else {
        header.classList.remove("hide"); // oppover: vis
      }
    }
    lastScroll = currentScroll;
  });

  /* == PROJECT SLIDESHOW == */
  initSlideshow(
    document.querySelector("#project_snippets .slideshow") ||
    document.querySelector("#project_site .slideshow") ||
    document.querySelector(".slideshow")
  );

  function initSlideshow(root) {
    if (!root || root.dataset.initialized === "1") return;
    root.dataset.initialized = "1";

    const track   = root.querySelector(".slides");
    const slides  = [...root.querySelectorAll(".slide")];
    const prevBtn = root.querySelector(".prev");
    const nextBtn = root.querySelector(".next");
    const dotsWrap= root.querySelector(".dots");
    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !dotsWrap) return;

    // Bygg dots dynamisk
    dotsWrap.innerHTML = "";
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", `slide-${i + 1}`);
      b.tabIndex = i === 0 ? 0 : -1;
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dotsWrap.appendChild(b);
      return b;
    });

    let index = 0;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const setIndex = (i, { focusDot = false } = {}) => {
      index = clamp(i, 0, slides.length - 1);
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, idx) => {
        const sel = idx === index;
        d.setAttribute("aria-selected", sel ? "true" : "false");
        d.tabIndex = sel ? 0 : -1;
        if (sel && focusDot) d.focus();
      });
    };

    prevBtn.addEventListener("click", () => setIndex(index - 1, { focusDot: true }));
    nextBtn.addEventListener("click", () => setIndex(index + 1, { focusDot: true }));

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => setIndex(i, { focusDot: true }));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") setIndex(i + 1, { focusDot: true });
        if (e.key === "ArrowLeft")  setIndex(i - 1, { focusDot: true });
      });
    });

    // Swipe
    let startX = null, lastX = null, isDragging = false;
    const start = (x) => { startX = lastX = x; isDragging = true; track.style.transition = "none"; };
    const move  = (x) => {
      if (!isDragging) return;
      lastX = x;
      const dx = x - startX;
      track.style.transform = `translateX(${(-index * 100) + (dx / root.clientWidth) * 100}%)`;
    };
    const end   = () => {
      if (!isDragging) return;
      const dx = lastX - startX;
      track.style.transition = "";
      if (Math.abs(dx) > root.clientWidth * 0.2) setIndex(index + (dx < 0 ? 1 : -1));
      else setIndex(index);
      isDragging = false; startX = lastX = null;
    };

    track.addEventListener("pointerdown", e => { track.setPointerCapture(e.pointerId); start(e.clientX); });
    track.addEventListener("pointermove",  e => move(e.clientX));
    track.addEventListener("pointerup",    end);
    track.addEventListener("pointercancel",end);
    track.addEventListener("pointerleave", () => isDragging && end());

    setIndex(0);
  }
});
