// GameStateManager handles different game phases and transitions
class GameStateManager {
    constructor(canvas, bird, pipeManager, scoreManager, inputHandler) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bird = bird;
        this.pipeManager = pipeManager;
        this.scoreManager = scoreManager;
        this.inputHandler = inputHandler;

        // Game states
        this.STATES = {
            MENU: 'menu',
            PLAYING: 'playing',
            GAME_OVER: 'game_over'
        };

        this.currentState = this.STATES.MENU;

        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.gameOverlay = document.getElementById('gameOverlay');

        // Animation properties
        this.menuBirdY = 100;
        this.menuBirdVelocity = 0;
        this.lastTime = 0;

        // Bind input callbacks
        this.setupInputCallbacks();
    }

    // Setup input event callbacks
    setupInputCallbacks() {
        this.inputHandler.on('gameStart', () => {
            if (this.currentState === this.STATES.MENU) {
                this.startGame();
            }
        });

        this.inputHandler.on('gameRestart', () => {
            if (this.currentState === this.STATES.GAME_OVER) {
                this.restartGame();
            }
        });

        this.inputHandler.on('jump', () => {
            if (this.currentState === this.STATES.PLAYING) {
                this.bird.jump();
                this.playJumpSound();
            }
        });
    }

    // Set current game state
    setState(newState) {
        const previousState = this.currentState;
        this.currentState = newState;

        // Handle state transitions
        switch (newState) {
            case this.STATES.MENU:
                this.enterMenuState();
                break;
            case this.STATES.PLAYING:
                this.enterPlayingState();
                break;
            case this.STATES.GAME_OVER:
                this.enterGameOverState();
                break;
        }

        console.log(`State changed: ${previousState} -> ${newState}`);
    }

    // Enter menu state
    enterMenuState() {
        // Show start screen
        this.showStartScreen();

        // Reset game objects
        this.resetGameObjects();

        // Hide score display
        this.scoreManager.hideScoreDisplay();

        // Reset menu bird animation
        this.menuBirdY = 100;
        this.menuBirdVelocity = 0;
    }

    // Enter playing state
    enterPlayingState() {
        // Hide all overlay screens
        this.hideOverlay();

        // Show score display
        this.scoreManager.showScoreDisplay();

        // Reset score
        this.scoreManager.resetScore();

        // Increment games played counter
        this.scoreManager.incrementGamesPlayed();
    }

    // Enter game over state
    enterGameOverState() {
        // Show game over screen
        this.showGameOverScreen();

        // Update final score displays
        this.updateFinalScores();

        // Play hit sound
        this.playHitSound();

        // Check for new high score
        if (this.scoreManager.isNewHighScore()) {
            this.celebrateNewHighScore();
        }
    }

    // Update current game state
    update(deltaTime) {
        switch (this.currentState) {
            case this.STATES.MENU:
                this.updateMenuState(deltaTime);
                break;
            case this.STATES.PLAYING:
                this.updatePlayingState(deltaTime);
                break;
            case this.STATES.GAME_OVER:
                this.updateGameOverState(deltaTime);
                break;
        }
    }

    // Update menu state
    updateMenuState(deltaTime) {
        // Animate menu bird
        this.menuBirdVelocity += 0.3; // Gravity
        this.menuBirdY += this.menuBirdVelocity;

        // Bounce bird
        if (this.menuBirdY > 150) {
            this.menuBirdY = 150;
            this.menuBirdVelocity = -5;
        }

        // Animate pipes in background
        if (Math.random() < 0.01) {
            this.pipeManager.generatePipe();
        }
        this.pipeManager.update();
    }

    // Update playing state
    updatePlayingState(deltaTime) {
        // Update bird
        this.bird.update();

        // Update pipes
        this.pipeManager.update();

        // Check for scoring
        if (this.pipeManager.checkScore(this.bird)) {
            this.scoreManager.incrementScore();
        }

        // Check for collisions
        if (this.checkCollisions()) {
            this.setState(this.STATES.GAME_OVER);
        }
    }

    // Update game over state
    updateGameOverState(deltaTime) {
        // Update score animations
        this.scoreManager.updateAnimations(this.ctx);

        // Bird falls to ground (if not already there)
        if (!this.bird.isGrounded(this.canvas.height)) {
            this.bird.update();
        } else {
            this.bird.bounce();
        }
    }

    // Render current game state
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background elements
        this.renderBackground();

        switch (this.currentState) {
            case this.STATES.MENU:
                this.renderMenuState();
                break;
            case this.STATES.PLAYING:
                this.renderPlayingState();
                break;
            case this.STATES.GAME_OVER:
                this.renderGameOverState();
                break;
        }
    }

    // Render background
    renderBackground() {
        // Sky gradient is handled by CSS
        // Draw ground
        const groundHeight = 50;
        const gradient = this.ctx.createLinearGradient(0, this.canvas.height - groundHeight, 0, this.canvas.height);
        gradient.addColorStop(0, '#8B7355');
        gradient.addColorStop(1, '#654321');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, groundHeight);

        // Draw ground line
        this.ctx.strokeStyle = '#4A4A4A';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - groundHeight);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - groundHeight);
        this.ctx.stroke();
    }

    // Render menu state
    renderMenuState() {
        // Render background pipes
        this.pipeManager.render(this.ctx);

        // Render animated menu bird
        this.ctx.save();
        this.ctx.translate(160, this.menuBirdY);
        this.ctx.rotate(Math.sin(Date.now() * 0.002) * 0.1);
        this.bird.render(this.ctx);
        this.ctx.restore();

        // Add floating particles effect
        this.renderParticles();
    }

    // Render playing state
    renderPlayingState() {
        // Render pipes
        this.pipeManager.render(this.ctx);

        // Render bird
        this.bird.render(this.ctx);

        // Render score
        this.scoreManager.renderScore(this.ctx);

        // Render score animations
        this.scoreManager.updateAnimations(this.ctx);
    }

    // Render game over state
    renderGameOverState() {
        // Render pipes
        this.pipeManager.render(this.ctx);

        // Render bird
        this.bird.render(this.ctx);

        // Render score
        this.scoreManager.renderScore(this.ctx);

        // Render score animations
        this.scoreManager.updateAnimations(this.ctx);

        // Add explosion effect at collision point
        if (this.collisionPoint) {
            this.renderExplosion(this.collisionPoint.x, this.collisionPoint.y);
        }
    }

    // Render particle effects
    renderParticles() {
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time + i) + 1) * this.canvas.width / 2;
            const y = (Math.cos(time * 0.7 + i) + 1) * 100 + 50;
            const opacity = (Math.sin(time * 2 + i) + 1) * 0.3;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Render explosion effect
    renderExplosion(x, y) {
        const time = Date.now() * 0.01;
        const maxRadius = 30;

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const radius = (Math.sin(time) + 1) * maxRadius / 2;
            const particleX = x + Math.cos(angle) * radius;
            const particleY = y + Math.sin(angle) * radius;

            this.ctx.fillStyle = `rgba(255, 100, 100, ${1 - radius / maxRadius})`;
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Check for collisions
    checkCollisions() {
        // Check pipe collisions
        if (this.pipeManager.checkCollision(this.bird)) {
            this.collisionPoint = { x: this.bird.x, y: this.bird.y };
            return true;
        }

        // Check ground collision
        if (this.bird.isGrounded(this.canvas.height)) {
            this.collisionPoint = { x: this.bird.x, y: this.bird.y };
            return true;
        }

        // Check if bird went out of bounds
        if (this.bird.isOutOfBounds(this.canvas.height)) {
            return true;
        }

        return false;
    }

    // Start new game
    startGame() {
        this.setState(this.STATES.PLAYING);
    }

    // Restart game
    restartGame() {
        this.resetGameObjects();
        this.setState(this.STATES.PLAYING);
    }

    // Reset game objects to initial state
    resetGameObjects() {
        // Reset bird
        this.bird.reset(80, 200);

        // Reset pipes
        this.pipeManager.reset();

        // Reset score
        this.scoreManager.resetScore();

        // Clear collision point
        this.collisionPoint = null;
    }

    // UI Helper methods
    showStartScreen() {
        this.gameOverlay.classList.remove('hidden');
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    showGameOverScreen() {
        this.gameOverlay.classList.remove('hidden');
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
    }

    hideOverlay() {
        this.gameOverlay.classList.add('hidden');
    }

    updateFinalScores() {
        if (this.finalScore) {
            this.finalScore.textContent = this.scoreManager.getCurrentScore();
        }
        if (this.finalHighScore) {
            this.finalHighScore.textContent = this.scoreManager.getHighScore();
        }
    }

    // Sound effect methods
    playJumpSound() {
        try {
            const jumpSound = document.getElementById('jumpSound');
            if (jumpSound) {
                jumpSound.currentTime = 0;
                jumpSound.play().catch(() => {});
            }
        } catch (error) {
            // Ignore audio errors
        }
    }

    playHitSound() {
        try {
            const hitSound = document.getElementById('hitSound');
            if (hitSound) {
                hitSound.currentTime = 0;
                hitSound.play().catch(() => {});
            }
        } catch (error) {
            // Ignore audio errors
        }
    }

    // Celebrate new high score
    celebrateNewHighScore() {
        // Add celebration animation or effect
        const highScoreElement = document.getElementById('finalHighScore');
        if (highScoreElement) {
            highScoreElement.style.color = '#FFD700';
            highScoreElement.style.fontWeight = 'bold';
            highScoreElement.textContent = `NEW HIGH SCORE: ${this.scoreManager.getHighScore()}`;
        }
    }

    // Get current state
    getCurrentState() {
        return this.currentState;
    }

    // Check if game is playing
    isPlaying() {
        return this.currentState === this.STATES.PLAYING;
    }

    // Check if game is over
    isGameOver() {
        return this.currentState === this.STATES.GAME_OVER;
    }

    // Check if in menu
    isInMenu() {
        return this.currentState === this.STATES.MENU;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStateManager;
}