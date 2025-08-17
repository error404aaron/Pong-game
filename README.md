# Space Invaders

A classic Space Invaders game implemented in HTML5 Canvas and JavaScript, transformed from the original Pong game.

## How to Play

1. **Running the Game:**
   - Open `index.html` in your web browser
   - Or serve it with a local web server: `python3 -m http.server 8000` then visit `http://localhost:8000`

2. **Controls:**
   - **Move Left/Right:** ←/→ arrow keys
   - **Shoot:** Spacebar

3. **Game Features:**
   - Real-time score tracking and lives system
   - 5 rows of colorful alien invaders with different point values
   - Player ship with shooting mechanics
   - Alien movement patterns (side-to-side with descent)
   - Alien return fire
   - Pause/Resume functionality
   - Reset game option
   - Star field background effect
   - Progressive difficulty (new waves spawn lower)

## Files

- `index.html` - Main game page with UI and canvas
- `space-invaders.js` - Game logic, physics, and controls
- `pong.js` - Original Pong game (preserved)

## Game Rules

- Use arrow keys to move your ship left and right
- Press spacebar to shoot bullets at the alien invaders
- Different colored aliens give different points:
  - Red aliens (top row): 50 points
  - Yellow aliens: 40 points  
  - Cyan aliens: 30 points
  - Magenta aliens: 20 points
  - White aliens (bottom row): 10 points
- Avoid alien bullets - getting hit costs a life
- Game ends when you run out of lives or aliens reach your ship
- Clear all aliens to spawn a new wave (they start lower each time)
- Try to achieve the highest score possible!