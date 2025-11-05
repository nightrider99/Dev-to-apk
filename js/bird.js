// Bird class handles bird physics, movement, and rendering
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpVelocity = -8;
        this.maxFallVelocity = 12;
        this.rotation = 0;
        this.targetRotation = 0;

        // Visual properties
        this.color = '#FFD700'; // Yellow color
        this.eyeColor = 'white';
        this.beakColor = '#FFA500'; // Orange color
    }

    // Update bird position and physics
    update() {
        // Apply gravity to velocity
        this.velocity += this.gravity;

        // Limit maximum fall velocity
        if (this.velocity > this.maxFallVelocity) {
            this.velocity = this.maxFallVelocity;
        }

        // Update position
        this.y += this.velocity;

        // Prevent bird from flying above screen top
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        // Update rotation based on velocity for realistic flight
        this.targetRotation = Math.min(Math.max(this.velocity * 3, -30), 90);

        // Smooth rotation transition
        this.rotation += (this.targetRotation - this.rotation) * 0.1;
    }

    // Make bird jump/flap
    jump() {
        this.velocity = this.jumpVelocity;
        this.rotation = -20; // Quick upward rotation when jumping
    }

    // Render bird on canvas
    render(ctx) {
        ctx.save();

        // Move to bird position and rotate
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        // Draw bird body (circle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw bird outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw eye
        ctx.fillStyle = this.eyeColor;
        ctx.beginPath();
        ctx.arc(5, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw pupil
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(6, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw beak
        ctx.fillStyle = this.beakColor;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(14, 2);
        ctx.lineTo(8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw wing
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.ellipse(-3, 2, 6, 4, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        ctx.restore();
    }

    // Get bird's bounding box for collision detection
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    // Check if bird hits the ground
    isGrounded(canvasHeight) {
        return this.y + this.height / 2 >= canvasHeight - 50; // 50px for ground height
    }

    // Check if bird is out of bounds (fallen off screen)
    isOutOfBounds(canvasHeight) {
        return this.y - this.height / 2 > canvasHeight;
    }

    // Reset bird to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.rotation = 0;
        this.targetRotation = 0;
    }

    // Add bounce effect when hitting ground
    bounce() {
        this.velocity = -this.velocity * 0.3; // Small bounce
        this.rotation = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bird;
}