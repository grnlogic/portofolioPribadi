/**
 * Anime-style animated background effects
 * Combines floating data particles and technical grid
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element for performance-optimized animations
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    document.body.appendChild(canvas);

    // Initialize canvas context
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle configuration
    const config = {
        particleCount: Math.min(100, window.innerWidth / 15), // Responsive count
        particleColor: '#ff6a46',
        particleSize: { min: 1, max: 3 },
        particleSpeed: { min: 0.2, max: 0.8 },
        gridSize: 40,
        gridColor: 'rgba(255, 106, 70, 0.1)',
        fadeDistance: 200
    };

    // Particle array
    let particles = [];

    // Create particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: config.particleSize.min + Math.random() * (config.particleSize.max - config.particleSize.min),
                speedY: -(config.particleSpeed.min + Math.random() * (config.particleSpeed.max - config.particleSpeed.min)),
                opacity: 0.1 + Math.random() * 0.5
            });
        }
    }

    // Draw grid background with anime-style effect
    function drawGrid() {
        ctx.strokeStyle = config.gridColor;
        ctx.lineWidth = 0.5;
        
        // Calculate grid offset for subtle movement
        const time = Date.now() * 0.0002;
        const offsetX = Math.sin(time) * 10;
        const offsetY = Math.cos(time) * 10;
        
        // Draw vertical lines
        for (let x = offsetX % config.gridSize; x < canvas.width; x += config.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = offsetY % config.gridSize; y < canvas.height; y += config.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Add glow spots at intersections (simulated digital nodes)
        const nodeInterval = config.gridSize * 2; // Show nodes at every other intersection
        for (let x = offsetX % nodeInterval; x < canvas.width; x += nodeInterval) {
            for (let y = offsetY % nodeInterval; y < canvas.height; y += nodeInterval) {
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

    // Draw data stream particles
    function drawParticles() {
        particles.forEach(particle => {
            // Move particle upward (data flowing up effect)
            particle.y += particle.speedY;
            
            // Reset if particle moves off screen
            if (particle.y < -10) {
                particle.y = canvas.height + 10;
                particle.x = Math.random() * canvas.width;
            }
            
            // Draw particle
            ctx.fillStyle = `rgba(255, 106, 70, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Optional: add tail effect for some particles
            if (particle.size > config.particleSize.min + 1) {
                ctx.fillStyle = `rgba(255, 106, 70, ${particle.opacity * 0.3})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y + 5, particle.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    // Occasionally create "shooting" data particles
    function createShootingParticle() {
        if (Math.random() > 0.95) {
            const x = Math.random() * canvas.width;
            const size = 2 + Math.random() * 2;
            const speed = 2 + Math.random() * 3;
            const opacity = 0.7 + Math.random() * 0.3;
            
            particles.push({
                x: x,
                y: canvas.height + 20,
                size: size,
                speedY: -speed, // Move faster than regular particles
                opacity: opacity,
                shooting: true
            });
        }
    }

    // Add mousemove effect to create interactive particles
    let mousePosition = { x: null, y: null };
    
    canvas.addEventListener('mousemove', (event) => {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
        
        // Add some particles around mouse position
        if (Math.random() > 0.8) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30;
            
            particles.push({
                x: mousePosition.x + Math.cos(angle) * distance,
                y: mousePosition.y + Math.sin(angle) * distance,
                size: 1 + Math.random() * 2,
                speedY: -(0.1 + Math.random() * 0.5),
                opacity: 0.3 + Math.random() * 0.5
            });
            
            // Keep particle count under control
            if (particles.length > config.particleCount * 1.5) {
                particles.shift();
            }
        }
    });

    // Clear mouse position when mouse leaves
    canvas.addEventListener('mouseleave', () => {
        mousePosition = { x: null, y: null };
    });

    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid background
        drawGrid();
        
        // Draw particles
        drawParticles();
        
        // Create shooting particles
        createShootingParticle();
        
        // Request next frame
        requestAnimationFrame(animate);
    }

    // Initialize
    createParticles();
    animate();
});
