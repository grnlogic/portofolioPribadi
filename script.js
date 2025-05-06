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
  const skillLevels = document.querySelectorAll(".skill-level");
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

  // Add floating animations with different delays
  const floatingElements = document.querySelectorAll(".floating");
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
  });

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
    document.body.classList.toggle("no-scroll");
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

  // Theme switching functionality
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // Check for saved theme preference or use dark mode as default
  const savedTheme = localStorage.getItem("theme") || "dark";

  // Apply saved theme
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Update button aria-label based on current theme
  themeToggleBtn.setAttribute(
    "aria-label",
    savedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );

  // Toggle theme when button is clicked
  themeToggleBtn.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Apply new theme
    document.documentElement.setAttribute("data-theme", newTheme);

    // Update button aria-label
    themeToggleBtn.setAttribute(
      "aria-label",
      newTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );

    // Save theme preference
    localStorage.setItem("theme", newTheme);

    // Update particle colors
    updateParticleColors(newTheme);
  });

  // Initial particle color update based on the current theme
  updateParticleColors(savedTheme);

  // Language switching functionality
  const languageSelector = document.getElementById("language-selector");

  // Check for saved language preference or use browser language
  const savedLanguage =
    localStorage.getItem("language") ||
    (navigator.language.startsWith("id")
      ? "id"
      : navigator.language.startsWith("ja")
      ? "ja"
      : "en");

  // Set initial language
  languageSelector.value = savedLanguage;

  // Apply translations on page load
  applyTranslations(savedLanguage);

  // Listen for language changes
  languageSelector.addEventListener("change", function () {
    const selectedLanguage = this.value;
    applyTranslations(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  });

  // Testimonial slider initialization
  if (document.querySelector(".testimonial-slider")) {
    initTestimonialSlider();
  }

  // Accordion functionality for skills
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const accordionItem = this.parentElement;
      const isActive = accordionItem.classList.contains("active");

      // Close all accordion items
      document.querySelectorAll(".accordion-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Toggle current item if it wasn't already active
      if (!isActive) {
        accordionItem.classList.add("active");

        // Animate skill bars inside the opened accordion
        const skillBars = accordionItem.querySelectorAll(".chart-skill");
        skillBars.forEach((bar) => {
          const width = bar.style.getPropertyValue("--skill-level");
          bar.style.setProperty("--skill-level", "0%");

          setTimeout(() => {
            bar.style.setProperty("--skill-level", width);
          }, 50);
        });
      }
    });
  });

  // Open the first accordion item by default
  const firstAccordion = document.querySelector(".accordion-item");
  if (firstAccordion) {
    firstAccordion.classList.add("active");
  }

  // Initialize testimonial carousel instead of slider
  if (document.querySelector(".testimonial-carousel")) {
    initTestimonialCarousel();
  }
});

// Mobile menu toggle
const createMobileMenu = () => {
  const nav = document.querySelector("nav");
  const menuBtn = document.createElement("div");
  menuBtn.className = "menu-btn";
  menuBtn.innerHTML = "<span></span><span></span><span></span>";

  document.querySelector("header .container").appendChild(menuBtn);

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });
};

// Call mobile menu creation for smaller screens
if (window.innerWidth < 768) {
  createMobileMenu();
}

// Form submission handler
const form = document.querySelector(".contact-form form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Use translated maintenance message
    Swal.fire({
      title: window.maintenanceMsg?.title || "Under Development",
      html: `
        <div class="maintenance-message">
          <p>${
            window.maintenanceMsg?.msg1 ||
            "Sorry, the email sending feature is currently under development."
          }</p>
          <p>${
            window.maintenanceMsg?.msg2 ||
            "For now, please send an email directly to:"
          }</p>
          <p><strong>237006079@student.unsil.ac.id</strong></p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#3B82F6",
      footer: `<span class="note">${
        window.maintenanceMsg?.thanks || "Thank you for your understanding."
      }</span>`,
    });

    // Don't reset the form so user can copy their message if needed
  });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  // Create temporary textarea element
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    // Copy text
    document.execCommand("copy");
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Message has been copied to clipboard. Please paste it in your email application.",
      confirmButtonColor: "#3B82F6",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Copy failed",
      text: "Could not copy the message. Please copy manually.",
      confirmButtonColor: "#3B82F6",
    });
  }

  document.body.removeChild(textarea);
}

// Function to apply translations
function applyTranslations(language) {
  if (!translations[language]) {
    console.error(`Translations for "${language}" not found.`);
    language = "en"; // Fallback to English
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

// Function to update particle colors based on theme
function updateParticleColors(theme) {
  if (typeof updateParticleTheme === "function") {
    updateParticleTheme(theme);
  }
}

// Testimonial auto-scrolling carousel
function initTestimonialCarousel() {
  const carousel = document.querySelector(".testimonial-carousel");

  if (!carousel) return;

  // Clone testimonials for infinite scrolling effect
  const testimonials = carousel.querySelectorAll(".testimonial-card");
  testimonials.forEach((testimonial) => {
    const clone = testimonial.cloneNode(true);
    carousel.appendChild(clone);
  });

  // Calculate the animation distance dynamically
  const updateScrollDistance = () => {
    const firstCard = testimonials[0];
    const cardWidth = firstCard.offsetWidth;
    const cardMargin =
      parseInt(window.getComputedStyle(firstCard).marginRight) || 0;
    const gap = 25; // Gap between cards as defined in CSS

    const singleCardTotalWidth = cardWidth + gap + cardMargin;
    const allCardsWidth = singleCardTotalWidth * testimonials.length;

    // Update CSS variable for the animation
    document.documentElement.style.setProperty(
      "--scroll-distance",
      `-${allCardsWidth}px`
    );
  };

  // Call initially and on window resize
  updateScrollDistance();
  window.addEventListener("resize", updateScrollDistance);

  // Drag to scroll functionality
  let isDragging = false;
  let startPosition = 0;
  let startScrollLeft = 0;

  carousel.addEventListener("mousedown", startDrag);
  carousel.addEventListener("touchstart", startDrag, { passive: true });
  carousel.addEventListener("mouseup", endDrag);
  carousel.addEventListener("touchend", endDrag);
  carousel.addEventListener("mouseleave", endDrag);
  carousel.addEventListener("mousemove", dragMove);
  carousel.addEventListener("touchmove", dragMove, { passive: true });

  function startDrag(e) {
    isDragging = true;
    startPosition = getPositionX(e);
    startScrollLeft = carousel.scrollLeft;

    // Temporarily pause animation while dragging
    carousel.style.animationPlayState = "paused";
  }

  function dragMove(e) {
    if (!isDragging) return;

    const currentPosition = getPositionX(e);
    const distance = currentPosition - startPosition;
    carousel.scrollLeft = startScrollLeft - distance;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    // Resume animation after a short delay
    setTimeout(() => {
      carousel.style.animationPlayState = "";

      // Reset any manual transform we might have applied
      carousel.style.transform = "";
    }, 1000);
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }
}

// Replace old testimonial slider function with the new carousel
function initTestimonialSlider() {
  // Call the new function instead
  initTestimonialCarousel();
}
