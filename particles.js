/**
 * Simplified technical grid background effect
 * Removed excessive floating particles
 */
document.addEventListener("DOMContentLoaded", function () {
  // Create canvas element for technical grid background
  const canvas = document.createElement("canvas");
  canvas.id = "particles";
  document.body.appendChild(canvas);

  // Initialize canvas context
  const ctx = canvas.getContext("2d");

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Configuration for grid
  const config = {
    gridSize: 40,
    gridColor: "rgba(255, 106, 70, 0.1)",
  };

  // Draw grid background with anime-style effect
  function drawGrid() {
    ctx.strokeStyle = config.gridColor;
    ctx.lineWidth = 0.5;

    // Calculate grid offset for subtle movement
    const time = Date.now() * 0.0002;
    const offsetX = Math.sin(time) * 10;
    const offsetY = Math.cos(time) * 10;

    // Draw vertical lines
    for (
      let x = offsetX % config.gridSize;
      x < canvas.width;
      x += config.gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (
      let y = offsetY % config.gridSize;
      y < canvas.height;
      y += config.gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Add glow spots at intersections (simulated digital nodes)
    const nodeInterval = config.gridSize * 2; // Show nodes at every other intersection
    for (let x = offsetX % nodeInterval; x < canvas.width; x += nodeInterval) {
      for (
        let y = offsetY % nodeInterval;
        y < canvas.height;
        y += nodeInterval
      ) {
        // Create pulsing effect
        const pulse = Math.sin(time * 5 + x + y) * 0.5 + 0.5;
        const radius = 1 + pulse * 2;

        ctx.fillStyle = `rgba(255, 106, 70, ${0.1 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Animation loop - only drawing grid, no particles
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    drawGrid();

    // Request next frame
    requestAnimationFrame(animate);
  }

  // Initialize animation
  animate();
});
