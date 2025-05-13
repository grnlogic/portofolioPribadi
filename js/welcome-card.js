document.addEventListener("DOMContentLoaded", function () {
  // Welcome card elements
  const welcomeOverlay = document.getElementById("welcome-overlay");
  const welcomeCard = document.querySelector(".welcome-card");
  const continueBtn = document.querySelectorAll("#continue-btn");
  const mainContent = document.getElementById("main-content");
  const backBtn = document.querySelector(".back-btn");
  const rotationIndicator = document.querySelector(".rotation-indicator");

  // Create entrance animation container
  const entranceContainer = document.createElement("div");
  entranceContainer.className = "entrance-animation-container";
  welcomeOverlay.insertBefore(entranceContainer, welcomeCard);

  // Create lens flare effect container
  const lensFlare = document.createElement("div");
  lensFlare.className = "lens-flare";
  document.body.appendChild(lensFlare);

  // Apply body class for initial state
  document.body.classList.add("welcome-active");

  // 3D Rotation state
  let rotation = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Track if we're in entrance animation
  let entranceAnimationComplete = false;

  // Track mouse/touch state
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };

  // Trackball sensitivity
  const sensitivity = 0.5;

  // Apply 3D rotation to card
  function applyRotation() {
    // Only apply rotations after entrance animation
    if (entranceAnimationComplete) {
      welcomeCard.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;

      // Update rotation indicator
      if (rotationIndicator) {
        rotationIndicator.textContent = `X: ${Math.round(
          rotation.x
        )}° Y: ${Math.round(rotation.y)}° Z: ${Math.round(rotation.z)}°`;
      }
    }
  }

  // After entrance animation completes, enable rotation
  setTimeout(() => {
    entranceAnimationComplete = true;

    // Remove entrance container since animation is complete
    if (entranceContainer.parentNode) {
      entranceContainer.parentNode.removeChild(entranceContainer);
    }

    // Add subtle floating animation to the card
    addFloatingAnimation();

    // Now we can allow rotations
    setupRotationControls();
  }, 1500); // Slightly longer than entrance animation

  function setupRotationControls() {
    // Mouse events for 3D trackball rotation
    welcomeCard.addEventListener("mousedown", function (e) {
      // Don't start drag on buttons
      if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
        return;
      }

      isDragging = true;
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      welcomeCard.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;

      // Calculate mouse movement deltas
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Update rotation based on mouse movement (inverted Y for natural feeling)
      rotation.y += deltaX * sensitivity;
      rotation.x -= deltaY * sensitivity; // Invert for natural tilt

      // Apply new rotation
      applyRotation();

      // Update previous position
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      welcomeCard.style.cursor = "grab";
    });

    // ADD TOUCH EVENT HANDLERS FOR MOBILE DEVICES
    welcomeCard.addEventListener(
      "touchstart",
      function (e) {
        // Don't start drag on buttons
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
          return;
        }

        // Prevent scrolling while rotating
        e.preventDefault();

        isDragging = true;
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      function (e) {
        if (!isDragging) return;

        // Calculate touch movement deltas
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        // Update rotation based on touch movement (inverted Y for natural feeling)
        rotation.y += deltaX * sensitivity;
        rotation.x -= deltaY * sensitivity; // Invert for natural tilt

        // Apply new rotation
        applyRotation();

        // Update previous position
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      },
      { passive: true }
    );

    document.addEventListener("touchend", function () {
      isDragging = false;
    });

    // Handle rotation axis buttons
    const xAxisBtn = document.querySelector(".axis-x");
    const yAxisBtn = document.querySelector(".axis-y");
    const zAxisBtn = document.querySelector(".axis-z");
    const resetBtn = document.querySelector(".reset-view");

    if (xAxisBtn) {
      xAxisBtn.addEventListener("click", function () {
        rotation.x += 90;
        applyRotation();
      });
    }

    if (yAxisBtn) {
      yAxisBtn.addEventListener("click", function () {
        rotation.y += 90;
        applyRotation();
      });
    }

    if (zAxisBtn) {
      zAxisBtn.addEventListener("click", function () {
        rotation.z += 90;
        applyRotation();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        rotation = { x: 0, y: 0, z: 0 };
        applyRotation();
      });
    }
  }

  // Add subtle floating animation
  function addFloatingAnimation() {
    // Check for low-end devices
    const isLowPerfDevice =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    let floatingStartTime = null;
    const floatingDuration = 4000; // 4 seconds per cycle
    const floatingAmplitude = isLowPerfDevice ? 6 : 10; // Lower amplitude for low-end devices

    // Use a time-step that updates less frequently on low-end devices
    let lastFrameTime = 0;
    const frameInterval = isLowPerfDevice ? 50 : 0; // ms between updates (0 = every frame)

    function floatingAnimation(timestamp) {
      // First time initialization
      if (!floatingStartTime) floatingStartTime = timestamp;

      // Check if we should skip this frame on low-end devices
      if (isLowPerfDevice && timestamp - lastFrameTime < frameInterval) {
        requestAnimationFrame(floatingAnimation);
        return;
      }

      lastFrameTime = timestamp;

      const elapsed = timestamp - floatingStartTime;
      const normalizedTime = (elapsed % floatingDuration) / floatingDuration;

      // Only apply floating if not being dragged
      if (!isDragging) {
        // Simplified calculation for better performance
        const yOffset =
          Math.sin(normalizedTime * Math.PI * 2) * floatingAmplitude;
        const xOffset =
          Math.sin(normalizedTime * Math.PI * 2 + Math.PI / 2) *
          (floatingAmplitude * 0.3);

        // Apply floating transformation in addition to rotation
        // Use translateX/Y instead of translate for better performance
        welcomeCard.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) translateX(${xOffset}px) translateY(${yOffset}px)`;
      }

      // Continue animation if welcome overlay is still visible
      if (welcomeOverlay.style.display !== "none") {
        requestAnimationFrame(floatingAnimation);
      }
    }

    // Start the floating animation
    requestAnimationFrame(floatingAnimation);
  }

  // Simplified anime-style exit animation for better performance
  function animeExitAnimation() {
    // Add motion blur class
    welcomeCard.classList.add("motion-blur");

    // Check for low-end devices
    const isLowPerfDevice =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Skip the initial pulse animation on low-end devices
    if (!isLowPerfDevice) {
      welcomeCard.animate(
        [
          {
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(1)`,
          },
          {
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(1.05)`,
          },
          {
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(1)`,
          },
        ],
        { duration: 300, easing: "ease-out" }
      );
    }

    // Short pause before starting the exit animation
    setTimeout(
      () => {
        // Use fewer animation keyframes on low-end devices
        const keyframes = isLowPerfDevice
          ? [
              // Start with current rotation - simplified for low-end devices
              {
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) translateZ(0) scale(1)`,
                opacity: 1,
              },
              // Middle keyframe
              {
                transform: `rotateX(${rotation.x + 10}deg) rotateY(${
                  rotation.y + 180
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(300px) translateY(-100px) scale(0.5)`,
                opacity: 0.5,
              },
              // End keyframe
              {
                transform: `rotateX(${rotation.x + 25}deg) rotateY(${
                  rotation.y + 360
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(600px) translateY(-300px) scale(0)`,
                opacity: 0,
              },
            ]
          : [
              // Full animation for higher-end devices
              {
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) translateZ(0) scale(1)`,
                opacity: 1,
                filter: "blur(0px)",
              },
              {
                transform: `rotateX(${rotation.x + 5}deg) rotateY(${
                  rotation.y + 72
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(100px) translateY(-20px) scale(1.1)`,
                opacity: 0.9,
                filter: "blur(0px)",
              },
              {
                transform: `rotateX(${rotation.x + 10}deg) rotateY(${
                  rotation.y + 144
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(200px) translateY(-60px) scale(1.05)`,
                opacity: 0.8,
                filter: "blur(1px)",
              },
              {
                transform: `rotateX(${rotation.x + 15}deg) rotateY(${
                  rotation.y + 216
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(300px) translateY(-120px) scale(0.95)`,
                opacity: 0.6,
                filter: "blur(2px)",
              },
              {
                transform: `rotateX(${rotation.x + 20}deg) rotateY(${
                  rotation.y + 288
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(400px) translateY(-200px) scale(0.8)`,
                opacity: 0.3,
                filter: "blur(4px)",
              },
              {
                transform: `rotateX(${rotation.x + 25}deg) rotateY(${
                  rotation.y + 360
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(600px) translateY(-300px) scale(0)`,
                opacity: 0,
                filter: "blur(8px)",
              },
            ];

        // Create the exit animation with proper performance settings
        const exitAnimation = welcomeCard.animate(keyframes, {
          duration: isLowPerfDevice ? 800 : 1200,
          easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
          fill: "forwards",
        });

        // When exit animation is 60% complete, activate lens flare
        // Remove the forceLensFlare check and simplify
        if (!isLowPerfDevice) {
          setTimeout(() => {
            lensFlare.classList.add("active");
          }, isLowPerfDevice ? 400 : 800);
        }

        // After animation finishes, move to main content
        exitAnimation.onfinish = () => {
          welcomeOverlay.style.opacity = "0";
          welcomeOverlay.style.transition = "opacity 0.8s ease";
          document.body.classList.remove("welcome-active");

          setTimeout(() => {
            welcomeOverlay.style.display = "none";
            mainContent.classList.add("visible");

            // Add staggered entrance with fewer elements on low-end devices
            addStaggeredEntrance(isLowPerfDevice);
          }, 800);
        };
      },
      isLowPerfDevice ? 100 : 300
    );
  }

  // Function to add staggered entrance with performance optimization
  function addStaggeredEntrance(isLowPerformance = false) {
    // Target fewer elements on low-end devices
    const staggerTargets = isLowPerformance
      ? ["header", "#page-header h1", ".about-content h2", ".about-btns"]
      : [
          "header",
          "#page-header h1",
          ".breadcrumb",
          ".about-image",
          ".about-content h2",
          ".about-text",
          ".about-info",
          ".about-btns",
        ];

    // Add staggered-item class to targets
    staggerTargets.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.classList.add("staggered-item"));
    });

    // Activate with delay - use longer delays on low-end devices to prevent jank
    const delayIncrement = isLowPerformance ? 200 : 120;
    let delay = 300;

    staggerTargets.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        setTimeout(() => {
          el.classList.add("active");
        }, delay);
        delay += delayIncrement;
      });
    });
  }

  // Continue button click handler with anime-style exit
  continueBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      animeExitAnimation();

      // Clean up parallax effect event listeners when leaving
      if (typeof window.cleanupParallax === "function") {
        window.cleanupParallax();
      }
    });
  });

  // Back button functionality
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // Reset rotation with animated transition
      const originalX = rotation.x;
      const originalY = rotation.y;
      const originalZ = rotation.z;

      // Animate the rotation reset
      const resetDuration = 600; // ms
      const startTime = performance.now();

      function animateReset(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / resetDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

        rotation.x = originalX * (1 - easeProgress);
        rotation.y = originalY * (1 - easeProgress);
        rotation.z = originalZ * (1 - easeProgress);

        applyRotation();

        if (progress < 1) {
          requestAnimationFrame(animateReset);
        }
      }

      requestAnimationFrame(animateReset);
    });
  }
});
