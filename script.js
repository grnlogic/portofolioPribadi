// Scroll reveal effect
document.addEventListener("DOMContentLoaded", function () {
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

    // Here you would typically send the form data to a server
    // For demonstration, we'll just show a success message
    const formData = new FormData(form);
    let formValues = {};

    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }

    console.log("Form submitted:", formValues);

    // Show success message
    form.innerHTML =
      '<div class="success-message"><h3>Thank you!</h3><p>Your message has been sent successfully. I\'ll get back to you soon.</p></div>';
  });
}
