const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
let background=new Image();
background.src='fruit-ninja-assets/background.png';
let names=['app','ban','or','wat','pin','bom'];
let arr = [];
const gravity = 0.2;
let score=0
let missed=0
let toStop=false;
let active_splashes=[];
let splash=[];
const appleSP = new Image();
appleSP.src = "fruit-ninja-assets/splash_red_small.png";
splash.push(appleSP);
const bananaSP = new Image();
bananaSP.src="fruit-ninja-assets/splash_yellow.png";
splash.push(bananaSP);
const orangeSP = new Image();
orangeSP.src="fruit-ninja-assets/splash_orange.png";
splash.push(orangeSP);
const watermelonSP = new Image();
watermelonSP.src="fruit-ninja-assets/splash_red.png";
splash.push(watermelonSP);
const pineappleSP = new Image();
pineappleSP.src="fruit-ninja-assets/splash_yellow.png";
splash.push(pineappleSP);
const bombSP = new Image();
bombSP.src='fruit-ninja-assets/explosion.png';
splash.push(bombSP);

let fruits=[]
const apple = new Image();
apple.src = "fruit-ninja-assets/apple.png";
fruits.push(apple);
const banana = new Image();
banana.src="fruit-ninja-assets/banana.png";
fruits.push(banana);
const orange = new Image();
orange.src="fruit-ninja-assets/orange.png";
fruits.push(orange);
const watermelon = new Image();
watermelon.src="fruit-ninja-assets/watermelon.png";
fruits.push(watermelon);
const pineapple=new Image();
pineapple.src='fruit-ninja-assets/pineapple.png';
fruits.push(pineapple)
const bomb = new Image();
bomb.src='fruit-ninja-assets/bomb.png';
fruits.push(bomb);

// Fill background
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity, type,NAME}) {
        this.NAME=NAME;
        this.position = position;
        this.velocity = velocity;
        this.type = type;
        this.width = 65; // Sprite width
        this.height = 65; // Sprite height
        if(names.indexOf(this.NAME)==4)
            this.height=95;
        this.markedForDeletion = false;
    }

    update() {
        c.drawImage(this.type,this.position.x, this.position.y,this.width+5,this.height+5)
        if(this.velocity.x!=0&&this.velocity.y!=0){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;
        if (this.position.y > canvas.height) {
            this.markedForDeletion = true;
            if(this.type.src!='http://127.0.0.1:3000/fruit-ninja-assets/bomb.png')
                missed++;
            if(missed==3){
             toStop=true;
            }
            document.getElementById('missed').textContent="Missed: "+missed;
            // console.log("Missed:",missed);
        }
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
        let rand=Math.floor(Math.random() * fruits.length)
        let fruit = new Sprite({
            position: { x: X, y: canvas.height },
            velocity: { x: velX, y: -velY },
            type: fruits[rand],
            NAME: names[rand]
        });
        // console.log(fruit.type);
        arr.push(fruit);
    }
}


// Handle mouse input
const mouse = { x: 0, y: 0 };
let isDragging = false;

canvas.addEventListener('mousedown', () => {
    isDragging = true;
    canvas.style.cursor='url("fruit-ninja-assets/knife.png"), auto'
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
                let SPLASH = new Sprite({
                    position: { x: fruit.position.x, y: fruit.position.y },
                    velocity: { x: 0, y: 0 },
                    type: splash[names.indexOf(fruit.NAME)],
                    // type: splash[fruits.indexOf(fruit)]
                });
                // console.log(fruit.type.src)
                active_splashes.push(SPLASH);
                console.log(fruit.type.src);
                if(fruit.type.src=='http://127.0.0.1:3000/fruit-ninja-assets/bomb.png')
                    toStop=true;
                else{
                score++;
                // console.log("Score:", score)
                document.getElementById('score').textContent="Score: "+score
                fruit.markedForDeletion = true; // Mark for deletion
                }
            }
        });
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor='default';
});

// Animation loop
function animate() {
    // c.fillStyle = 'black';
    // c.fillRect(0, 0, canvas.width, canvas.height);
    c.drawImage(background,0,0,canvas.width,canvas.height)
    arr = arr.filter(fruit => !fruit.markedForDeletion); // Remove deleted fruits
    
    active_splashes.forEach(spl=>spl.update())
    arr.forEach(fruit => fruit.update());
    if(!toStop)
    requestAnimationFrame(animate); // Continue the loop
    else
    clearInterval(intervalid);
}

// Start generating fruits and animation

let intervalid = setInterval(createFruits, 3000);
if(toStop) {
    // let over=document.getElementsByClassName('over');
    // over.textContent="GAME OVER."
    // console.log(document.body)
    clearInterval(intervalid); 
}
animate();