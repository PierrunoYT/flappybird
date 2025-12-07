const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const highScoreElement = document.getElementById('highScore');

// Base game dimensions (design resolution)
const BASE_WIDTH = 400;
const BASE_HEIGHT = 600;

// Scaling factor
let scale = 1;

// Game constants (will be scaled)
const BASE_GRAVITY = 0.5;
const BASE_FLAP_STRENGTH = -9;
const BASE_PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 1500;
const BASE_PIPE_GAP = 160;
const BASE_PIPE_WIDTH = 70;
const BASE_GROUND_HEIGHT = 80;

// Scaled values (updated on resize)
let GRAVITY, FLAP_STRENGTH, PIPE_SPEED, PIPE_GAP, PIPE_WIDTH, GROUND_HEIGHT;

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
highScoreElement.textContent = highScore;

// Bird object
const bird = {
    x: 80,
    y: BASE_HEIGHT / 2,
    width: 40,
    height: 30,
    velocity: 0,
    rotation: 0
};

// Pipes array
let pipes = [];
let lastPipeSpawn = 0;

// Clouds for background
let clouds = [];

// Ground animation
let groundOffset = 0;

// Particle system for trail
let particles = [];

// Initialize clouds
function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.4),
            size: (30 + Math.random() * 40) * scale,
            speed: (0.3 + Math.random() * 0.5) * scale
        });
    }
}

// Resize canvas to fit screen
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const maxWidth = window.innerWidth - 20;
    const maxHeight = window.innerHeight - 180;
    
    // Calculate scale to fit while maintaining aspect ratio
    const scaleX = maxWidth / BASE_WIDTH;
    const scaleY = maxHeight / BASE_HEIGHT;
    scale = Math.min(scaleX, scaleY, 1.5); // Cap at 1.5x for larger screens
    
    // Minimum scale for very small screens
    scale = Math.max(scale, 0.5);
    
    canvas.width = Math.floor(BASE_WIDTH * scale);
    canvas.height = Math.floor(BASE_HEIGHT * scale);
    
    // Update scaled values
    GRAVITY = BASE_GRAVITY * scale;
    FLAP_STRENGTH = BASE_FLAP_STRENGTH * scale;
    PIPE_SPEED = BASE_PIPE_SPEED * scale;
    PIPE_GAP = BASE_PIPE_GAP * scale;
    PIPE_WIDTH = BASE_PIPE_WIDTH * scale;
    GROUND_HEIGHT = BASE_GROUND_HEIGHT * scale;
    
    // Update bird position and size
    bird.x = 80 * scale;
    bird.width = 40 * scale;
    bird.height = 30 * scale;
    
    // Reinitialize clouds with new scale
    initClouds();
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes = [];
    particles = [];
    score = 0;
    lastPipeSpawn = 0;
    gameState = 'playing';
}

function flap() {
    if (gameState === 'start') {
        resetGame();
    } else if (gameState === 'playing') {
        bird.velocity = FLAP_STRENGTH;
        // Add particles on flap
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: bird.x,
                y: bird.y + bird.height / 2,
                vx: (-Math.random() * 3 - 1) * scale,
                vy: (Math.random() * 2 - 1) * scale,
                life: 30,
                size: (3 + Math.random() * 4) * scale
            });
        }
    } else if (gameState === 'gameover') {
        resetGame();
    }
}

function spawnPipe() {
    const minHeight = 80 * scale;
    const maxHeight = canvas.height - PIPE_GAP - minHeight - GROUND_HEIGHT - 20 * scale;
    const topHeight = minHeight + Math.random() * maxHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_GAP,
        passed: false
    });
}

function update() {
    if (gameState !== 'playing') return;

    // Update bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    bird.rotation = Math.min(Math.max(bird.velocity * 3 / scale, -30), 90);

    // Update particles
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
    });

    // Spawn pipes
    const now = Date.now();
    if (now - lastPipeSpawn > PIPE_SPAWN_INTERVAL) {
        spawnPipe();
        lastPipeSpawn = now;
    }

    // Update pipes
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;

        // Score when passing pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            score++;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    // Update ground offset
    groundOffset = (groundOffset + PIPE_SPEED) % (40 * scale);

    // Update clouds
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size < 0) {
            cloud.x = canvas.width + cloud.size;
            cloud.y = Math.random() * (canvas.height * 0.4);
        }
    });

    // Collision detection
    checkCollision();
}

function checkCollision() {
    // Ground and ceiling
    if (bird.y + bird.height > canvas.height - GROUND_HEIGHT || bird.y < 0) {
        gameOver();
        return;
    }

    // Pipes
    const birdBox = {
        x: bird.x - bird.width / 2 + 5 * scale,
        y: bird.y - bird.height / 2 + 5 * scale,
        width: bird.width - 10 * scale,
        height: bird.height - 10 * scale
    };

    for (const pipe of pipes) {
        // Top pipe
        if (rectCollision(birdBox, {
            x: pipe.x,
            y: 0,
            width: PIPE_WIDTH,
            height: pipe.topHeight
        })) {
            gameOver();
            return;
        }

        // Bottom pipe
        if (rectCollision(birdBox, {
            x: pipe.x,
            y: pipe.bottomY,
            width: PIPE_WIDTH,
            height: canvas.height - pipe.bottomY - GROUND_HEIGHT
        })) {
            gameOver();
            return;
        }
    }
}

function rectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameOver() {
    gameState = 'gameover';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
}

function draw() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_HEIGHT);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.5, '#98D8C8');
    skyGradient.addColorStop(1, '#F7DC6F');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
        drawCloud(cloud.x, cloud.y, cloud.size);
    });

    // Draw pipes
    pipes.forEach(pipe => {
        drawPipe(pipe);
    });

    // Draw particles
    particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 220, 100, ${p.life / 30})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / 30), 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw bird
    drawBird();

    // Draw ground
    drawGround();

    // Draw score
    if (gameState === 'playing') {
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(48 * scale)}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6 * scale;
        ctx.strokeText(score, canvas.width / 2, 80 * scale);
        ctx.fillText(score, canvas.width / 2, 80 * scale);
    }

    // Draw start screen
    if (gameState === 'start') {
        drawOverlay('TAP TO START', '#ffd93d');
    }

    // Draw game over screen
    if (gameState === 'gameover') {
        drawOverlay('GAME OVER', '#e74c3c');
        
        ctx.font = `${Math.floor(16 * scale)}px "Press Start 2P"`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4 * scale;
        ctx.strokeText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20 * scale);
        ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20 * scale);
        
        ctx.font = `${Math.floor(10 * scale)}px "Press Start 2P"`;
        ctx.strokeText('TAP TO RETRY', canvas.width / 2, canvas.height / 2 + 60 * scale);
        ctx.fillText('TAP TO RETRY', canvas.width / 2, canvas.height / 2 + 60 * scale);
    }
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation * Math.PI / 180);

    // Body
    ctx.fillStyle = '#FFD93D';
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E8A317';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Wing
    const wingOffset = Math.sin(Date.now() / 50) * 3 * scale;
    ctx.fillStyle = '#F4A460';
    ctx.beginPath();
    ctx.ellipse(-5 * scale, wingOffset, 12 * scale, 8 * scale, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CD853F';
    ctx.stroke();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(10 * scale, -5 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(12 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(13 * scale, -6 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.moveTo(18 * scale, 0);
    ctx.lineTo(28 * scale, 3 * scale);
    ctx.lineTo(18 * scale, 8 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#CC4400';
    ctx.stroke();

    ctx.restore();
}

function drawPipe(pipe) {
    const capHeight = 30 * scale;
    const capOverhang = 8 * scale;

    // Pipe gradient
    const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    pipeGradient.addColorStop(0, '#2ECC71');
    pipeGradient.addColorStop(0.3, '#58D68D');
    pipeGradient.addColorStop(0.5, '#82E0AA');
    pipeGradient.addColorStop(0.7, '#58D68D');
    pipeGradient.addColorStop(1, '#27AE60');

    // Top pipe body
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - capHeight);
    
    // Top pipe cap
    ctx.fillRect(pipe.x - capOverhang, pipe.topHeight - capHeight, PIPE_WIDTH + capOverhang * 2, capHeight);
    
    // Top pipe border
    ctx.strokeStyle = '#1E8449';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - capHeight);
    ctx.strokeRect(pipe.x - capOverhang, pipe.topHeight - capHeight, PIPE_WIDTH + capOverhang * 2, capHeight);

    // Bottom pipe body
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(pipe.x, pipe.bottomY + capHeight, PIPE_WIDTH, canvas.height - pipe.bottomY - GROUND_HEIGHT - capHeight);
    
    // Bottom pipe cap
    ctx.fillRect(pipe.x - capOverhang, pipe.bottomY, PIPE_WIDTH + capOverhang * 2, capHeight);
    
    // Bottom pipe border
    ctx.strokeRect(pipe.x, pipe.bottomY + capHeight, PIPE_WIDTH, canvas.height - pipe.bottomY - GROUND_HEIGHT - capHeight);
    ctx.strokeRect(pipe.x - capOverhang, pipe.bottomY, PIPE_WIDTH + capOverhang * 2, capHeight);

    // Highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(pipe.x + 8 * scale, 0, 8 * scale, pipe.topHeight - capHeight);
    ctx.fillRect(pipe.x + 8 * scale, pipe.bottomY + capHeight, 8 * scale, canvas.height - pipe.bottomY - GROUND_HEIGHT - capHeight);
}

function drawGround() {
    // Ground base
    const groundGradient = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(0.2, '#A0522D');
    groundGradient.addColorStop(1, '#654321');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 20 * scale);
    
    // Grass pattern
    ctx.fillStyle = '#32CD32';
    const grassWidth = 40 * scale;
    for (let i = -groundOffset; i < canvas.width + grassWidth; i += grassWidth) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - GROUND_HEIGHT);
        ctx.lineTo(i + grassWidth / 2, canvas.height - GROUND_HEIGHT - 15 * scale);
        ctx.lineTo(i + grassWidth, canvas.height - GROUND_HEIGHT);
        ctx.fill();
    }

    // Ground line
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();
}

function drawOverlay(text, color) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `${Math.floor(24 * scale)}px "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 6 * scale;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2 - 30 * scale);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 30 * scale);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    flap();
}, { passive: false });

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        flap();
    }
});

// Handle resize
window.addEventListener('resize', () => {
    resizeCanvas();
    // Reset bird Y position on resize if not playing
    if (gameState === 'start') {
        bird.y = canvas.height / 2;
    }
});

// Prevent context menu on long press
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent scrolling when touching canvas
document.body.addEventListener('touchmove', (e) => {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize
resizeCanvas();
bird.y = canvas.height / 2;
gameLoop();
