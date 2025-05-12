/**
 * Anime-inspired Project Showcase
 * Creates interactive cinematic effects for project cards
 */
document.addEventListener("DOMContentLoaded", function () {
  // Project elements
  const projectCards = document.querySelectorAll(".project-card");
  const projectModal = document.getElementById("project-modal");
  const modalContainer = document.querySelector(".modal-container");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalClose = document.querySelector(".modal-close");
  const modalTitle = document.querySelector(".modal-title");
  const modalId = document.querySelector(".modal-id");
  const modalContent = document.querySelector(".modal-content");

  // Project data - can be expanded or loaded from an external source
  const projectData = {
    "kos-app": {
      title: "Kos-App (Boarding House Management)",
      id: "#PRJ-001",
      description:
        "Fullstack application to manage residents, payments, and operational tasks of boarding houses.",
      fullDescription: `
        <div class="project-detail-grid">
          <div class="project-detail-image">
            <img src="images/projects/kos-app-detail.jpg" alt="Kos-App Screenshot">
          </div>
          <div class="project-detail-content">
            <h4>Project Overview</h4>
            <p>A comprehensive solution for boarding house owners to manage their properties, tenants, and financial operations efficiently.</p>
            
            <h4>Key Features</h4>
            <ul>
              <li>Tenant management with profiles and history</li>
              <li>Room allocation and status tracking</li>
              <li>Payment processing and reminder system</li>
              <li>Expense tracking and financial reporting</li>
              <li>Maintenance request handling</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <div class="detail-tech-tags">
              <span class="tech-tag">Spring Boot</span>
              <span class="tech-tag">React</span>
              <span class="tech-tag">PostgreSQL</span>
              <span class="tech-tag">Docker</span>
              <span class="tech-tag">Railway</span>
            </div>
            
            <h4>Project Status</h4>
            <p>Currently in active development with 75% of features completed.</p>
          </div>
        </div>
      `,
      status: "ongoing",
    },
    digsig: {
      title: "Digital Signature Backend",
      id: "#PRJ-002",
      description:
        "Backend for creating and verifying digital signatures using RSA algorithm.",
      fullDescription: `
        <div class="project-detail-grid">
          <div class="project-detail-image">
            <img src="images/projects/digsig-detail.jpg" alt="Digital Signature Screenshot">
          </div>
          <div class="project-detail-content">
            <h4>Project Overview</h4>
            <p>A secure backend service that allows users to create and verify digital signatures for document authentication.</p>
            
            <h4>Key Features</h4>
            <ul>
              <li>RSA key pair generation and management</li>
              <li>Document hashing with SHA-256</li>
              <li>Digital signature creation and verification</li>
              <li>Secure API endpoints with JWT authentication</li>
              <li>Audit logging for security compliance</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <div class="detail-tech-tags">
              <span class="tech-tag">Java</span>
              <span class="tech-tag">Spring Boot</span>
              <span class="tech-tag">Spring Security</span>
              <span class="tech-tag">JWT</span>
              <span class="tech-tag">Cryptography</span>
            </div>
            
            <h4>Project Status</h4>
            <p>Completed and deployed. Available for integration via API.</p>
          </div>
        </div>
      `,
      status: "completed",
    },
    hacklab: {
      title: "Hack-Lab: Web Penetration Testing Simulator",
      id: "#PRJ-003",
      description:
        "An educational tool for security enthusiasts to understand common web vulnerabilities through hands-on practice.",
      fullDescription: `
        <div class="project-detail-grid">
          <div class="project-detail-image">
            <img src="images/projects/hacklab-detail.jpg" alt="Hack-Lab Screenshot">
          </div>
          <div class="project-detail-content">
            <h4>Project Overview</h4>
            <p>An isolated environment containing deliberately vulnerable web applications for practicing ethical hacking techniques safely.</p>
            
            <h4>Key Features</h4>
            <ul>
              <li>Containerized vulnerable applications</li>
              <li>Progressive difficulty levels</li>
              <li>Guided challenges with hints</li>
              <li>Common vulnerability simulations (SQLi, XSS, CSRF, etc.)</li>
              <li>Score tracking and achievement system</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <div class="detail-tech-tags">
              <span class="tech-tag">Docker</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">Express</span>
              <span class="tech-tag">MongoDB</span>
              <span class="tech-tag">Web Security</span>
            </div>
            
            <h4>Project Status</h4>
            <p>Private beta. Access limited to security training participants.</p>
          </div>
        </div>
      `,
      status: "locked",
    },
  };

  // Add click sound effect
  const clickSound = new Audio("sounds/tech-click.mp3");
  clickSound.volume = 0.3;

  // Apply enhanced interaction to project cards
  projectCards.forEach((card) => {
    // Add anime-style hover effect
    card.addEventListener("mouseenter", function () {
      // This subtle animation can make the card feel "alive"
      this.style.transition =
        "transform 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)";

      // Play subtle ambient sound on hover if needed
      // hoverSound.play();
    });

    // Handle card click to open project detail with animation
    card.querySelector(".view-btn").addEventListener("click", function (e) {
      e.preventDefault();

      // Play click sound
      clickSound.play();

      // Get project ID from data attribute
      const projectId = this.getAttribute("data-project");
      const project = projectData[projectId];

      if (project) {
        // Add opening animation class to the card
        card.classList.add("card-opening");

        // Set modal content
        modalTitle.textContent = project.title;
        modalId.textContent = project.id;
        modalContent.innerHTML = project.fullDescription;

        // Create scanner effect for modal open
        const scannerEffect = document.createElement("div");
        scannerEffect.className = "modal-scanner";
        modalContainer.appendChild(scannerEffect);

        // Add artificial delay for cinematic effect
        setTimeout(() => {
          // Open modal with animation
          projectModal.classList.add("active");

          // Remove scanner after animation completes
          setTimeout(() => {
            if (scannerEffect.parentNode) {
              scannerEffect.parentNode.removeChild(scannerEffect);
            }
          }, 1000);
        }, 300);
      }
    });
  });

  // Close modal when clicking outside or on close button
  modalOverlay.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);

  function closeModal() {
    // Play click sound
    clickSound.play();

    // Add closing animation
    projectModal.classList.add("closing");

    // After animation completes, hide modal
    setTimeout(() => {
      projectModal.classList.remove("active", "closing");
    }, 500);
  }

  // Interactive elements inside the modal should stop propagation
  modalContainer.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Add scroll reveal for project cards
  function revealProjects() {
    const windowHeight = window.innerHeight;
    const projects = document.querySelectorAll(".project-card");

    projects.forEach((project) => {
      const projectTop = project.getBoundingClientRect().top;

      if (projectTop < windowHeight - 150) {
        project.classList.add("visible");
      }
    });
  }

  // Check on scroll
  window.addEventListener("scroll", revealProjects);

  // Initial check
  revealProjects();

  // Add keyboard navigation for modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && projectModal.classList.contains("active")) {
      closeModal();
    }
  });
});
