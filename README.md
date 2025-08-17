# Pong Game

A classic Pong game implemented in HTML5 Canvas and JavaScript.

## How to Play

1. **Running the Game:**
   - Open `index.html` in your web browser
   - Or serve it with a local web server: `python3 -m http.server 8000` then visit `http://localhost:8000`

2. **Controls:**
   - **Player 1 (Left Paddle):** W/S keys
   - **Player 2 (Right Paddle):** Up/Down arrow keys

3. **Game Features:**
   - Real-time score tracking
   - Ball physics with paddle collision variation
   - Pause/Resume functionality
   - Reset game option

## Files

- `index.html` - Main game page with UI and canvas
- `pong.js` - Game logic, physics, and controls

## Game Rules

- Move your paddle up and down to hit the ball
- Score a point when the ball passes your opponent's paddle
- The ball speed and angle change based on where it hits the paddle
- First to score wins! (No limit set - play as long as you want)