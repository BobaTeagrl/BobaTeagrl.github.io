

let CELL_SIZE = 15;
const BACKGROUND_COLOR = '#1a1d20';
let GRID_COLOR = [0, 200, 255]; // cyanish

let useImages = false;
let numRows, numCols;
let currentRow = -2, currentCol = -2;
let allNeighbors = [];
let img;
let canvas;

// Debug mode
let debugMode = false;
let keyPressLog = [];

// Code sequences 
const CODE_SEQUENCES = {
    debug: {
        keys: [68, 69, 66, 85, 71], // D E B U G
        action: () => {
            debugMode = !debugMode;
            showHint(debugMode ? "Debug mode ON " : "Debug mode OFF", debugMode ? "#ffff00" : "#888888");
            
            if (debugMode) {
                console.log(" DEBUG MODE ACTIVATED");
                console.log("━".repeat(50));
                console.log("Available secret codes:");
                Object.entries(CODE_SEQUENCES).forEach(([name, config]) => {
                    if (name !== 'debug') { // Don't show debug code itself
                        console.log(`  - ${config.description}`);
                        console.log(`    Keys: ${config.keys.map(k => String.fromCharCode(k)).join(' ')} (${config.keys.join(', ')})`);
                    }
                });
                console.log("━".repeat(50));
                console.log("Press keys to see their codes in real-time");
                console.log("━".repeat(50));
            } else {
                console.log("Debug mode deactivated");
                keyPressLog = [];
            }
        },
        description: "Type DEBUG - Toggle debug mode"
    },
    konami: {
        keys: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], // Up Up Down Down Left Right Left Right B A
        action: () => {
            useImages = !useImages;
            CELL_SIZE = useImages ? 22 : 15;
            showHint(useImages ? "easter egg activated!" : "easter egg deactivated", useImages ? "#92cc41" : "#ffc107");
        },
        description: "Konami Code - Toggle image mode"
    },
    red: {
        keys: [82, 69, 68], // R E D
        action: () => {
            GRID_COLOR = [255, 0, 52];
            showHint("Red grid activated! ", "#ff4141");
        },
        description: "Type RED - Red grid color"
    },
    blue: {
        keys: [66, 76, 85, 69], // B L U E
        action: () => {
            GRID_COLOR = [65, 146, 255];
            showHint("Blue grid activated! ", "#4192ff");
        },
        description: "Type BLUE - Blue grid color"
    },
    green: {
        keys: [71, 82, 69, 69, 78], // G R E E N
        action: () => {
            GRID_COLOR = [146, 204, 65];
            showHint("Green grid activated! ", "#92cc41");
        },
        description: "Type GREEN - Default green grid"
    },
    purple: {
        keys: [80, 85, 82, 80, 76, 69], // P U R P L E
        action: () => {
            GRID_COLOR = [195, 0, 255];
            showHint("Purple grid activated! ", "#c300ff");
        },
        description: "Type PURPLE - Purple grid color"
    },
    pink: {
        keys: [80, 73, 78, 75], // P I N K
        action: () => {
            GRID_COLOR = [255, 0, 128];
            showHint("Pink grid activated! ", "#ff0080");
        },
        description: "Type PINK - Pink grid color"
    },
    orange: {
        keys: [79, 82, 65, 78, 71, 69,], //O R A N G E
        action: () => {
            GRID_COLOR = [255, 163, 0]
            showHint("Orange grid activated!" , "#ffa300")
        },
        description: "Type ORANGE - Orange grid color"
    },
    rainbow: {
        keys: [82, 65, 73, 78, 66, 79, 87], // R A I N B O W
        action: () => {
            // Rainbow mode uses dynamic colors in draw()
            GRID_COLOR = 'rainbow';
            showHint("Rainbow mode activated! ", "#ff00ff");
        },
        description: "Type RAINBOW - Rainbow effect"
    },
    whenexist: {
        keys: [87, 72, 69, 78, 69, 88, 73, 83, 84], // W H E N E X I S T
        action: () => {
            flashImage('./Images/whenexist.jpg', 800);
            showHint("me when", "#c300ff");
        },
        description: "Type WHENEXIST - show a meme"
    },
};

// Track input 
let codeInputs = {};
Object.keys(CODE_SEQUENCES).forEach(key => {
    codeInputs[key] = [];
});

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
    
    // very very subtle hint
    console.log(" Type 'DEBUG' to see available codes and key presses");
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
            // Handle rainbow mode
            let color = GRID_COLOR;
            if (GRID_COLOR === 'rainbow') {
                let hue = (frameCount + neighbor.row * 10 + neighbor.col * 10) % 360;
                colorMode(HSB, 360, 100, 100);
                color = [hue, 80, 90];
                stroke(color[0], color[1], color[2], neighbor.opacity);
                colorMode(RGB, 255);
            } else {
                stroke(color[0], color[1], color[2], neighbor.opacity);
            }
            
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

// Helper function to show hints
function showHint(message, color) {
    const hintElement = document.querySelector('.easter-egg-hint p');
    if (hintElement) {
        const originalText = hintElement.textContent;
        const originalColor = hintElement.style.color;
        hintElement.textContent = message;
        hintElement.style.color = color;
        
        setTimeout(() => {
            hintElement.textContent = originalText;
            hintElement.style.color = originalColor || "#92cc41";
        }, 3000);
    }
    console.log(message);
}

function flashImage(src, duration = 600) {
    let flashEl = document.getElementById('flash-overlay');
    if (!flashEl) {
        flashEl = document.createElement('img');
        flashEl.id = 'flash-overlay';
        Object.assign(flashEl.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '60vw',
            maxHeight: '60vh',
            objectFit: 'contain',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.15s ease',
            pointerEvents: 'none',
        });
        document.body.appendChild(flashEl);
    }

    flashEl.src = src;
    flashEl.style.opacity = '1';
    clearTimeout(flashEl._timeout);
    flashEl._timeout = setTimeout(() => {
        flashEl.style.opacity = '0';
    }, duration);
}

// Code detection system
document.addEventListener("keydown", function(event) {
    // Debug mode key logging
    if (debugMode) {
        const keyChar = String.fromCharCode(event.keyCode);
        const keyInfo = `Key: '${keyChar}' | Code: ${event.keyCode}`;
        keyPressLog.push(keyInfo);
        
        // Keep only last 20 key presses
        if (keyPressLog.length > 20) {
            keyPressLog.shift();
        }
        
        console.log(`  ${keyInfo} | Recent: [${keyPressLog.slice(-10).map(k => k.split("'")[1]).join(', ')}]`);
    }
    
    // Check each code sequence
    Object.entries(CODE_SEQUENCES).forEach(([name, config]) => {
        codeInputs[name].push(event.keyCode);
        
        // Keep only the last N keys (length of the code)
        if (codeInputs[name].length > config.keys.length) {
            codeInputs[name].shift();
        }
        
        // Check if the input matches the code
        if (JSON.stringify(codeInputs[name]) === JSON.stringify(config.keys)) {
            if (debugMode) {
                console.log(` CODE MATCHED: ${name.toUpperCase()}`);
            }
            config.action();
            // Reset this code's input after activation
            codeInputs[name] = [];
        }
    });
});