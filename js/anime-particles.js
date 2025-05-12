/**
 * Anime-style background particles for the portfolio
 */
document.addEventListener("DOMContentLoaded", function () {
  // Create particles container
  const particlesContainer = document.createElement("div");
  particlesContainer.id = "anime-particles";
  document.body.appendChild(particlesContainer);

  // Generate background particles
  function createBackgroundParticles() {
    const particleCount = Math.min(window.innerWidth / 10, 50); // Responsive count

    // Clear existing particles
    particlesContainer.innerHTML = "";

    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");

      // Random particle size class
      const sizeClass =
        Math.random() < 0.6
          ? "small"
          : Math.random() < 0.9
          ? "medium"
          : "large";
      particle.className = `bg-particle ${sizeClass}`;

      // Random positions
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 100;
      const randomDelay = Math.random() * 20;

      // Apply styles
      particle.style.left = `${randomLeft}%`;
      particle.style.top = `${randomTop}%`;
      particle.style.animationDelay = `${randomDelay}s`;

      // Add slight color variation
      const hue = 15 + Math.random() * 20; // Range around orange/red hue
      const saturation = 80 + Math.random() * 20;
      const lightness = 60 + Math.random() * 20;
      particle.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;

      // Add to container
      particlesContainer.appendChild(particle);
    }
  }

  // Create shooting stars effect
  function createShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";

    // Random position and size
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight / 2);
    const size = 80 + Math.random() * 120;
    const duration = 1 + Math.random() * 2;

    // Apply styles
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    star.style.width = `${size}px`;
    star.style.animationDuration = `${duration}s`;

    // Add to container and remove after animation
    particlesContainer.appendChild(star);

    // Trigger the animation
    setTimeout(() => {
      star.style.opacity = "1";
      star.style.animation = `shootingStar ${duration}s linear forwards`;

      // Remove after animation completes
      setTimeout(() => {
        star.remove();
      }, duration * 1000);
    }, 100);
  }

  // Initialize particles
  createBackgroundParticles();

  // Recreate particles on window resize
  window.addEventListener("resize", createBackgroundParticles);

  // Periodically create shooting stars
  setInterval(createShootingStar, 4000);

  // Initial shooting star
  setTimeout(createShootingStar, 2000);
});
