// TODO : - add mouse wheel to change selector
// - draw the gizmo only when the mouse is over 


let cols = 30;
let rows = 30;
let cellSize = 20;
let w = rows * cellSize;
let h = cols * cellSize;

let grid = new Array(cols);

let openSet = [];
let closedSet = []; 

// Selector states :
// 1 = white 
// 2 = black 
// 3 = point A
// 4 = point B 
let selector = {
    value: 1
}

class Cell {
    constructor() {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.type = 1;
    }
}

// Return the color of the selector
function whichColor(s) {
    switch (s) {
        case 1:
            return 255
        case 2:
            return 0
        case 3:
            return "blue"
        case 4:
            return "red"
        default:
            // not defined :
            return "purple"
    }
}

function setup() {
    cnv = createCanvas(w, h);
    cnv.mouseMoved(cellBrush);

    // Creating the grid :
    for (y = 0; y < cols; y++) {
        grid[y] = new Array(rows);
    }

    // Filling the grid 
    for (x = 0; x < rows; x++) {
        for (y = 0; y < cols; y++) {
            grid[y][x] = new Cell();
        }
    }

    background(80);
    noLoop();
}


// Draw the selector state 
function drawSelectorState(type, c) {
    // Top 
    let m = {
        x: mouseX,
        y: mouseY
    }

    push()
    if (m.x >= 4*w / 5) {
        translate(-75, 0)
    }
    if(m.y <= 4*h/5){
        translate(0,25)
    }
    // lil square
    stroke(2);
    fill(c);
    //rect(10, 10, 15, 15);
    rect(m.x + 2, m.y - 17, 15, 15);

    // lil text :
    stroke(5);
    fill(255)
    textSize(15);
    // text(type, 30, 25);
    text(type, m.x + 20, m.y - 5);
    pop()
}

// draw the selector state according to the value passed 
function gizmoSelector(s) {
    switch (s.value) {
        case 1:
            drawSelectorState("Walkable", 255)
            break;
        case 2:
            drawSelectorState("Obstacle", 0)
            break;
        case 3:
            drawSelectorState("Point A", "blue")
            break;
        case 4:
            drawSelectorState("Point B", "red")
            break;
    }
}

let pointA = new Cell();
let pointB = new Cell();

function cellBrush() {
    // gizmos :
    let m = {
        x: mouseX,
        y: mouseY
    }

    let x = floor(map(m.x, 0, (rows-1)*cellSize, 0, rows - 1, true));
    let y = floor(map(m.y, 0, (cols-1)*cellSize, 0, grid.length - 1, true));

    // console.log(`x : ${x} y : ${y}`);
    // console.log(`cell type : ${grid[x][y].type}`);

    redraw();
    push();

    strokeWeight(4);
    stroke(0, 200, 140);
    fill(whichColor(selector.value));

    cnv.mouseClicked(() => {
        if(selector.value == 3){
            pointA.type = 1
            pointA = grid[y][x]
            pointA.type = 3;
        }
        else if(selector.value == 4){
            pointB.type = 1
            pointB = grid[y][x]
            pointB.type = 4
        }
        else{
            grid[y][x].type = selector.value;
        }
    })

    rect(x * cellSize, y * cellSize, cellSize, cellSize)
    pop()

    gizmoSelector(selector);

}

// choosing the value of the selector
function keyPressed() {
    redraw()
    switch (keyCode) {
        case 49:
            selector.value = 1;
            break;
        case 50:
            selector.value = 2;
            break;
        case 51:
            selector.value = 3;
            break;
        case 52:
            selector.value = 4;
            break;
    }
    gizmoSelector(selector);

}

function canvasPosToGrid(x, y) {
    let xCnv = floor(map(x, 0, w, 0, rows));
    let yCnv = floor(map(y, 0, h, 0, cols));
    return xCnv, yCnv
}

function keyTyped() {
    if (key === "r" || key == "R") {
        resetGrid();
    }
}

function resetGrid() {
    for (y = 0; y < cols; y++) {
        for (x = 0; x < rows; x++) {
            grid[y][x].type = 1;
        }
    }
    redraw()
    push()
    textSize(w / 10)
    text("GRID RESET", w / 2 - w / 4, h / 2)
    pop()
}


function draw() {
    for (y = 0; y < cols; y += 1) {
        for (x = 0; x < rows; x += 1) {
            let cell = grid[y][x];
            push();
            fill(whichColor(cell.type));
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            pop();
        }
    }
}



function initialize() {
}

