// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = true;
let isPaused = false;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = 5;

// Player 1 paddle (left)
const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Player 2 paddle (right)
const player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 4,
    dy: 3
};

// Scores
let score1 = 0;
let score2 = 0;

// Key states
const keys = {
    w: false,
    s: false,
    up: false,
    down: false
};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
            keys.w = true;
            break;
        case 's':
            keys.s = true;
            break;
        case 'arrowup':
            keys.up = true;
            break;
        case 'arrowdown':
            keys.down = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
            keys.w = false;
            break;
        case 's':
            keys.s = false;
            break;
        case 'arrowup':
            keys.up = false;
            break;
        case 'arrowdown':
            keys.down = false;
            break;
    }
});

// Update paddle positions based on key states
function updatePaddles() {
    // Player 1 paddle
    if (keys.w && player1.y > 0) {
        player1.y -= paddleSpeed;
    }
    if (keys.s && player1.y < canvas.height - paddleHeight) {
        player1.y += paddleSpeed;
    }
    
    // Player 2 paddle
    if (keys.up && player2.y > 0) {
        player2.y -= paddleSpeed;
    }
    if (keys.down && player2.y < canvas.height - paddleHeight) {
        player2.y += paddleSpeed;
    }
}

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy = -ball.dy;
    }
    
    // Ball collision with paddles
    // Player 1 paddle collision
    if (ball.x - ball.radius <= player1.x + player1.width &&
        ball.y >= player1.y &&
        ball.y <= player1.y + player1.height &&
        ball.dx < 0) {
        ball.dx = -ball.dx;
        // Add some variation to the ball direction based on where it hits the paddle
        const hitPos = (ball.y - player1.y) / player1.height;
        ball.dy = (hitPos - 0.5) * 8;
    }
    
    // Player 2 paddle collision
    if (ball.x + ball.radius >= player2.x &&
        ball.y >= player2.y &&
        ball.y <= player2.y + player2.height &&
        ball.dx > 0) {
        ball.dx = -ball.dx;
        // Add some variation to the ball direction based on where it hits the paddle
        const hitPos = (ball.y - player2.y) / player2.height;
        ball.dy = (hitPos - 0.5) * 8;
    }
    
    // Ball goes out of bounds (scoring)
    if (ball.x < 0) {
        score2++;
        updateScoreDisplay();
        resetBall();
    }
    
    if (ball.x > canvas.width) {
        score1++;
        updateScoreDisplay();
        resetBall();
    }
}

// Reset ball to center with random direction
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.dy = (Math.random() - 0.5) * 6;
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
}

// Draw everything on the canvas
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pause message if paused
    if (isPaused) {
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// Main game loop
function gameLoop() {
    if (gameRunning && !isPaused) {
        updatePaddles();
        updateBall();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game function
function resetGame() {
    score1 = 0;
    score2 = 0;
    updateScoreDisplay();
    resetBall();
    player1.y = canvas.height / 2 - paddleHeight / 2;
    player2.y = canvas.height / 2 - paddleHeight / 2;
    isPaused = false;
}

// Toggle pause function
function togglePause() {
    isPaused = !isPaused;
}

// Start the game
updateScoreDisplay();
gameLoop();