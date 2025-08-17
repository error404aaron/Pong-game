// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = true;
let isPaused = false;
let gameOver = false;

// Game settings
const playerSpeed = 5;
const bulletSpeed = 7;
const alienSpeed = 1;
const alienBulletSpeed = 3;

// Player ship
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 40,
    width: 40,
    height: 20,
    speed: playerSpeed
};

// Aliens array
const aliens = [];
const alienRows = 5;
const alienCols = 10;
const alienWidth = 30;
const alienHeight = 20;
const alienSpacing = 10;

// Bullets arrays
const playerBullets = [];
const alienBullets = [];

// Game stats
let score = 0;
let lives = 3;
let alienDirection = 1; // 1 for right, -1 for left
let alienMoveDownTimer = 0;

// Key states
const keys = {
    left: false,
    right: false,
    space: false,
    spacePressed: false
};

// Initialize aliens
function initAliens() {
    aliens.length = 0;
    const startX = 50;
    const startY = 50;
    
    for (let row = 0; row < alienRows; row++) {
        for (let col = 0; col < alienCols; col++) {
            aliens.push({
                x: startX + col * (alienWidth + alienSpacing),
                y: startY + row * (alienHeight + alienSpacing),
                width: alienWidth,
                height: alienHeight,
                alive: true,
                type: row // Different alien types based on row
            });
        }
    }
}

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowleft':
            keys.left = true;
            break;
        case 'arrowright':
            keys.right = true;
            break;
        case ' ':
            if (!keys.spacePressed) {
                keys.space = true;
                keys.spacePressed = true;
            }
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowleft':
            keys.left = false;
            break;
        case 'arrowright':
            keys.right = false;
            break;
        case ' ':
            keys.spacePressed = false;
            break;
    }
});

// Update player position
function updatePlayer() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    
    // Handle shooting
    if (keys.space) {
        shoot();
        keys.space = false;
    }
}

// Shoot bullet
function shoot() {
    playerBullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: bulletSpeed
    });
}

// Update bullets
function updateBullets() {
    // Update player bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        bullet.y -= bullet.speed;
        
        // Remove bullets that go off screen
        if (bullet.y < 0) {
            playerBullets.splice(i, 1);
        }
    }
    
    // Update alien bullets
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i];
        bullet.y += bullet.speed;
        
        // Remove bullets that go off screen
        if (bullet.y > canvas.height) {
            alienBullets.splice(i, 1);
        }
    }
}

// Update aliens
function updateAliens() {
    let shouldMoveDown = false;
    
    // Check if aliens hit the edge
    for (const alien of aliens) {
        if (!alien.alive) continue;
        
        if ((alien.x <= 0 && alienDirection === -1) || 
            (alien.x + alien.width >= canvas.width && alienDirection === 1)) {
            shouldMoveDown = true;
            break;
        }
    }
    
    // Move aliens
    for (const alien of aliens) {
        if (!alien.alive) continue;
        
        if (shouldMoveDown) {
            alien.y += 20;
        } else {
            alien.x += alienSpeed * alienDirection;
        }
    }
    
    // Change direction if moving down
    if (shouldMoveDown) {
        alienDirection *= -1;
    }
    
    // Random alien shooting
    if (Math.random() < 0.002) {
        const aliveAliens = aliens.filter(alien => alien.alive);
        if (aliveAliens.length > 0) {
            const shootingAlien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            alienBullets.push({
                x: shootingAlien.x + shootingAlien.width / 2 - 2,
                y: shootingAlien.y + shootingAlien.height,
                width: 4,
                height: 10,
                speed: alienBulletSpeed
            });
        }
    }
}

// Check collisions
function checkCollisions() {
    // Player bullets vs aliens
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        
        for (const alien of aliens) {
            if (!alien.alive) continue;
            
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                
                // Hit!
                alien.alive = false;
                playerBullets.splice(i, 1);
                score += (5 - alien.type) * 10; // Different points for different alien types
                updateScoreDisplay();
                break;
            }
        }
    }
    
    // Alien bullets vs player
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i];
        
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {
            
            // Player hit!
            alienBullets.splice(i, 1);
            lives--;
            updateScoreDisplay();
            
            if (lives <= 0) {
                gameOver = true;
            }
            break;
        }
    }
    
    // Check if aliens reached the bottom
    for (const alien of aliens) {
        if (alien.alive && alien.y + alien.height >= player.y) {
            gameOver = true;
            break;
        }
    }
    
    // Check if all aliens are destroyed
    const aliveAliens = aliens.filter(alien => alien.alive);
    if (aliveAliens.length === 0) {
        // Respawn aliens (new wave)
        initAliens();
        // Increase difficulty slightly
        for (const alien of aliens) {
            alien.y += 20;
        }
    }
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('score1').textContent = score;
    document.getElementById('score2').textContent = lives;
}

// Draw everything on the canvas
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars (background effect)
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw player ship
    ctx.fillStyle = '#0f0';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Draw ship triangle
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw aliens
    for (const alien of aliens) {
        if (!alien.alive) continue;
        
        // Different colors for different alien types
        switch (alien.type) {
            case 0:
                ctx.fillStyle = '#f00';
                break;
            case 1:
                ctx.fillStyle = '#ff0';
                break;
            case 2:
                ctx.fillStyle = '#0ff';
                break;
            case 3:
                ctx.fillStyle = '#f0f';
                break;
            default:
                ctx.fillStyle = '#fff';
        }
        
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
    }
    
    // Draw player bullets
    ctx.fillStyle = '#0f0';
    for (const bullet of playerBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw alien bullets
    ctx.fillStyle = '#f00';
    for (const bullet of alienBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw pause message if paused
    if (isPaused) {
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
    
    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = '24px Arial';
        ctx.fillText('Press Reset Game to play again', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Main game loop
function gameLoop() {
    if (gameRunning && !isPaused && !gameOver) {
        updatePlayer();
        updateBullets();
        updateAliens();
        checkCollisions();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game function
function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    playerBullets.length = 0;
    alienBullets.length = 0;
    alienDirection = 1;
    player.x = canvas.width / 2 - 20;
    initAliens();
    updateScoreDisplay();
    isPaused = false;
}

// Toggle pause function
function togglePause() {
    isPaused = !isPaused;
}

// Initialize and start the game
initAliens();
updateScoreDisplay();
gameLoop();