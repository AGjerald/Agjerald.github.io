/* == GLOBAL I18N (URL ?lang=… + localStorage) == */
document.addEventListener("DOMContentLoaded", () => {
  const LS_KEY = "lang";
  const SUPPORTED = ["en", "no"];

  // Finn start-språk: URL > localStorage > <html lang> > 'en'
  const url = new URL(window.location.href);
  const urlLang = url.searchParams.get("lang");
  const lsLang  = localStorage.getItem(LS_KEY);
  const htmlLang= document.documentElement.getAttribute("lang") || "en";

  let currentLang =
    (urlLang && SUPPORTED.includes(urlLang)) ? urlLang :
    (lsLang  && SUPPORTED.includes(lsLang)) ? lsLang  :
    (SUPPORTED.includes(htmlLang) ? htmlLang : "en");

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(LS_KEY, lang);

    // Bytt tekst på alle elementer med data-en/data-no
    document.querySelectorAll("[data-en],[data-no]").forEach(el => {
      const attrName = (lang === "no") ? "data-no" : "data-en";
      const text = el.getAttribute(attrName);
      if (text == null) return;
      if (el.hasAttribute("data-html")) el.innerHTML = text;
      else el.textContent = text;
    });

    // Oppdater språk-knappens label (viser hva du bytter TIL)
    const langBtn = document.getElementById("lang-btn");
    if (langBtn) {
      // Bruk buttonens egne data-attributter som kilde hvis de finnes
      const nextLabel =
        (lang === "en")
          ? (langBtn.getAttribute("data-en") || "NO")
          : (langBtn.getAttribute("data-no") || "EN");
      langBtn.textContent = nextLabel;
    }

    // Oppdater ©-år hvis du bruker <span id="y">
    const y = document.getElementById("y");
    if (y) y.textContent = new Date().getFullYear();
  }

  // Initial påføring
  applyLang(currentLang);

  // Toggle-knapp + oppdater URL så delte lenker bevarer språk
  const langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = (currentLang === "en") ? "no" : "en";
      const u = new URL(window.location.href);
      u.searchParams.set("lang", next);
      history.replaceState(null, "", u.toString());
      applyLang(next);
      propagateLangToInternalLinks(next);
    });
  }

  // Propager språk til interne lenker (samme origin), men ikke hash/mailto/tel
  function propagateLangToInternalLinks(lang) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || "";
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      try {
        const dest = new URL(href, window.location.origin);
        const sameOrigin = dest.origin === window.location.origin;
        const looksLikeFileNav =
          dest.pathname.endsWith(".html") || dest.pathname === "/" || dest.search || dest.hash || true;
        if (sameOrigin && looksLikeFileNav) {
          if (!dest.searchParams.has("lang")) dest.searchParams.set("lang", lang);
          a.setAttribute('href', dest.pathname + dest.search + dest.hash);
        }
      } catch (_) { /* ignorer ugyldige href */ }
    });
  }
  // Kjør én gang ved sidestart
  propagateLangToInternalLinks(currentLang);

  /*== CONTACTBUTTON ==*/
  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      location.href = "mailto:andersgjerald@gmail.com";
    });
  }

  /* == Sticky scrolling navbar (skjul ned, vis opp) == */
  let lastScroll = 0;
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (header) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add("hide");   // nedover: skjul
      } else {
        header.classList.remove("hide"); // oppover: vis
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* == PROJECT SLIDESHOW == */
  initSlideshow(
    document.querySelector("#project_snippets .slideshow") ||
    document.querySelector("#project_site .slideshow") ||
    document.querySelector(".slideshow")
  );

  function initSlideshow(root) {
    if (!root || root.dataset.initialized === "1") return;
    root.dataset.initialized = "1";

    const track    = root.querySelector(".slides");
    const slides   = [...root.querySelectorAll(".slide")];
    const prevBtn  = root.querySelector(".prev");
    const nextBtn  = root.querySelector(".next");
    const dotsWrap = root.querySelector(".dots");
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
    const wrap = (i, len) => (i + len) % len;
    const setIndex = (i, { focusDot = false } = {}) => {
      index = wrap(i, slides.length);                   // <-- loop
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

    track.addEventListener("pointerdown",  e => { track.setPointerCapture(e.pointerId); start(e.clientX); });
    track.addEventListener("pointermove",  e => move(e.clientX));
    track.addEventListener("pointerup",    end);
    track.addEventListener("pointercancel",end);
    track.addEventListener("pointerleave", () => isDragging && end());

    setIndex(0);
  }
});
/*Hamburger menu*/ 
 (function(){
    const btn = document.querySelector('[data-nav-toggle]');
    const nav = document.getElementById('site-nav');
    if(!btn || !nav) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Optional: close when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (e.target.closest('.hamburger') || e.target.closest('.nav')) return;
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  })();
