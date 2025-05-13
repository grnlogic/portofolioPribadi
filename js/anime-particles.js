/**
 * Simplified background effects - removed excessive particles
 * Kept entrance animations and grid patterns
 */
document.addEventListener("DOMContentLoaded", function () {
  // Create container for minimal effects
  const effectsContainer = document.createElement("div");
  effectsContainer.id = "anime-effects";
  document.body.appendChild(effectsContainer);

  // Apply technical grid effect to sections if needed
  const applyTechyGridToSections = () => {
    // Apply to specific sections if desired
    const targetSections = document.querySelectorAll(".skills, .projects");
    targetSections.forEach((section) => {
      if (!section.classList.contains("techy-grid-bg")) {
        section.classList.add("techy-grid-bg");
      }
    });
  };

  // Initialize
  applyTechyGridToSections();

  // Handle window resize
  window.addEventListener("resize", () => {
    // Nothing to resize now that we've removed particles
  });
});
