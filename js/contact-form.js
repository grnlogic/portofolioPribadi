document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const messageDiv = document.getElementById("contact-message");

  // Check for contact status in URL parameters (for non-AJAX fallback)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("contact")) {
    const status = urlParams.get("contact");
    const message = urlParams.get("message");

    if (status && message) {
      messageDiv.textContent = decodeURIComponent(message);
      messageDiv.className =
        status === "success" ? "success-message" : "error-message";

      // Scroll to the message
      if (messageDiv.offsetParent !== null) {
        messageDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  // Handle form submission
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        messageDiv.textContent = "Please fill in all fields";
        messageDiv.className = "error-message";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        messageDiv.textContent = "Please enter a valid email address";
        messageDiv.className = "error-message";
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = "Sending...";
      submitBtn.disabled = true;

      const formData = new FormData(this);

      fetch("http://localhost:8000/process_contact.php", {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          messageDiv.textContent = data.message;
          messageDiv.className = data.success
            ? "success-message"
            : "error-message";

          if (data.success) {
            contactForm.reset();

            // Show success animation
            if (messageDiv.offsetParent !== null) {
              messageDiv.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }

          // Reset button state
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        })
        .catch((error) => {
          messageDiv.textContent = "An error occurred. Please try again.";
          messageDiv.className = "error-message";
          console.error("Error:", error);

          // Reset button state
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
});
