// Scroll reveal effect
document.addEventListener("DOMContentLoaded", function () {
  // Hide preloader after page loads
  const preloader = document.getElementById("preloader");

  // Timeout to ensure animations have time to load
  setTimeout(() => {
    preloader.classList.add("preloader-hidden");

    // Remove from DOM after transition completes
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 1500);

  // Initialize animation for skill bars
  const skillLevels = document.querySelectorAll(".progress-bar");
  skillLevels.forEach((level) => {
    const width = level.style.width;
    level.style.width = "0";
    setTimeout(() => {
      level.style.width = width;
    }, 500);
  });

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      }
    });
  }

  // Initial check
  checkReveal();

  // Check on scroll
  window.addEventListener("scroll", checkReveal);

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector("nav");
  const overlay = document.querySelector(".overlay");
  const navLinks = document.querySelectorAll("nav ul li a");

  // Toggle menu when hamburger icon is clicked
  mobileMenuBtn.addEventListener("click", function () {
    mobileMenuBtn.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll"); // Prevent background scroll
  });

  // Close menu when overlay is clicked
  overlay.addEventListener("click", function () {
    mobileMenuBtn.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  // Close menu when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenuBtn.classList.remove("active");
      nav.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  // Add active class to the current menu item based on scroll position
  function updateActiveMenuItem() {
    const scrollPosition = window.scrollY;

    // Get all sections with IDs that match navigation links
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all nav links
        navLinks.forEach((link) => link.classList.remove("active"));

        // Add active class to current section nav link
        const activeLink = document.querySelector(
          `nav ul li a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  // Update active menu item on scroll
  window.addEventListener("scroll", updateActiveMenuItem);

  // Call once on page load
  updateActiveMenuItem();

  // Language switching functionality
  const languageSelector = document.getElementById("language-selector");
  if (languageSelector) {
    // Check for saved language preference or use browser language
    const savedLanguage =
      localStorage.getItem("language") ||
      (navigator.language.startsWith("id")
        ? "id"
        : navigator.language.startsWith("ja")
        ? "ja"
        : "en");

    // Set initial language
    if (languageSelector) {
      languageSelector.value = savedLanguage;
    }

    // Apply translations on page load
    if (typeof applyTranslations === "function") {
      applyTranslations(savedLanguage);
    }

    // Listen for language changes
    languageSelector.addEventListener("change", function () {
      const selectedLanguage = this.value;
      if (typeof applyTranslations === "function") {
        applyTranslations(selectedLanguage);
      }
      localStorage.setItem("language", selectedLanguage);
    });
  }

  // Form submission handler
  const form = document.querySelector(".newsletter-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Use translated maintenance message
      Swal.fire({
        title: "Thank you!",
        html: `
          <div class="maintenance-message">
            <p>Thank you for subscribing to our newsletter.</p>
            <p>We'll keep you updated with the latest information.</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF6A46",
      });

      // Reset the form
      form.reset();
    });
  }
});

// Function to apply translations
function applyTranslations(language) {
  if (!translations || !translations[language]) {
    console.error(`Translations for "${language}" not found.`);
    language = "en"; // Fallback to English
    if (!translations) return;
  }

  const translationObj = translations[language];

  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translationObj[key]) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = translationObj[key];
      } else {
        element.textContent = translationObj[key];
      }
    }
  });

  // Update document title
  document.title = `Fajar Geran - ${
    language === "en"
      ? "Portfolio"
      : language === "id"
      ? "Portofolio"
      : "ポートフォリオ"
  }`;

  // Update maintenance message for SweetAlert (used in the contact form)
  window.maintenanceMsg = {
    title: translationObj.maintenance_title,
    msg1: translationObj.maintenance_msg1,
    msg2: translationObj.maintenance_msg2,
    thanks: translationObj.maintenance_thanks,
  };
}
