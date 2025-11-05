// Main Game Engine - Coordinates all game systems and runs the main loop
class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateTime = 0;

        // Game objects (will be initialized)
        this.bird = null;
        this.pipeManager = null;
        this.scoreManager = null;
        this.inputHandler = null;
        this.gameStateManager = null;

        // Performance monitoring
        this.performanceMonitor = {
            enabled: false,
            frameCount: 0,
            startTime: 0,
            lastFrameTime: 0
        };

        // Initialize game when DOM is ready
        this.initializeWhenReady();
    }

    // Initialize game when DOM is ready
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    // Initialize the game
    async initialize() {
        try {
            console.log('Initializing Flappy Bird Game...');

            // Get canvas and context
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Could not get 2D context from canvas');
            }

            // Set canvas size
            this.setupCanvas();

            // Initialize game objects
            this.initializeGameObjects();

            // Load assets (if any)
            await this.loadAssets();

            // Start the game
            this.start();

            console.log('Game initialized successfully!');

        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showErrorMessage('Failed to load game. Please refresh the page.');
        }
    }

    // Setup canvas configuration
    setupCanvas() {
        // Set canvas resolution
        this.canvas.width = 320;
        this.canvas.height = 568;

        // Enable crisp rendering on high DPI displays
        const dpr = window.devicePixelRatio || 1;
        if (dpr > 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
        }

        // Configure context settings
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        console.log(`Canvas setup: ${this.canvas.width}x${this.canvas.height}`);
    }

    // Initialize all game objects
    initializeGameObjects() {
        // Create bird
        this.bird = new Bird(80, 200);

        // Create pipe manager
        this.pipeManager = new PipeManager(this.canvas.width, this.canvas.height);

        // Create score manager
        this.scoreManager = new ScoreManager();

        // Create input handler
        this.inputHandler = new InputHandler();

        // Create game state manager
        this.gameStateManager = new GameStateManager(
            this.canvas,
            this.bird,
            this.pipeManager,
            this.scoreManager,
            this.inputHandler
        );

        console.log('Game objects initialized');
    }

    // Load game assets (sounds, images, etc.)
    async loadAssets() {
        const assets = [
            { id: 'jumpSound', element: document.getElementById('jumpSound') },
            { id: 'scoreSound', element: document.getElementById('scoreSound') },
            { id: 'hitSound', element: document.getElementById('hitSound') }
        ];

        const loadPromises = assets.map(asset => {
            return new Promise((resolve) => {
                if (asset.element) {
                    asset.element.addEventListener('canplaythrough', resolve, { once: true });
                    asset.element.addEventListener('error', resolve, { once: true });
                    // Set a timeout in case loading takes too long
                    setTimeout(resolve, 2000);
                } else {
                    resolve();
                }
            });
        });

        try {
            await Promise.all(loadPromises);
            console.log('Assets loaded (or timed out gracefully)');
        } catch (error) {
            console.warn('Asset loading had some issues, but game will continue:', error);
        }
    }

    // Start the game
    start() {
        if (this.isRunning) {
            console.warn('Game is already running');
            return;
        }

        console.log('Starting game...');
        this.isRunning = true;
        this.lastTime = performance.now();
        this.frameCount = 0;

        // Start game in menu state
        this.gameStateManager.setState(this.gameStateManager.STATES.MENU);

        // Start the game loop
        this.gameLoop();

        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    // Main game loop
    gameLoop() {
        if (!this.isRunning) {
            return;
        }

        // Calculate delta time
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update FPS counter
        this.updateFPS(currentTime);

        // Update game state
        this.update(deltaTime);

        // Render game
        this.render();

        // Request next frame
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    // Update game logic
    update(deltaTime) {
        // Update game state manager (which updates all game objects)
        this.gameStateManager.update(deltaTime);

        // Update performance monitor
        this.updatePerformanceMonitor(deltaTime);
    }

    // Render game
    render() {
        // Render through game state manager
        this.gameStateManager.render();

        // Render debug information (if enabled)
        if (this.performanceMonitor.enabled) {
            this.renderDebugInfo();
        }

        this.frameCount++;
    }

    // Update FPS counter
    updateFPS(currentTime) {
        if (currentTime - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
        }
    }

    // Render debug information
    renderDebugInfo() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(5, 5, 150, 60);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        this.ctx.fillText(`State: ${this.gameStateManager.getCurrentState()}`, 10, 35);
        this.ctx.fillText(`Score: ${this.scoreManager.getCurrentScore()}`, 10, 50);

        this.ctx.restore();
    }

    // Setup performance monitoring
    setupPerformanceMonitor() {
        // Enable debug mode with '?debug=true' in URL
        const urlParams = new URLSearchParams(window.location.search);
        this.performanceMonitor.enabled = urlParams.has('debug');

        if (this.performanceMonitor.enabled) {
            console.log('Performance monitoring enabled');
            this.performanceMonitor.startTime = performance.now();
            this.performanceMonitor.lastFrameTime = this.performanceMonitor.startTime;
        }
    }

    // Update performance monitor
    updatePerformanceMonitor(deltaTime) {
        if (!this.performanceMonitor.enabled) return;

        this.performanceMonitor.frameCount++;
        this.performanceMonitor.lastFrameTime = performance.now();

        // Log performance every 10 seconds
        if (this.performanceMonitor.frameCount % 600 === 0) {
            const elapsed = this.performanceMonitor.lastFrameTime - this.performanceMonitor.startTime;
            const avgFrameTime = elapsed / this.performanceMonitor.frameCount;
            const avgFPS = 1000 / avgFrameTime;

            console.log(`Performance: Avg FPS: ${avgFPS.toFixed(2)}, Frame Time: ${avgFrameTime.toFixed(2)}ms`);
        }
    }

    // Stop the game
    stop() {
        if (!this.isRunning) {
            return;
        }

        console.log('Stopping game...');
        this.isRunning = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Clean up resources
        this.cleanup();
    }

    // Cleanup resources
    cleanup() {
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }

        if (this.scoreManager) {
            this.scoreManager.destroy();
        }

        console.log('Game resources cleaned up');
    }

    // Restart the game
    restart() {
        console.log('Restarting game...');
        this.stop();

        // Small delay before restart
        setTimeout(() => {
            this.initialize();
        }, 100);
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(errorDiv);

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Handle visibility change (pause when tab is not visible)
    handleVisibilityChange() {
        if (document.hidden) {
            // Tab is hidden, consider pausing the game
            if (this.gameStateManager.isPlaying()) {
                console.log('Game paused (tab hidden)');
                this.stop();
            }
        } else {
            // Tab is visible again
            if (!this.isRunning) {
                console.log('Game resumed (tab visible)');
                this.start();
            }
        }
    }

    // Handle window resize
    handleResize() {
        // Update canvas size if needed
        // This is mainly for responsive design
        console.log('Window resized');
    }

    // Get game statistics
    getStats() {
        return {
            isRunning: this.isRunning,
            fps: this.fps,
            currentState: this.gameStateManager?.getCurrentState(),
            currentScore: this.scoreManager?.getCurrentScore(),
            highScore: this.scoreManager?.getHighScore(),
            frameCount: this.frameCount
        };
    }
}

// Auto-start the game when script loads
let game;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        game = new Game();
    });
} else {
    game = new Game();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (game) {
        game.handleVisibilityChange();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game) {
        game.handleResize();
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Make game instance available globally for debugging
if (typeof window !== 'undefined') {
    window.game = game;
}