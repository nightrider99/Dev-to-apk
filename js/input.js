// InputHandler class manages all user interactions
class InputHandler {
    constructor() {
        this.callbacks = {
            jump: [],
            gameStart: [],
            gameRestart: []
        };

        // Input state tracking
        this.isJumping = false;
        this.jumpCooldown = 100; // milliseconds between jumps
        this.lastJumpTime = 0;

        // Touch state for mobile
        this.touchStartY = 0;
        this.isTouching = false;

        // Initialize event listeners
        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Mouse events
        this.addMouseListeners();

        // Keyboard events
        this.addKeyboardListeners();

        // Touch events for mobile
        this.addTouchListeners();

        // Prevent context menu on long press
        this.preventDefaultBehaviors();
    }

    // Add mouse event listeners
    addMouseListeners() {
        const canvas = document.getElementById('gameCanvas');
        const gameOverlay = document.getElementById('gameOverlay');

        // Jump on canvas click
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleJump();
        });

        // Handle overlay clicks for game state changes
        gameOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleOverlayClick();
        });

        // Prevent right-click context menu
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    // Add keyboard event listeners
    addKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Space bar for jump
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }

            // Enter key for game state changes
            if (e.code === 'Enter') {
                e.preventDefault();
                this.handleOverlayClick();
            }

            // 'R' key for restart
            if (e.code === 'KeyR') {
                e.preventDefault();
                this.triggerCallbacks('gameRestart');
            }
        });

        // Prevent space bar from scrolling
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
            }
        });
    }

    // Add touch event listeners for mobile
    addTouchListeners() {
        const canvas = document.getElementById('gameCanvas');
        const gameOverlay = document.getElementById('gameOverlay');

        // Touch start on canvas for jump
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartY = e.touches[0].clientY;
            this.isTouching = true;
            this.handleJump();
        }, { passive: false });

        // Touch end
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isTouching = false;
        }, { passive: false });

        // Touch move (to prevent scrolling)
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        // Touch on overlay for game state changes
        gameOverlay.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleOverlayClick();
        }, { passive: false });

        // Handle multi-touch gestures (prevent zoom)
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Prevent default browser behaviors
    preventDefaultBehaviors() {
        // Prevent pull-to-refresh and bounce effects on mobile
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.getElementById('gameCanvas')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent text selection
        document.addEventListener('selectstart', (e) => {
            if (e.target === document.getElementById('gameCanvas')) {
                e.preventDefault();
            }
        });
    }

    // Handle jump input with cooldown
    handleJump() {
        const now = Date.now();

        // Check cooldown to prevent multiple rapid jumps
        if (now - this.lastJumpTime < this.jumpCooldown) {
            return;
        }

        this.lastJumpTime = now;
        this.isJumping = true;

        // Trigger jump callbacks
        this.triggerCallbacks('jump');

        // Add visual feedback
        this.addVisualFeedback();

        // Reset jumping state after a short delay
        setTimeout(() => {
            this.isJumping = false;
        }, 100);
    }

    // Handle overlay clicks for game state transitions
    handleOverlayClick() {
        const startScreen = document.getElementById('startScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');

        if (!startScreen.classList.contains('hidden')) {
            // Start game
            this.triggerCallbacks('gameStart');
        } else if (!gameOverScreen.classList.contains('hidden')) {
            // Restart game
            this.triggerCallbacks('gameRestart');
        }
    }

    // Add visual feedback for input
    addVisualFeedback() {
        const canvas = document.getElementById('gameCanvas');

        // Brief scale effect
        canvas.style.transform = 'scale(0.98)';
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 50);

        // Add brief brightness change
        canvas.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            canvas.style.filter = 'brightness(1)';
        }, 100);
    }

    // Register callback for specific input events
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    // Remove callback for specific input events
    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }

    // Trigger all callbacks for a specific event
    triggerCallbacks(event) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error(`Error in ${event} callback:`, error);
                }
            });
        }
    }

    // Check if user is currently touching
    isUserTouching() {
        return this.isTouching;
    }

    // Get last jump time
    getLastJumpTime() {
        return this.lastJumpTime;
    }

    // Check if jump is on cooldown
    isJumpOnCooldown() {
        return Date.now() - this.lastJumpTime < this.jumpCooldown;
    }

    // Reset input state (useful for game restart)
    reset() {
        this.isJumping = false;
        this.lastJumpTime = 0;
        this.touchStartY = 0;
        this.isTouching = false;
    }

    // Enable/disable input (useful for pause states)
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // Clean up event listeners
    destroy() {
        // Remove all event listeners here if needed
        // This is useful for cleanup when the game is destroyed
        this.callbacks = {
            jump: [],
            gameStart: [],
            gameRestart: []
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
}