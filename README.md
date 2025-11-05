# Flappy Bird

A fully functional Flappy Bird game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Play in any modern web browser!

## 🎮 How to Play

### Controls
- **Desktop**: Click the mouse or press **Spacebar** to make the bird flap
- **Mobile**: Tap anywhere on the screen to make the bird flap
- **Restart**: Press **R** key or click/tap after game over

### Objective
Navigate the bird through the green pipes without hitting them. Each pipe you successfully pass awards you one point. The game ends when you hit a pipe or the ground.

### Game Features
- **Smooth Physics**: Realistic gravity and jump mechanics
- **Procedural Generation**: Infinite pipe obstacles with random positioning
- **Score System**: Track your current score and beat your high score
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Visual Effects**: Smooth animations, particle effects, and explosion effects
- **Sound Effects**: Jump, score, and collision sounds (with graceful fallback)
- **Performance Optimized**: Maintains 60 FPS gameplay

## 🚀 Quick Start

1. **Download or clone** the game files
2. **Open `index.html`** in your favorite web browser
3. **Click or tap** to start playing
4. **Enjoy!** 🐦

No installation, no server required - just open and play!

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices:
- Touch-optimized controls
- Prevents accidental zoom and scroll
- Maintains aspect ratio on all screen sizes
- Mobile-friendly interface elements

## 🎯 Game Mechanics

### Physics
- **Gravity**: 0.5 pixels/frame²
- **Jump Velocity**: -8 pixels/frame
- **Max Fall Speed**: 12 pixels/frame
- **Pipe Speed**: 2 pixels/frame

### Scoring
- **Points per Pipe**: 1 point
- **High Score**: Automatically saved in browser's local storage
- **Score Animations**: Visual feedback when scoring

### Difficulty
- **Pipe Gap**: 100 pixels
- **Pipe Spacing**: 200 pixels between centers
- **Random Gap Position**: With safety margins from screen edges

## 🛠️ Technical Details

### Browser Compatibility
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari/Chrome** (iOS/Android)

### Technologies Used
- **HTML5 Canvas** for game rendering
- **CSS3** for styling and animations
- **Vanilla JavaScript (ES6+)** for game logic
- **localStorage** for high score persistence
- **Web Audio API** for sound effects

### Performance Features
- 60 FPS target frame rate
- Efficient collision detection
- Object pooling for memory management
- RequestAnimationFrame for smooth animations
- High DPI display support

## 📁 File Structure

```
Dev-to-apk/
├── index.html              # Main game file
├── css/
│   └── style.css          # Complete game styling
├── js/
│   ├── game.js            # Main game engine and loop
│   ├── bird.js            # Bird physics and rendering
│   ├── pipe.js            # Pipe generation and collision
│   ├── input.js           # User input handling
│   ├── score.js           # Score system and display
│   └── game-states.js     # Game state management
├── assets/                # Sound effects (optional)
│   ├── jump.mp3
│   ├── score.mp3
│   └── hit.mp3
└── README.md              # This file
```

## 🎮 Game States

1. **Menu State**:
   - Displays game title and instructions
   - Shows high score
   - Animated bird preview

2. **Playing State**:
   - Active gameplay
   - Real-time score tracking
   - Collision detection

3. **Game Over State**:
   - Shows final score
   - Displays high score
   - Restart option

## 🐛 Debug Mode

Enable debug mode by adding `?debug=true` to the URL:
- Shows FPS counter
- Displays current game state
- Performance monitoring
- Additional debugging information

Example: `file:///path/to/game/index.html?debug=true`

## 🔧 Customization

### Easy Tweaks
- **Difficulty**: Adjust `pipeSpeed` in `js/pipe.js`
- **Bird Physics**: Modify `gravity` and `jumpVelocity` in `js/bird.js`
- **Pipe Gap**: Change `gapSize` in `js/pipe.js`
- **Colors**: Update CSS variables in `css/style.css`

### Advanced Customization
- Add new bird skins
- Implement different pipe types
- Create power-ups
- Add background themes
- Implement multiplayer features

## 🚀 Deployment

### Local Development
Simply open `index.html` in a web browser - no server required.

### Web Deployment
1. Upload all files to a web server
2. Ensure proper MIME types are configured
3. The game will work immediately

### Server Configuration (Optional)
If using a local server for development:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# PHP
php -S localhost:8000
```

## 🎨 Visual Features

- **Smooth Animations**: Bird rotation, pipe movement, score popups
- **Particle Effects**: Background particles, explosion effects
- **Visual Feedback**: Input feedback, scoring animations
- **3D Effects**: Pipe highlights, shadows, depth perception
- **Responsive Design**: Scales perfectly on all devices

## 🔊 Audio System

The game includes optional sound effects:
- **Jump Sound**: When the bird flaps
- **Score Sound**: When passing a pipe
- **Hit Sound**: When collision occurs

Sound effects will gracefully fail if audio files are missing or if audio is blocked by the browser.

## 📊 Game Statistics

The game tracks:
- **Current Score**: Points in the current session
- **High Score**: Best score achieved
- **Games Played**: Total number of games
- **Performance**: FPS and frame timing (in debug mode)

## 🤝 Contributing

Feel free to:
- Report bugs or issues
- Suggest new features
- Submit improvements
- Share your customizations

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Original Flappy Bird concept by Dong Nguyen
- Built with modern web technologies
- No external dependencies or frameworks
- Optimized for performance and compatibility

## 📞 Support

If you encounter any issues:
1. Try refreshing the page
2. Check browser console for errors
3. Ensure you're using a supported browser
4. Test with debug mode enabled (`?debug=true`)

---

**Enjoy playing Flappy Bird!** 🐦🎮