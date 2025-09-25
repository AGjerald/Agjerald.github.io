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

// behold mailto:
document.getElementById("contactBtn").addEventListener("click", () => {
  location.href = "mailto:andersgjerald@gmail.com";
});

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
  }

  lastScroll = currentScroll;
});
