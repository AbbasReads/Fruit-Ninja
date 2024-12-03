const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
let fruit;
const gravity = 0.2;
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50; // Sprite width
        this.height = 50; // Sprite height
        this.markedForDeletion = false; // Flag for deletion
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply gravity
        this.velocity.y += gravity;

        // Mark for deletion if it crosses the screen boundaries
        if (
            this.position.x + this.width < 0 ||
            this.position.x > canvas.width ||
            this.position.y > canvas.height
        ) {
            this.markedForDeletion = true;
        }
    }
}
const mouse = {
    x: 0,
    y: 0
};
let isDragging = false;
// Handle mouse movement
canvas.addEventListener('mousedown', (event) => {
    isDragging = true
    console.log(event.clientX, event.clientY)
})
canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        if (
            mouse.x >= fruit.position.x &&
            mouse.x <= fruit.position.x + fruit.width &&
            mouse.y >= fruit.position.y &&
            mouse.y <= fruit.position.y + fruit.height
        ) {
            fruit.markedForDeletion = true; // Mark for deletion
        }
    }
});
canvas.addEventListener('mouseup', () => {
    isDragging = false
})
// Animation loop
function animate() {
    window.requestAnimationFrame(animate);

    // Clear the canvas
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // Update and draw the sprite if not marked for deletion
    if (!fruit.markedForDeletion) {
        fruit.update();
    }
}
function generate() {
    let X=Math.random() * (canvas.width-100)+100;
    console.log(X)
    let velY=Math.random()*7+8
    console.log(velY)
    let X2=Math.random()*((canvas.width-X)/(2*velY)*gravity)
    let velX=((X > (canvas.width) / 2)? -X2 : X2);
    fruit = new Sprite({
        position: { x: X, y: canvas.height },
        velocity: { x: velX, y: -velY }
    });
    animate();
}
generate();

