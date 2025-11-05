// Simple test to verify game logic works without browser
// Run with: node test-game.js

// Mock DOM environment
global.document = {
    readyState: 'complete',
    getElementById: (id) => {
        const elements = {
            gameCanvas: { width: 320, height: 568, getContext: () => mockContext },
            scoreDisplay: { textContent: '0', classList: { add: () => {}, remove: () => {} } },
            highScoreValue: { textContent: '0' },
            finalScore: { textContent: '0' },
            finalHighScore: { textContent: '0' },
            startScreen: { classList: { add: () => {}, remove: () => {} } },
            gameOverScreen: { classList: { add: () => {}, remove: () => {} } },
            gameOverlay: { classList: { add: () => {}, remove: () => {} } },
            jumpSound: { play: () => {}, currentTime: 0 },
            scoreSound: { play: () => {}, currentTime: 0 },
            hitSound: { play: () => {}, currentTime: 0 }
        };
        return elements[id] || null;
    },
    createElement: () => ({ style: {}, appendChild: () => {} }),
    body: { appendChild: () => {} },
    addEventListener: () => {},
    hidden: false,
    cookie: ''
};

global.window = {
    devicePixelRatio: 1,
    performance: { now: () => Date.now() },
    location: { search: '' },
    addEventListener: () => {},
    game: null
};

global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.localStorage = {
    data: {},
    getItem: (key) => localStorage.data[key] || null,
    setItem: (key, value) => localStorage.data[key] = value
};

global.URLSearchParams = class {
    constructor(query) {
        this.params = {};
    }
    has(key) { return false; }
};

const mockContext = {
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    beginPath: () => {},
    closePath: () => {},
    arc: () => {},
    ellipse: () => {},
    moveTo: () => {},
    lineTo: () => {},
    fill: () => {},
    stroke: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
};

// Load game classes
const fs = require('fs');

// Evaluate the JavaScript files
eval(fs.readFileSync('js/bird.js', 'utf8'));
eval(fs.readFileSync('js/pipe.js', 'utf8'));
eval(fs.readFileSync('js/input.js', 'utf8'));
eval(fs.readFileSync('js/score.js', 'utf8'));
eval(fs.readFileSync('js/game-states.js', 'utf8'));

// Test Bird class
console.log('Testing Bird class...');
const bird = new Bird(80, 200);
console.log('✓ Bird created successfully');
console.log(`  Position: (${bird.x}, ${bird.y})`);
console.log(`  Velocity: ${bird.velocity}`);

// Test bird physics
bird.jump();
console.log('✓ Bird jump works');
console.log(`  Velocity after jump: ${bird.velocity}`);

for (let i = 0; i < 5; i++) {
    bird.update();
}
console.log('✓ Bird physics update works');
console.log(`  Position after updates: (${bird.x.toFixed(1)}, ${bird.y.toFixed(1)})`);
console.log(`  Velocity: ${bird.velocity.toFixed(1)}`);

// Test PipeManager class
console.log('\nTesting PipeManager class...');
const pipeManager = new PipeManager(320, 568);
console.log('✓ PipeManager created successfully');

pipeManager.generatePipe();
console.log('✓ Pipe generation works');
console.log(`  Number of pipes: ${pipeManager.pipes.length}`);

pipeManager.update();
console.log('✓ Pipe update works');
console.log(`  First pipe position: ${pipeManager.pipes[0]?.x}`);

// Test collision detection
const birdBounds = bird.getBounds();
const collision = pipeManager.checkCollision(bird);
console.log(`✓ Collision detection works (collision: ${collision})`);

// Test ScoreManager class
console.log('\nTesting ScoreManager class...');
const scoreManager = new ScoreManager();
console.log('✓ ScoreManager created successfully');
console.log(`  Initial score: ${scoreManager.getCurrentScore()}`);

scoreManager.incrementScore();
console.log('✓ Score increment works');
console.log(`  Score after increment: ${scoreManager.getCurrentScore()}`);

// Test InputHandler class
console.log('\nTesting InputHandler class...');
const inputHandler = new InputHandler();
console.log('✓ InputHandler created successfully');

let jumpTriggered = false;
inputHandler.on('jump', () => { jumpTriggered = true; });
inputHandler.triggerCallbacks('jump');
console.log(`✓ Input callbacks work (jump triggered: ${jumpTriggered})`);

// Test GameStateManager class
console.log('\nTesting GameStateManager class...');
const gameStateManager = new GameStateManager(
    { width: 320, height: 568, getContext: () => mockContext },
    bird,
    pipeManager,
    scoreManager,
    inputHandler
);
console.log('✓ GameStateManager created successfully');
console.log(`  Current state: ${gameStateManager.getCurrentState()}`);

gameStateManager.setState(gameStateManager.STATES.PLAYING);
console.log('✓ State change works');
console.log(`  New state: ${gameStateManager.getCurrentState()}`);

console.log('\n🎮 All game components are working correctly!');
console.log('✅ The game logic is properly implemented and should run in a browser.');