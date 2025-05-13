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
    
    // Better body scroll locking
    if (nav.classList.contains("active")) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.classList.add("no-scroll");
      // Maintain scroll position to prevent content jump
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position
      const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
      document.body.classList.remove("no-scroll");
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    }
  });

  // Ensure when clicking overlay, we properly restore scroll
  overlay.addEventListener("click", function () {
    if (nav.classList.contains("active")) {
      const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
      mobileMenuBtn.classList.remove("active");
      nav.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    }
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

  // Add smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target section from the href attribute
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Get height of header for offset
        const headerHeight = document.querySelector("header").offsetHeight;

        // Calculate the position to scroll to (with offset for the fixed header)
        const targetPosition =
          targetSection.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        // Smooth scroll to the target
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update active class on nav links
        navLinks.forEach((navLink) => navLink.classList.remove("active"));
        this.classList.add("active");

        // If on mobile, close the menu after clicking
        mobileMenuBtn.classList.remove("active");
        nav.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  });

  // Enhanced function to update active menu item based on scroll position
  function updateActiveMenuItem() {
    const scrollPosition = window.scrollY;

    // Get all sections that have an ID that matches navigation data-section attributes
    const sections = document.querySelectorAll("section[id]");

    // Add header height for offset calculation
    const headerHeight = document.querySelector("header").offsetHeight;

    // Find the current section in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 100; // Extra offset for better UX
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all nav links
        navLinks.forEach((link) => link.classList.remove("active"));

        // Find the corresponding nav link and add active class
        const activeLink = document.querySelector(
          `nav ul li a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });

    // Special case for home section (when at top of page)
    if (scrollPosition < 100) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector(
        'nav ul li a[href="#main-content"]'
      );
      if (homeLink) {
        homeLink.classList.add("active");
      }
    }
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
