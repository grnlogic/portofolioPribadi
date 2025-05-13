/**
 * Optimized Parallax Background Effect
 * Performance-focused version with reduced calculations
 */
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const parallaxContainer = document.getElementById("parallax-bg");
  const welcomeOverlay = document.getElementById("welcome-overlay");

  // Check if we have the required elements
  if (!parallaxContainer || !welcomeOverlay) return;

  // Get all layers
  const layers = parallaxContainer.querySelectorAll(".parallax-layer");

  // Detect device performance capability
  const isLowPerfDevice =
    window.matchMedia("(max-width: 768px)").matches ||
    !window.requestAnimationFrame ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Set performance mode automatically based on device
  let performanceMode = isLowPerfDevice ? "low" : "normal";

  // Simplified movement settings for better performance
  const moveSettings = {
    "layer-stars": { x: 0.01, y: 0.01 },
    "layer-mist": { x: 0.02, y: 0.02 },
    "layer-grid": { x: 0.03, y: 0.03 },
  };

  // Add twinkling stars with reduced count
  function createTwinklingStars() {
    const starsLayer = parallaxContainer.querySelector(".layer-stars");
    if (!starsLayer) return;

    // Clear existing stars
    const existingStars = starsLayer.querySelectorAll(".twinkling-star");
    existingStars.forEach((star) => star.remove());

    // Use fewer stars based on performance mode
    const starCount =
      performanceMode === "low" ? 10 : Math.min(window.innerWidth / 50, 25);

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "twinkling-star";

      // Random positions and timings
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const randomDelay = Math.random() * 4;

      star.style.left = `${randomX}%`;
      star.style.top = `${randomY}%`;
      star.style.animationDelay = `${randomDelay}s`;

      starsLayer.appendChild(star);
    }
  }

  // More efficient throttled mouse movement handler
  let ticking = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  function handleMouseMove(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallaxEffect(lastMouseX, lastMouseY);
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateParallaxEffect(mouseX, mouseY) {
    // Don't process in low performance mode
    if (performanceMode === "low") return;

    const rect = welcomeOverlay.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalized offset (-1 to 1)
    const offsetX = (mouseX - rect.left - centerX) / centerX;
    const offsetY = (mouseY - rect.top - centerY) / centerY;

    // Apply movement to each layer with specific intensity
    layers.forEach((layer) => {
      // Get the layer type from its class
      const layerClass = Array.from(layer.classList).find((cls) =>
        cls.startsWith("layer-")
      );

      if (layerClass && moveSettings[layerClass]) {
        const { x, y } = moveSettings[layerClass];

        // Simplified transform for better performance
        const moveX = -offsetX * x * 100;
        const moveY = -offsetY * y * 100;

        // Use translateX/Y instead of translate3d for better performance
        layer.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
      }
    });
  }

  // Simplified device orientation handler for low-end devices
  function handleDeviceOrientation(e) {
    // Skip in low performance mode
    if (performanceMode === "low") return;

    if (!e.beta || !e.gamma) return;

    // Throttle device orientation events by skipping some frames
    if (Math.random() < 0.5) return; // Only process ~50% of events

    // Simplified calculations with less precision but better performance
    const offsetY = Math.round((e.beta - 45) / 5) / 9;
    const offsetX = Math.round(e.gamma / 5) / 9;

    layers.forEach((layer) => {
      const layerClass = Array.from(layer.classList).find((cls) =>
        cls.startsWith("layer-")
      );

      if (layerClass && moveSettings[layerClass]) {
        const { x, y } = moveSettings[layerClass];

        // Simplified transform with rounded values
        const moveX = -Math.round(offsetX * x * 100);
        const moveY = -Math.round(offsetY * y * 100);

        layer.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
      }
    });
  }

  // Remove the togglePerformanceMode function
  // window.togglePerformanceMode = function () {...}

  // Initialize parallax with performance considerations
  function initParallax() {
    // Create fewer stars
    createTwinklingStars();

    // Only add mouse events in normal performance mode
    if (performanceMode === "normal") {
      welcomeOverlay.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });

      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleDeviceOrientation, {
          passive: true,
        });
      }
    }

    // Always handle resize but with throttling
    let resizeTimeout;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createTwinklingStars, 300);
      },
      { passive: true }
    );

    // Reset position when mouse leaves
    welcomeOverlay.addEventListener(
      "mouseleave",
      function () {
        if (performanceMode === "low") return;

        layers.forEach((layer) => {
          layer.style.transform = "none";
        });
      },
      { passive: true }
    );

    // Initially hide heavy layers on low-performance devices
    if (performanceMode === "low") {
      document.querySelector(".layer-spotlight")?.classList.add("hidden");
      document.querySelector(".layer-scanlines")?.classList.add("hidden");
    }
  }

  // Initialize
  initParallax();

  // Cleanup function
  window.cleanupParallax = function () {
    welcomeOverlay.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("deviceorientation", handleDeviceOrientation);
  };
});
