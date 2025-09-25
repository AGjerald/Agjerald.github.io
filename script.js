/* == TRANSLATOR ==*/

let currentLang = "en";

document.getElementById("lang-btn").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "no" : "en";
  document.getElementById("lang-btn").textContent =
    currentLang === "en" ? "Norsk" : "English";

  document.querySelectorAll("[data-en]").forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`) ?? "";
    if (el.hasAttribute("data-html")) {
      el.innerHTML = text;          // tillat <br> osv.
    } else {
      el.textContent = text;        // trygg standard
    }
  });
});

/*== CONTACTBUTTON ==*/

// behold mailto:
document.getElementById("contactBtn").addEventListener("click", () => {
  location.href = "mailto:andersgjerald@gmail.com";
});

/* == Sticky scrolling navbar == */
let lastScroll = 0;
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down
    header.classList.add("hide");
  } else {
    // Scrolling up
    header.classList.remove("hide");

    
  /* == PROJECT SLIDESHOW == */
    (function initSlideshow(root = document.querySelector('#project_site .slideshow')) {
        if (!root) return;

        const track = root.querySelector('.slides');
        const slides = [...root.querySelectorAll('.slide')];
        const prevBtn = root.querySelector('.prev');
        const nextBtn = root.querySelector('.next');
        const dotsWrap = root.querySelector('.dots');

        // Lag dots dynamisk basert på faktiske slides
        dotsWrap.innerHTML = '';
        const dots = slides.map((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-controls', `slide-${i+1}`);
            b.tabIndex = i === 0 ? 0 : -1;
            b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dotsWrap.appendChild(b);
            return b;
        });

        let index = 0;
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
        const setIndex = (i, {focusDot=false} = {}) => {
            index = clamp(i, 0, slides.length - 1);
            track.style.transform = `translateX(${-index * 100}%)`;
            dots.forEach((d, idx) => {
            const sel = idx === index;
            d.setAttribute('aria-selected', sel ? 'true' : 'false');
            d.tabIndex = sel ? 0 : -1;
            if (sel && focusDot) d.focus();
            });
        };

        prevBtn.addEventListener('click', () => setIndex(index - 1, {focusDot:true}));
        nextBtn.addEventListener('click', () => setIndex(index + 1, {focusDot:true}));

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => setIndex(i, {focusDot:true}));
            dot.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') setIndex(i + 1, {focusDot:true});
            if (e.key === 'ArrowLeft')  setIndex(i - 1, {focusDot:true});
            });
        });

        // Swipe
        let startX = null, lastX = null, isDragging = false;
        const start = (x) => { startX = lastX = x; isDragging = true; track.style.transition = 'none'; };
        const move  = (x) => { if (!isDragging) return; lastX = x; const dx = x - startX; track.style.transform = `translateX(${(-index*100) + (dx / root.clientWidth)*100}%)`; };
        const end   = () => {
            if (!isDragging) return;
            const dx = lastX - startX;
            track.style.transition = '';
            if (Math.abs(dx) > root.clientWidth * 0.2) setIndex(index + (dx < 0 ? 1 : -1));
            else setIndex(index);
            isDragging = false; startX = lastX = null;
        };

        track.addEventListener('pointerdown', e => { track.setPointerCapture(e.pointerId); start(e.clientX); });
        track.addEventListener('pointermove', e => move(e.clientX));
        track.addEventListener('pointerup', end);
        track.addEventListener('pointercancel', end);
        track.addEventListener('pointerleave', () => isDragging && end());

        setIndex(0);
        })();
  }

  lastScroll = currentScroll;
});
