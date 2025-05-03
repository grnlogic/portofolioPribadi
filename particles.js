// Initialize the particles canvas
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

// Track current theme colors
let particleColor =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--particle-color")
    .trim() || "#3B82F6";
let particleLineColor =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--particle-line-color")
    .trim() || "rgba(59, 130, 246, 0.2)";

// Public function to update particle colors when theme changes
function updateParticleTheme(theme) {
  const root = document.documentElement;
  particleColor = getComputedStyle(root)
    .getPropertyValue("--particle-color")
    .trim();
  particleLineColor = getComputedStyle(root)
    .getPropertyValue("--particle-line-color")
    .trim();

  // Update existing particles with new colors
  particles.forEach((p) => {
    p.color = p.followMouse ? particleColor : particleColor;
  });
}

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
    this.color = particleColor;
    this.opacity = Math.random() * 0.5 + 0.1; // Opacity between 0.1-0.6

    // New property: assign some particles to follow the mouse
    this.followMouse = Math.random() > 0.8; // 20% of particles will follow the mouse
    this.followSpeed = Math.random() * 0.05 + 0.02; // Speed at which particles follow the mouse

    // Add orbital properties
    this.orbitRadius = Math.random() * 50 + 30; // Random orbit radius between 30-80px
    this.orbitSpeed =
      (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1); // Random orbit speed with random direction
    this.angle = Math.random() * Math.PI * 2; // Random starting angle
    this.inOrbit = false; // Track if particle is currently in orbit
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

  // Draw the particle with current theme color
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.followMouse ? particleColor : this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Follow the mouse with orbital behavior
  follow() {
    if (this.followMouse && mouse.x !== null && mouse.y !== null) {
      // Calculate direction to mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.orbitRadius + 10) {
        // Particle is close enough to enter orbit
        this.inOrbit = true;

        // Calculate orbital position
        this.angle += this.orbitSpeed;
        const targetX = mouse.x + Math.cos(this.angle) * this.orbitRadius;
        const targetY = mouse.y + Math.sin(this.angle) * this.orbitRadius;

        // Smoothly move to the orbital position
        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
      } else if (distance < mouse.radius * 1.5) {
        // Particle is approaching the orbit
        this.inOrbit = false;

        // Move towards mouse but start to curve as it gets closer
        const approachFactor = Math.min(0.05, 5 / distance);

        // Add slight tangential movement as it approaches
        const tangentialFactor = 0.2 * (this.orbitRadius / distance);
        const perpX = -dy / distance;
        const perpY = dx / distance;

        this.x +=
          dx * approachFactor + perpX * tangentialFactor * this.orbitSpeed * 10;
        this.y +=
          dy * approachFactor + perpY * tangentialFactor * this.orbitSpeed * 10;
      } else {
        // Regular attraction from a distance
        this.inOrbit = false;

        // Move towards mouse with a weaker force based on distance
        const forceStrength = Math.min(0.02, 10 / distance);
        this.x += dx * forceStrength * this.followSpeed;
        this.y += dy * forceStrength * this.followSpeed;
      }
    }
  }
}

// Add ShootingStar class
class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    // Start from left side of screen at random height
    this.x = 0;
    this.y = (Math.random() * canvas.height) / 2;
    this.size = Math.random() * 2 + 2;
    this.speed = Math.random() * 8 + 10;
    this.tail = [];
    this.maxTailLength = Math.floor(Math.random() * 50) + 50;
    this.color = particleColor;
    this.opacity = 0;
    this.fadeIn = true;
    this.finished = false;
  }

  update() {
    // Move diagonally down and right
    this.x += this.speed;
    this.y += this.speed / 2;

    // Fade in then fade out
    if (this.fadeIn) {
      this.opacity += 0.03;
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.fadeIn = false;
      }
    } else {
      this.opacity -= 0.01;
      if (this.opacity <= 0) {
        this.opacity = 0;
      }
    }

    // Store current position in tail
    this.tail.unshift({ x: this.x, y: this.y });

    // Limit tail length
    if (this.tail.length > this.maxTailLength) {
      this.tail.pop();
    }

    // Check if shooting star is off screen
    if (this.x > canvas.width || this.y > canvas.height) {
      // Reset for next appearance if it's completely off screen
      if (
        this.tail.length === 0 ||
        this.tail[this.tail.length - 1].x > canvas.width ||
        this.tail[this.tail.length - 1].y > canvas.height
      ) {
        this.finished = true;
      }
    }
  }

  draw() {
    if (this.tail.length === 0) return;

    // Draw tail
    ctx.beginPath();
    ctx.moveTo(this.tail[0].x, this.tail[0].y);

    for (let i = 1; i < this.tail.length; i++) {
      ctx.lineTo(this.tail[i].x, this.tail[i].y);
    }

    // Create gradient for tail
    const gradient = ctx.createLinearGradient(
      this.tail[0].x,
      this.tail[0].y,
      this.tail[this.tail.length - 1].x,
      this.tail[this.tail.length - 1].y
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(0.3, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.size;
    ctx.stroke();

    // Draw star at the head
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// Create particle array
const particles = [];
const particleCount = Math.min(window.innerWidth / 10, 100); // Adjust particle count based on screen size

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Create shooting stars array
const shootingStars = [new ShootingStar()];
let lastShootingStarTime = Date.now();

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

// Main animation loop with updated line colors
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Regular particles
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
        // Use the theme-based line color
        const opacity = 0.2 - (distance / 100) * 0.2;
        const color = particleLineColor.replace(/[\d.]+\)$/, `${opacity})`);
        ctx.strokeStyle = color;
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
        // For regular particles, create a swirling effect around the cursor
        const swirl = 0.3;
        const repelForce = (mouse.radius - distance) / mouse.radius;

        // Calculate perpendicular vectors for tangential movement
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        const perpX = -normalizedDy;
        const perpY = normalizedDx;

        // Move tangentially with some repulsion
        particles[i].x +=
          normalizedDx * repelForce * 0.3 + perpX * swirl * repelForce;
        particles[i].y +=
          normalizedDy * repelForce * 0.3 + perpY * swirl * repelForce;
      }
    }
  }

  // Shooting stars logic
  const currentTime = Date.now();
  const timeSinceLastStar = currentTime - lastShootingStarTime;

  // Randomly create new shooting stars every 2-6 seconds
  if (timeSinceLastStar > Math.random() * 4000 + 2000) {
    if (shootingStars.length < 3) {
      // Limit to 3 shooting stars at once
      shootingStars.push(new ShootingStar());
      lastShootingStarTime = currentTime;
    }
  }

  // Update and draw shooting stars
  for (let i = 0; i < shootingStars.length; i++) {
    shootingStars[i].update();
    shootingStars[i].draw();

    // Remove finished shooting stars
    if (shootingStars[i].finished) {
      shootingStars[i].reset();
      shootingStars[i].finished = false;

      // Only keep one shooting star in the array when not active
      if (shootingStars.length > 1) {
        shootingStars.splice(i, 1);
        i--;
      }
    }
  }

  requestAnimationFrame(animate);
}

// Start animation
animate();
