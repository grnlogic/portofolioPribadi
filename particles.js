// Initialize the particles canvas
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

// Set canvas to full window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Call resize initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1; // Particle size between 1-4
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = "#3B82F6";
    this.opacity = Math.random() * 0.5 + 0.1; // Opacity between 0.1-0.6

    // New property: assign some particles to follow the mouse
    this.followMouse = Math.random() > 0.8; // 20% of particles will follow the mouse
    this.followSpeed = Math.random() * 0.05 + 0.02; // Speed at which particles follow the mouse
  }

  // Move the particle
  update() {
    // Original movement behavior for non-following particles
    if (!this.followMouse) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }
    // For mouse-following particles, we'll update their position in the animate function
  }

  // Draw the particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.followMouse ? "#2563EB" : this.color; // Slightly different color for following particles
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Follow the mouse
  follow() {
    if (this.followMouse && mouse.x !== null && mouse.y !== null) {
      // Calculate direction to mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only move if particle is not too close to mouse
      if (distance > 5) {
        // Move towards mouse
        this.x += (dx / distance) * this.followSpeed * distance * 0.05;
        this.y += (dy / distance) * this.followSpeed * distance * 0.05;
      }
    }
  }
}

// Create particle array
const particles = [];
const particleCount = Math.min(window.innerWidth / 10, 100); // Adjust particle count based on screen size

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Mouse position tracking
let mouse = {
  x: null,
  y: null,
  radius: 150, // Mouse influence radius
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Mouse leave handling - return particles to original behavior
window.addEventListener("mouseout", function () {
  mouse.x = null;
  mouse.y = null;
});

// Main animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].follow(); // Call the follow method for each particle
    particles[i].draw();

    // Connect particles with lines if they're close
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 - (distance / 100) * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Mouse interaction for non-following particles
    if (mouse.x !== null && mouse.y !== null && !particles[i].followMouse) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        // Push particles away from mouse
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;

        const directionX = forceDirectionX * force * 0.6;
        const directionY = forceDirectionY * force * 0.6;

        particles[i].x += directionX;
        particles[i].y += directionY;
      }
    }
  }

  requestAnimationFrame(animate);
}

// Start animation
animate();
