document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.querySelector(".newsletter-form");
  const messageDiv = document.getElementById("newsletter-message");

  // Check for subscription status in URL parameters (for non-AJAX fallback)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("subscription")) {
    const status = urlParams.get("subscription");
    const message = urlParams.get("message");

    if (status && message) {
      messageDiv.textContent = decodeURIComponent(message);
      messageDiv.className =
        status === "success" ? "success-message" : "error-message";
    }
  }

  // Handle form submission
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("process_newsletter.php", {
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
          newsletterForm.reset();
        }
      })
      .catch((error) => {
        messageDiv.textContent = "An error occurred. Please try again.";
        messageDiv.className = "error-message";
        console.error("Error:", error);
      });
  });
});
