// ScoreManager class handles scoring, high scores, and score display
class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = 0;
        this.scoreAnimations = [];

        // Load high score from localStorage
        this.loadHighScore();

        // Score display elements
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.highScoreValue = document.getElementById('highScoreValue');
        this.finalScore = document.getElementById('finalScore');
        this.finalHighScore = document.getElementById('finalHighScore');

        // Score configuration
        this.scorePerPipe = 1;
        this.animationDuration = 500; // milliseconds
        this.scorePopupDuration = 1000; // milliseconds

        // Initialize displays
        this.updateDisplays();
    }

    // Increment score when passing a pipe
    incrementScore() {
        this.currentScore += this.scorePerPipe;
        this.updateScoreDisplay();
        this.addScoreAnimation();
        this.playScoreSound();

        // Check and update high score
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
    }

    // Update the in-game score display
    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.currentScore;

            // Add pulse animation for score change
            this.scoreDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.scoreDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Add visual animation when scoring
    addScoreAnimation() {
        const scorePopup = {
            x: 160, // Center of canvas
            y: 100, // Upper area of canvas
            value: '+1',
            opacity: 1,
            scale: 0.5,
            startTime: Date.now()
        };

        this.scoreAnimations.push(scorePopup);
    }

    // Update and render score animations
    updateAnimations(ctx) {
        const now = Date.now();

        for (let i = this.scoreAnimations.length - 1; i >= 0; i--) {
            const animation = this.scoreAnimations[i];
            const elapsed = now - animation.startTime;
            const progress = elapsed / this.scorePopupDuration;

            if (progress >= 1) {
                this.scoreAnimations.splice(i, 1);
                continue;
            }

            // Calculate animation properties
            animation.y -= 1; // Move upward
            animation.opacity = 1 - progress;
            animation.scale = 0.5 + progress * 0.5;

            // Render the score popup
            this.renderScorePopup(ctx, animation);
        }
    }

    // Render a single score popup animation
    renderScorePopup(ctx, animation) {
        ctx.save();

        ctx.globalAlpha = animation.opacity;
        ctx.fillStyle = '#FFD700'; // Gold color
        ctx.font = `bold ${20 * animation.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        // Draw text with shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(animation.value, animation.x, animation.y);
        ctx.strokeText(animation.value, animation.x, animation.y);

        ctx.restore();
    }

    // Render the current score on canvas
    renderScore(ctx) {
        if (this.currentScore > 0) {
            ctx.save();

            // Score styling
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;

            // Draw text with shadow for readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillText(this.currentScore.toString(), 300, 20);
            ctx.strokeText(this.currentScore.toString(), 300, 20);

            ctx.restore();
        }
    }

    // Update all score displays
    updateDisplays() {
        // Update in-game score display
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.currentScore;
        }

        // Update high score in menu
        if (this.highScoreValue) {
            this.highScoreValue.textContent = this.highScore;
        }

        // Update game over screen
        if (this.finalScore) {
            this.finalScore.textContent = this.currentScore;
        }

        if (this.finalHighScore) {
            this.finalHighScore.textContent = this.highScore;
        }
    }

    // Reset score for new game
    resetScore() {
        this.currentScore = 0;
        this.scoreAnimations = [];
        this.updateDisplays();
        this.hideScoreDisplay();
    }

    // Show score display during gameplay
    showScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.classList.remove('hidden');
        }
    }

    // Hide score display
    hideScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.classList.add('hidden');
        }
    }

    // Load high score from localStorage
    loadHighScore() {
        try {
            const saved = localStorage.getItem('flappyBirdHighScore');
            if (saved !== null) {
                this.highScore = parseInt(saved, 10) || 0;
            }
        } catch (error) {
            console.warn('Could not load high score from localStorage:', error);
            this.highScore = 0;
        }
    }

    // Save high score to localStorage
    saveHighScore() {
        try {
            localStorage.setItem('flappyBirdHighScore', this.highScore.toString());
        } catch (error) {
            console.warn('Could not save high score to localStorage:', error);
        }
    }

    // Play score sound effect
    playScoreSound() {
        try {
            const scoreSound = document.getElementById('scoreSound');
            if (scoreSound) {
                // Reset and play sound
                scoreSound.currentTime = 0;
                scoreSound.play().catch(error => {
                    // Audio might not play without user interaction
                    console.log('Score sound play failed:', error);
                });
            }
        } catch (error) {
            console.log('Score sound not available:', error);
        }
    }

    // Get current score
    getCurrentScore() {
        return this.currentScore;
    }

    // Get high score
    getHighScore() {
        return this.highScore;
    }

    // Check if current score is a new high score
    isNewHighScore() {
        return this.currentScore > this.highScore || this.currentScore === this.highScore && this.currentScore > 0;
    }

    // Set high score manually (for testing or special cases)
    setHighScore(score) {
        this.highScore = Math.max(0, score);
        this.saveHighScore();
        this.updateDisplays();
    }

    // Get score statistics
    getStats() {
        return {
            currentScore: this.currentScore,
            highScore: this.highScore,
            isNewHighScore: this.isNewHighScore(),
            totalGamesPlayed: this.getTotalGamesPlayed()
        };
    }

    // Get total games played (optional feature)
    getTotalGamesPlayed() {
        try {
            const gamesPlayed = localStorage.getItem('flappyBirdGamesPlayed');
            return gamesPlayed ? parseInt(gamesPlayed, 10) : 0;
        } catch (error) {
            return 0;
        }
    }

    // Increment games played counter
    incrementGamesPlayed() {
        try {
            const gamesPlayed = this.getTotalGamesPlayed();
            localStorage.setItem('flappyBirdGamesPlayed', (gamesPlayed + 1).toString());
        } catch (error) {
            console.warn('Could not save games played count:', error);
        }
    }

    // Format score for display (with commas for large numbers)
    formatScore(score) {
        return score.toLocaleString();
    }

    // Clean up resources
    destroy() {
        this.scoreAnimations = [];
        // Clear any ongoing animations or timeouts here
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreManager;
}