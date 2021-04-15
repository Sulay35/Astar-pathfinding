// TODO : - add mouse wheel to change selector
// - Cell class
// - draw only if one of the 4 command selector is pressed

let w = 700;
let h = 700;
let grid = []
let cellSize = 35;

// Selector states :
// 1 = white 
// 2 = black 
// 3 = point A
// 4 = point B 
let selector = {
    value: 1
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

    for (x = 0; x < w / cellSize; x += 1) {
        ln = []
        for (y = 0; y < h / cellSize; y += 1) {
            // cell = new Cell().... class
            let cell = {
                type: 1
            }
            ln.push(cell)
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        grid.push(ln)
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
    if (m.x >= w / 2) {
        translate(-75, 0)
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

function cellBrush() {
    // gizmos :
    let m = {
        x: mouseX,
        y: mouseY
    }

    // TODO : add constrain
    let x = floor(map(m.x, 0, w, 0, grid[0].length));
    let y = floor(map(m.y, 0, h, 0, grid.length));

    redraw()
    push()

    strokeWeight(4)
    stroke(0, 200, 140)
    fill(whichColor(selector.value))

    cnv.mouseClicked(() => {
        grid[x][y].type = selector.value;
    })

    rect(x * cellSize, y * cellSize, cellSize, cellSize)

    //rect(m.x, m.y, cellSize, cellSize)
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
    let xCnv = floor(map(m.x, 0, w, 0, grid[0].length));
    let yCnv = floor(map(m.y, 0, h, 0, grid.length));
    return xCnv, yCnv
}

function keyTyped(){
    if(key === " "){
        resetGrid();
    }
}

function resetGrid(){
    for (x = 0; x < grid[0].length; x += 1) {
        for (y = 0; y < grid.length; y += 1) {
            grid[x][y].type = 1;
        }
    }
    redraw()
}


function draw() {
    for (x = 0; x < grid[0].length; x += 1) {
        for (y = 0; y < grid.length; y += 1) {
            let cell = grid[x][y];
            push();
            fill(whichColor(cell.type));
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            pop();
        }
    }
}

