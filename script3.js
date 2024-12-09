const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let fruitcolors = ['red', 'blue', 'green', 'orange', 'white', 'cyan', 'maroon'];
canvas.width = 1024;
canvas.height = 576;
let arr = [];
const gravity = 0.2;
let score=0
let missed=0
let toStop=false;

let fruits=[]
const img = new Image();
img.src = "fruit-ninja-assets/apple.png";
fruits.push(img);
img.src="fruit-ninja-assets/banana.png";
fruits.push(img);
img.src="fruit-ninja-assets/orange.png";
fruits.push(img);
img.src="fruit-ninja-assets/watermelon.png";
fruits.push(img);
console.log(fruits);

// Fill background
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity, color }) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.width = 50; // Sprite width
        this.height = 50; // Sprite height
        this.markedForDeletion = false; // Flag for deletion
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;
        if (this.position.y > canvas.height) {
            this.markedForDeletion = true;
            
            if(++missed==3) toStop=true;
            document.getElementById('missed').textContent="Missed: "+missed;
            console.log("Missed:",missed);
        }
    }
}

// Generate new fruits
function createFruits() {
    let n = Math.floor(Math.random() * 3) + 1; // Number of fruits
    // score+=n;
    while (n--) {
        let X = Math.random() * (canvas.width - 100) + 50;
        let velY = Math.random() * 7 + 8;
        let X2 = Math.random() * ((canvas.width - X) / (2 * velY) * gravity);
        let velX = X > canvas.width / 2 ? -X2 : X2;

        let fruit = new Sprite({
            position: { x: X, y: canvas.height },
            velocity: { x: velX, y: -velY },
            color: fruitcolors[Math.floor(Math.random() * fruitcolors.length)],
        });

        arr.push(fruit);
    }
}

// Handle mouse input
const mouse = { x: 0, y: 0 };
let isDragging = false;

canvas.addEventListener('mousedown', () => {
    isDragging = true;
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;

        arr.forEach(fruit => {
            if (
                mouse.x >= fruit.position.x &&
                mouse.x <= fruit.position.x + fruit.width &&
                mouse.y >= fruit.position.y &&
                mouse.y <= fruit.position.y + fruit.height && fruit.markedForDeletion==false
            ) {
                if(fruit.color=='maroon')
                    toStop=true;
                else{
                score++;
                console.log("Score:", score)
                document.getElementById('score').textContent="Score: "+score
                fruit.markedForDeletion = true; // Mark for deletion
                }
            }
        });
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Animation loop
function animate() {
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    arr = arr.filter(fruit => !fruit.markedForDeletion); // Remove deleted fruits
    arr.forEach(fruit => fruit.update());
    if(!toStop)
    requestAnimationFrame(animate); // Continue the loop
}

// Start generating fruits and animation
setInterval(createFruits, 3000);
animate();