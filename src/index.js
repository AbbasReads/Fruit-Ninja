import { getFirestore, collection, query, orderBy, limit, doc, getDoc, getDocs, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyAE8OZ1NvRkmwxW4vyV1NI_BBa1gwHhBHU",
    authDomain: "cut-it-fc910.firebaseapp.com",
    projectId: "cut-it-fc910",
    storageBucket: "cut-it-fc910.appspot.com",
    messagingSenderId: "778376583214",
    appId: "1:778376583214:web:b163998a07e5a6afa7e7bf",
    measurementId: "G-E8K0920MYG"
};
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentHighScore = 0;
async function getLeaderboard() {
    const leaderboard = [];
    try {
        const q = query(
            collection(db, "users"),
            orderBy("high score", "desc"),
            limit(10) // Adjust the limit to show the top N players
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            leaderboard.push(doc.data());
        });
        //   return leaderboard;
        console.log(leaderboard)
        leaderboard.forEach((player) => {
            let row = document.createElement('tr')
            let scorecell = document.createElement('td')
            let namecell = document.createElement('td')
            namecell.textContent = player['Username']
            scorecell.textContent = player['high score']
            row.append(namecell, scorecell)
            document.getElementsByTagName('tbody')[0].append(row);
        })
    } catch (e) {
        console.error("Error retrieving leaderboard: ", e);
    }
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        console.log("User logged in:", currentUser.uid);


        const userRef = doc(db, 'users', currentUser.uid);


        try {
            const userDoc = await getDoc(userRef);


            if (userDoc.exists()) {
                currentHighScore = userDoc.data()["high score"] || 0;
                console.log("Current high score:", currentHighScore);
                let getalife = document.getElementById('high')
                getalife.innerText = "Personal best: " + currentHighScore;

            } else {

                await setDoc(userRef, { "high score": 0 });
                console.log("User document created with default high score.");
            }


            async function saveHighScore(score) {
                if (score > currentHighScore) {
                    await updateDoc(userRef, { "high score": score });
                    console.log('High score updated to:', score);
                } else {
                    console.log('Score is not higher than the current high score. No update made.');
                }
            }

            window.saveHighScore = saveHighScore;
        } catch (error) {
            console.error("Error accessing Firestore:", error);
        }
    } else {
        console.error("No user logged in.");
    }
});


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
let background = new Image();
background.src = '../assets/background.png';
let names = ['app', 'ban', 'or', 'wat', 'pin', 'bom'];
let points = [1, 1, 2, 2, 5, 0];
let arr = [];
const gravity = 0.2;
let score = 0
let missed = 0
const cutSound = document.getElementById('cutsound');
const explosionSound = document.getElementById('explosionsound');
const bombSound = document.getElementById('Bomb-Fuse');
const cutmeoff = document.getElementById('cutmeoff')
const neon = document.getElementById('neon')

let toStop = 2;
let active_splashes = [];
let splash = [];
let difficulty = 3000;
const appleSP = new Image();
appleSP.src = "../assets/splash_red_small.png";
splash.push(appleSP);
const bananaSP = new Image();
bananaSP.src = "../assets/splash_yellow.png";
splash.push(bananaSP);
const orangeSP = new Image();
orangeSP.src = "../assets/splash_orange.png";
splash.push(orangeSP);
const watermelonSP = new Image();
watermelonSP.src = "../assets/splash_red.png";
splash.push(watermelonSP);
const pineappleSP = new Image();
pineappleSP.src = "../assets/splash_yellow.png";
splash.push(pineappleSP);
const bombSP = new Image();
bombSP.src = '../assets/explosion.png';
splash.push(bombSP);

let fruits = []
const apple = new Image();
apple.src = "../assets/apple.png";
fruits.push(apple);
const banana = new Image();
banana.src = "../assets/banana.png";
fruits.push(banana);
const orange = new Image();
orange.src = "../assets/orange.png";
fruits.push(orange);
const watermelon = new Image();
watermelon.src = "../assets/watermelon.png";
fruits.push(watermelon);
const pineapple = new Image();
pineapple.src = '../assets/pineapple.png';
fruits.push(pineapple)
const bomb = new Image();
bomb.src = '../assets/bomb.png';
fruits.push(bomb);

function gameOver(score) {
    if (currentHighScore > 25 || score > 25) {
        document.getElementById('bronze').style.opacity = 1;
    }
    if (currentHighScore > 50 || score > 50) {
        document.getElementById('silver').style.opacity = 1;
    }
    if (currentHighScore > 100 || score > 100) {
        document.getElementById('gold').style.opacity = 1;
    }
    let gameoverscreen = document.getElementsByClassName('gameOver')[0];
    document.getElementById('score2').innerText = score;
    gameoverscreen.classList.remove('hidden')
    window.scrollTo(0, 10);
    document.getElementById('restart').addEventListener('click', () => {
        location.reload();
    })
}

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity, type, NAME, point }) {
        this.NAME = NAME;
        this.position = position;
        this.velocity = velocity;
        this.type = type;
        this.point = point;
        this.width = 65;
        this.height = 65;
        if (names.indexOf(this.NAME) == 4)
            this.height = 95;
        this.markedForDeletion = false;
    }

    update() {
        c.drawImage(this.type, this.position.x, this.position.y, this.width + 5, this.height + 5)
        if (this.velocity.x != 0 && this.velocity.y != 0) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;
            if (this.position.y > canvas.height) {
                this.markedForDeletion = true;
                if (this.NAME != 'bom') {
                    missed++;
                }
                else {
                    let c = 0;
                    arr.forEach((e) => {
                        // console.log(e.N)
                        if (e.NAME == 'bom')
                            c++
                    })
                    if (c == 1) {
                        bombSound.pause();
                        bombSound.currentTime = 0;
                    }
                }
                if (missed == 3) {
                    toStop = 0;
                }
                document.getElementById('missed').textContent = "Missed: " + missed;

            }
        }
    }
}
function shake() {
    let amp = 3;
    var xsh = (Math.random() * amp * 2 - amp); // random position, bias on x
    var ysh = (Math.random() * amp - amp * 0.5);
    var tr = "translate(" + xsh + "px," + ysh + "px)";
    canvas.style.transform = tr;
    requestAnimationFrame(shake);
}

function createFruits() {
    let n = Math.floor(Math.random() * 3) + 1;

    while (n--) {
        let X = Math.random() * (canvas.width - 100) + 50;
        let velY = Math.random() * 7 + 8;
        let X2 = Math.random() * ((canvas.width - X) / (2 * velY) * gravity);
        let velX = X > canvas.width / 2 ? -X2 : X2;

        let rand = Math.random();
        if (rand <= .25)
            rand = 0;
        else if (rand <= .5)
            rand = 1;
        else if (rand <= 0.75) {
            rand = 5;
            bombSound.play();
        }
        else if (rand <= .8)
            rand = 4;
        else if (rand <= .9)
            rand = 2;
        else
            rand = 3;
        let fruit = new Sprite({
            position: { x: X, y: canvas.height },
            velocity: { x: velX, y: -velY },
            type: fruits[rand],
            NAME: names[rand],
            point: points[rand]
        });

        arr.push(fruit);
    }
}



const mouse = { x: 0, y: 0 };
let isDragging = false;

canvas.addEventListener('mousedown', () => {
    const video = document.getElementById("embers");
    video.play()
    cutmeoff.play();
    isDragging = true;
    canvas.style.cursor = 'url("../assets/knife.png"), auto'
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
                mouse.y <= fruit.position.y + fruit.height && fruit.markedForDeletion == false
            ) {

                let SPLASH = new Sprite({
                    position: { x: fruit.position.x, y: fruit.position.y },
                    velocity: { x: 0, y: 0 },
                    type: splash[names.indexOf(fruit.NAME)],

                });

                active_splashes.push(SPLASH);

                if (fruit.NAME == 'bom') {
                    bombSound.pause();
                    toStop = 1;
                    explosionSound.play();
                }
                else {
                    cutSound.play();
                    score = score + fruit.point;
                    if (difficulty > 1000)
                        difficulty -= 200;
                    else if (difficulty > 600) {
                        difficulty -= 40;
                    }
                    else {
                        document.body.style.backgroundImage = "none"; // Removes the background image
                        document.body.style.backgroundColor = "black";
                        document.getElementById('embers').classList.remove('hidden')
                        // Sets the background color to black
                        shake();
                        cutmeoff.pause();
                        neon.play();
                    }
                    clearInterval(intervalid);
                    intervalid = setInterval(createFruits, difficulty);

                    document.getElementById('score').textContent = "Score: " + score
                }
                fruit.markedForDeletion = true;
            }
        });
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'default';
});


function animate() {


    c.drawImage(background, 0, 0, canvas.width, canvas.height)
    arr = arr.filter(fruit => !fruit.markedForDeletion);

    active_splashes.forEach(spl => spl.update())
    arr.forEach(fruit => fruit.update());
    if (toStop == 2)
        requestAnimationFrame(animate);
    else if (toStop == 1) {
        requestAnimationFrame(animate);
        toStop--;
    }
    else {
        clearInterval(intervalid);
        saveHighScore(score);
        gameOver(score);
        // neon.pause();
        cutmeoff.pause();
        bombSound.pause();
        getLeaderboard();
    }
}



let intervalid = setInterval(createFruits, difficulty);

// shake();
animate();