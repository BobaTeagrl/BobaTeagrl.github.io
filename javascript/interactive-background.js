// Interactive Background with P5.js
// Easy plug-and-play: Just include P5.js and this file in any page!

let CELL_SIZE = 15;
const BACKGROUND_COLOR = '#1a1d20';
let GRID_COLOR = [222, 22, 206];

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

// --- Global State ---

let debugMode = false;
let userInput = [];

// --- Helpers ---
function normalizeKey(key) {
    key = key.toLowerCase();
    switch (key) {
        case "arrowup": return "up";
        case "arrowdown": return "down";
        case "arrowleft": return "left";
        case "arrowright": return "right";
        default: return key;
    }
}


// --- Combo Definitions ---
const combos = {
    // Konami Code
    "up,up,down,down,left,right,left,right,b,a": () => {
        useImages = !useImages;
        CELL_SIZE = useImages ? 22 : 15;
        showHint(useImages ? "easter egg activated! 🎉" : "easter egg deactivated", useImages);
        log("Konami code activated!", { useImages, CELL_SIZE });
    },

    // D,E,B,U,G toggles debug mode
    "d,e,b,u,g": () => {
        debugMode = !debugMode;
        showHint(debugMode ? "Debug mode ON 🐞" : "Debug mode OFF");
        console.log(`%c🐞 Debug mode ${debugMode ? "ENABLED" : "DISABLED"}`, "color:#ffb400;font-weight:bold;");
        if (debugMode) {
            console.group("%cAvailable Combos", "color:#00b7ff;font-weight:bold;");
            Object.keys(combos).forEach(c => console.log("•", c));
            console.groupEnd();
        }
    }




}
// --- Event Listener ---
document.addEventListener("keydown", (event) => {
    const key = normalizeKey(event.key);
    userInput.push(key);
    if (userInput.length > 15) userInput.shift();

    const inputStr = userInput.join(",");
    log("Key pressed:", key, "| Buffer:", `[${inputStr}]`);

    // Check combos
    for (const combo in combos) {
        if (inputStr.endsWith(combo)) {
            log("Matched combo:", combo);
            combos[combo]();
            log("Executed action for:", combo);
            userInput = [];
            break;
        }
    }
});


function log(...args) {
    if (!debugMode) return;
    const t = new Date().toLocaleTimeString();
    console.log(`%c[DEBUG ${t}]`, "color:#888;font-weight:bold;", ...args);
}

function showHint(text, active = true) {
    const hintElement = document.querySelector(".easter-egg-hint p");
    if (!hintElement) return;

    const originalText = hintElement.textContent;
    hintElement.textContent = text;
    hintElement.style.color = active ? "#92cc41" : "#ffc107";

    log("Hint shown:", text);

    setTimeout(() => {
        hintElement.textContent = originalText;
        hintElement.style.color = "#92cc41";
        log("Hint reverted to:", originalText);
    }, 3000);
}
