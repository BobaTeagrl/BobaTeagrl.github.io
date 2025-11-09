// Interactive Background with P5.js
// Easy plug-and-play: Just include P5.js and this file in any page!

let CELL_SIZE = 15;
const BACKGROUND_COLOR = '#1a1d20';
const GRID_COLOR = [146, 204, 65];

let useImages = false;
let numRows, numCols;
let currentRow = -2, currentCol = -2;
let allNeighbors = [];
let img;
let canvas;

function preload() {
    img = loadImage("./Images/dic.png",
        () => console.log("Easter egg image loaded!"),
        () => console.error("Easter egg image failed to load")
    );
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id('background-canvas');
    canvas.parent(document.body);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    
    background(BACKGROUND_COLOR);
    noFill();
    numRows = Math.ceil(windowHeight / CELL_SIZE);
    numCols = Math.ceil(windowWidth / CELL_SIZE);
}

function draw() {
    background(BACKGROUND_COLOR);
    
    if (mouseX > 0 && mouseY > 0) {
        let row = floor(mouseY / CELL_SIZE);
        let col = floor(mouseX / CELL_SIZE);
        
        if (row !== currentRow || col !== currentCol) {
            currentRow = row;
            currentCol = col;
            allNeighbors.push(...getRandomNeighbors(row, col));
        }
    }

    for (let neighbor of allNeighbors) {
        let x = neighbor.col * CELL_SIZE;
        let y = neighbor.row * CELL_SIZE;
        neighbor.opacity = max(0, neighbor.opacity - 3);

        if (useImages && img) {
            tint(255, neighbor.opacity);
            image(img, x, y, CELL_SIZE, CELL_SIZE);
            noTint();
        } else {
            stroke(GRID_COLOR[0], GRID_COLOR[1], GRID_COLOR[2], neighbor.opacity);
            strokeWeight(1);
            rect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }

    allNeighbors = allNeighbors.filter(neighbor => neighbor.opacity > 0);
}

function getRandomNeighbors(row, col) {
    let neighbors = [];
    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            let neighborRow = row + dRow;
            let neighborCol = col + dCol;
            
            if ((dRow !== 0 || dCol !== 0) && 
                neighborRow >= 0 && neighborRow < numRows && 
                neighborCol >= 0 && neighborCol < numCols &&
                Math.random() < 0.4) {
                neighbors.push({ 
                    row: neighborRow, 
                    col: neighborCol, 
                    opacity: 180
                });
            }
        }
    }
    return neighbors;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    numRows = Math.ceil(windowHeight / CELL_SIZE);
    numCols = Math.ceil(windowWidth / CELL_SIZE);
    background(BACKGROUND_COLOR);
}

// Konami Code Easter Egg
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; 
let userInput = [];

document.addEventListener("keydown", function(event) {
    userInput.push(event.keyCode);
    if (userInput.length > konamiCode.length) userInput.shift();

    if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
        useImages = !useImages;
        CELL_SIZE = useImages ? 22 : 15;
        
        const hintElement = document.querySelector('.easter-egg-hint p');
        if (hintElement) {
            const originalText = hintElement.textContent;
            hintElement.textContent = useImages ? "easter egg activated! 🎉" : "easter egg deactivated";
            hintElement.style.color = useImages ? "#92cc41" : "#ffc107";
            
            setTimeout(() => {
                hintElement.textContent = originalText;
                hintElement.style.color = "#92cc41";
            }, 3000);
        }
        
        console.log("Konami code activated! Effect:", useImages ? "ON" : "OFF");
    }
});