<script>
  let currentLang = "en"; // default

  document.getElementById("lang-btn").addEventListener("click", () => {
    currentLang = currentLang === "en" ? "no" : "en";

    // Change button label
    document.getElementById("lang-btn").textContent =
      currentLang === "en" ? "Norsk" : "English";

    // Translate all elements with data-en/data-no
    document.querySelectorAll("[data-en]").forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
  });
</script>
