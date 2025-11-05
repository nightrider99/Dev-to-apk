// Pipe class handles pipe generation, movement, and collision detection
class PipeManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.pipes = [];

        // Pipe configuration
        this.pipeWidth = 40;
        this.gapSize = 100;
        this.pipeSpeed = 2;
        this.pipeSpacing = 200; // Distance between pipe centers
        this.minGapHeight = 120; // Minimum distance from edges

        // Visual properties
        this.pipeColor = '#228B22'; // Forest green
        this.pipeBorderColor = '#006400'; // Dark green
        this.pipeHighlightColor = '#32CD32'; // Lime green

        // Scoring
        this.scoredPipes = new Set(); // Track which pipes have been scored
    }

    // Generate a new pair of pipes
    generatePipe() {
        // Random gap position with some constraints
        const minHeight = this.minGapHeight;
        const maxHeight = this.canvasHeight - this.minGapHeight - this.gapSize - 50; // 50px for ground
        const gapY = minHeight + Math.random() * (maxHeight - minHeight);

        const pipe = {
            x: this.canvasWidth,
            gapY: gapY,
            scored: false,
            id: Date.now() + Math.random() // Unique identifier
        };

        this.pipes.push(pipe);
        return pipe;
    }

    // Update all pipes (movement and cleanup)
    update() {
        // Move pipes to the left
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;

            // Remove pipes that have moved completely off-screen
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                this.scoredPipes.delete(pipe.id); // Clean up scored pipes tracking
            }
        }

        // Generate new pipes if needed
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvasWidth - this.pipeSpacing) {
            this.generatePipe();
        }
    }

    // Render all pipes on the canvas
    render(ctx) {
        for (const pipe of this.pipes) {
            this.renderPipe(ctx, pipe);
        }
    }

    // Render a single pipe pair
    renderPipe(ctx, pipe) {
        const { x, gapY } = pipe;

        // Draw top pipe
        this.drawPipeSegment(ctx, x, 0, this.pipeWidth, gapY, true);

        // Draw bottom pipe
        const bottomY = gapY + this.gapSize;
        const bottomHeight = this.canvasHeight - bottomY - 50; // 50px for ground
        this.drawPipeSegment(ctx, x, bottomY, this.pipeWidth, bottomHeight, false);
    }

    // Draw a single pipe segment with styling
    drawPipeSegment(ctx, x, y, width, height, isTop) {
        // Main pipe body
        ctx.fillStyle = this.pipeColor;
        ctx.fillRect(x, y, width, height);

        // Pipe border
        ctx.strokeStyle = this.pipeBorderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Pipe highlight (3D effect)
        ctx.fillStyle = this.pipeHighlightColor;
        ctx.fillRect(x + 2, y + 2, width - 4, Math.min(10, height - 4));

        // Pipe cap (the wider part at the end)
        const capHeight = 25;
        const capWidth = width + 8;
        const capX = x - 4;

        if (isTop) {
            // Top pipe cap
            ctx.fillStyle = this.pipeColor;
            ctx.fillRect(capX, y + height - capHeight, capWidth, capHeight);

            ctx.strokeStyle = this.pipeBorderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(capX, y + height - capHeight, capWidth, capHeight);

            // Cap highlight
            ctx.fillStyle = this.pipeHighlightColor;
            ctx.fillRect(capX + 2, y + height - capHeight + 2, capWidth - 4, 8);
        } else {
            // Bottom pipe cap
            ctx.fillStyle = this.pipeColor;
            ctx.fillRect(capX, y, capWidth, capHeight);

            ctx.strokeStyle = this.pipeBorderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(capX, y, capWidth, capHeight);

            // Cap highlight
            ctx.fillStyle = this.pipeHighlightColor;
            ctx.fillRect(capX + 2, y + 2, capWidth - 4, 8);
        }
    }

    // Check collision between bird and all pipes
    checkCollision(bird) {
        const birdBounds = bird.getBounds();

        for (const pipe of this.pipes) {
            if (this.checkPipeCollision(birdBounds, pipe)) {
                return true;
            }
        }

        return false;
    }

    // Check collision between bird and a specific pipe
    checkPipeCollision(birdBounds, pipe) {
        const { x, gapY } = pipe;

        // Check if bird is within pipe's horizontal range
        if (birdBounds.x + birdBounds.width > x && birdBounds.x < x + this.pipeWidth) {
            // Check if bird hits top pipe or bottom pipe
            if (birdBounds.y < gapY || birdBounds.y + birdBounds.height > gapY + this.gapSize) {
                return true;
            }
        }

        return false;
    }

    // Check if bird passed through a pipe (for scoring)
    checkScore(bird) {
        const birdX = bird.x;
        let scored = false;

        for (const pipe of this.pipes) {
            // Check if bird passed the pipe and hasn't scored it yet
            if (birdX > pipe.x + this.pipeWidth && !this.scoredPipes.has(pipe.id)) {
                this.scoredPipes.add(pipe.id);
                scored = true;
                break; // Only score one pipe per frame
            }
        }

        return scored;
    }

    // Get the first pipe (for AI or debugging)
    getFirstPipe() {
        return this.pipes.length > 0 ? this.pipes[0] : null;
    }

    // Get all pipes (for debugging or rendering effects)
    getAllPipes() {
        return [...this.pipes];
    }

    // Reset all pipes
    reset() {
        this.pipes = [];
        this.scoredPipes.clear();
    }

    // Get pipe ahead of bird (for AI purposes)
    getNextPipe(birdX) {
        for (const pipe of this.pipes) {
            if (pipe.x + this.pipeWidth > birdX) {
                return pipe;
            }
        }
        return null;
    }

    // Check if any pipes are visible (for game state)
    hasVisiblePipes() {
        return this.pipes.length > 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PipeManager;
}