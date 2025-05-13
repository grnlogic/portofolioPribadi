document.addEventListener("DOMContentLoaded", function () {
  // Welcome card elements
  const welcomeOverlay = document.getElementById("welcome-overlay");
  const welcomeCard = document.querySelector(".welcome-card");
  const welcomeCardInner = document.querySelector(".welcome-card-inner");
  const mainContent = document.getElementById("main-content");
  const backBtn = document.querySelector(".back-btn");
  const flipBtn = document.querySelector(".flip-btn");
  const continueBtns = document.querySelectorAll(".continue-btn");

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

  // Track if card is flipped
  let isCardFlipped = false;

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
      // Apply rotation to the whole card
      welcomeCard.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;

      // Apply separate flip transform to inner card if needed
      if (isCardFlipped) {
        welcomeCardInner.style.transform = "rotateY(180deg)";
      } else {
        welcomeCardInner.style.transform = "rotateY(0deg)";
      }
    }
  }

  // After entrance animation completes
  setTimeout(() => {
    entranceAnimationComplete = true;

    // Remove entrance container since animation is complete
    if (entranceContainer.parentNode) {
      entranceContainer.parentNode.removeChild(entranceContainer);
    }

    // Setup mouse/touch 3D rotation
    setupRotationControls();

    // Add floating animation (simplified)
    addFloatingAnimation();

    // Prepare flip functionality (separate from 3D rotation)
    setupFlipControls();
  }, 1500); // Slightly longer than entrance animation

  // Setup flip controls
  function setupFlipControls() {
    // Flip button on front of card
    if (flipBtn) {
      flipBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        flipCard();
      });
    }

    // Back button on back of card
    if (backBtn) {
      backBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        isCardFlipped = false;
        applyRotation();
      });
    }
  }

  // Function to setup rotation controls
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

    // Touch event handlers for mobile devices
    welcomeCard.addEventListener(
      "touchstart",
      function (e) {
        // Don't start drag on buttons or badge elements
        if (
          e.target.tagName === "BUTTON" ||
          e.target.closest("button") ||
          e.target.classList.contains("card-badge")
        ) {
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

        // Adjusted sensitivity for mobile
        const mobileSensitivity = sensitivity * 0.7;

        // Update rotation based on touch movement
        rotation.y += deltaX * mobileSensitivity;
        rotation.x -= deltaY * mobileSensitivity;

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

    // Add keyboard rotation controls for accessibility
    document.addEventListener("keydown", function (e) {
      if (!entranceAnimationComplete) return;

      // Only process if welcome card is visible
      if (welcomeOverlay.style.display === "none") return;

      const rotationStep = 15; // degrees per keypress

      switch (e.key) {
        case "ArrowUp":
          rotation.x -= rotationStep;
          break;
        case "ArrowDown":
          rotation.x += rotationStep;
          break;
        case "ArrowLeft":
          rotation.y -= rotationStep;
          break;
        case "ArrowRight":
          rotation.y += rotationStep;
          break;
        case "PageUp":
          rotation.z += rotationStep;
          break;
        case "PageDown":
          rotation.z -= rotationStep;
          break;
        case "Home":
          rotation = { x: 0, y: 0, z: 0 };
          break;
        case " ": // Space bar to flip
          flipCard();
          break;
      }

      applyRotation();
    });
  }

  // Function to flip card
  function flipCard() {
    isCardFlipped = !isCardFlipped;
    applyRotation();
  }

  // Add subtle floating animation (simplified)
  function addFloatingAnimation() {
    const isLowPerfDevice =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    let floatingStartTime = null;
    const floatingDuration = 4000;
    const floatingAmplitude = isLowPerfDevice ? 4 : 6;

    function floatingAnimation(timestamp) {
      if (!floatingStartTime) floatingStartTime = timestamp;

      const elapsed = timestamp - floatingStartTime;
      const normalizedTime = (elapsed % floatingDuration) / floatingDuration;

      const yOffset =
        Math.sin(normalizedTime * Math.PI * 2) * floatingAmplitude;

      // Combine floating effect with rotation
      const currentRotateX = rotation.x;
      const currentRotateY = rotation.y;
      const currentRotateZ = rotation.z;

      welcomeCard.style.transform = `translateY(${yOffset}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) rotateZ(${currentRotateZ}deg)`;

      if (welcomeOverlay.style.display !== "none") {
        requestAnimationFrame(floatingAnimation);
      }
    }

    requestAnimationFrame(floatingAnimation);
  }

  // Continue button click handler with anime-style exit
  continueBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      animeExitAnimation();

      // Clean up parallax effect event listeners when leaving
      if (typeof window.cleanupParallax === "function") {
        window.cleanupParallax();
      }
    });
  });

  // Keep the existing exit animation function but adjust to use real rotation values
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
              // Start with current rotation
              {
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) translateZ(0) scale(1)`,
                opacity: 1,
              },
              // Middle keyframe - extra rotation
              {
                transform: `rotateX(${rotation.x + 10}deg) rotateY(${
                  rotation.y + 180
                }deg) rotateZ(${
                  rotation.z
                }deg) translateZ(300px) translateY(-100px) scale(0.5)`,
                opacity: 0.5,
              },
              // End keyframe - full 360 rotation
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
        if (!isLowPerfDevice) {
          setTimeout(
            () => {
              lensFlare.classList.add("active");
            },
            isLowPerfDevice ? 400 : 800
          );
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

  // Keep the existing staggered entrance function
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
});
