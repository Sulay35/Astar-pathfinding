// TODO : - add mouse wheel to change selector
// - draw the gizmo only when the mouse is over 
// - Add click and slide brush


let cols = 25;
let rows = 25;
let cellSize = 25;
let w = rows * cellSize;
let h = cols * cellSize;

let grid = new Array(cols);

// Selector states :
// 1 = white 
// 2 = black 
// 3 = point A
// 4 = point B 
let selector = 1;

let settingUp = true;

class Cell {
    constructor(x, y) {
        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.x = x;
        this.y = y;

        this.type = 1;

        this.neighbours = [];

        this.cameFrom = undefined;

        this.show = function (c) {
            push();
            stroke(0);
            fill(c);
            rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
            pop()
        }

        this.addNeighbours = function (grid) {
            if (this.x < rows - 1) {
                this.neighbours.push(grid[this.y][this.x + 1])
            }
            if (this.y < cols - 1) {
                this.neighbours.push(grid[this.y + 1][this.x])
            }
            if (this.x > 0) {
                this.neighbours.push(grid[this.y][this.x - 1])
            }
            if (this.y > 0) {
                this.neighbours.push(grid[this.y - 1][this.x])
            }
        }
    }
}

// Return the color of the selector
function whichColor(s) {
    switch (s) {
        case 1:
            return color(255)
        case 2:
            return color(0)
        case 3:
            return color(0, 0, 255)
        case 4:
            return color(255, 165, 0)
        default:
            // not defined :
            return color(255, 50, 255)
    }
}

function canvasPosToGrid(x, y) {
    let xCnv = floor(map(x, 0, w, 0, rows));
    let yCnv = floor(map(y, 0, h, 0, cols));
    return xCnv, yCnv
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
            grid[y][x] = new Cell(x, y);
        }
    }

    background(255);
    noLoop();
}


// Draw the selector state 
function drawSelectorState(type, c) {
    if (settingUp) {

        // Top 
        let m = {
            x: mouseX,
            y: mouseY
        }

        push()
        if (m.x >= 4 * w / 5) {
            translate(-75, 0)
        }
        if (m.y <= h / 5) {
            translate(0, 25)
        }
        // lil square
        stroke(2);
        fill(c);
        rect(m.x + 2, m.y - 17, 15, 15);

        // lil text :
        stroke(5);
        fill(255)
        textSize(15);
        text(type, m.x + 20, m.y - 5);
        pop()
    }
}

// draw the selector state according to the value passed 
function gizmoSelector(s) {
    switch (s) {
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
            drawSelectorState("Point B", "orange")
            break;
    }
}

let pointA = new Cell();
let pointB = new Cell();

function cellBrush() {
    if (settingUp) {

        // gizmos :
        let m = {
            x: mouseX,
            y: mouseY
        }

        let x = floor(map(m.x, 0, (rows - 1) * cellSize, 0, rows - 1, true));
        let y = floor(map(m.y, 0, (cols - 1) * cellSize, 0, grid.length - 1, true));

        // console.log(`x : ${x} y : ${y}`);
        // console.log(`cell type : ${grid[x][y].type}`);

        updatePreview();
        push();

        strokeWeight(4);
        stroke(0, 200, 140, 80);
        let col = whichColor(selector);
        col.setAlpha(120);
        fill(col);

        cnv.mouseClicked(() => {
            if (settingUp) {
                if (selector == 3) {
                    pointA.type = 1
                    pointA = grid[y][x]
                    pointA.type = 3;
                }
                else if (selector == 4) {
                    pointB.type = 1
                    pointB = grid[y][x]
                    pointB.type = 4
                }
                else {
                    grid[y][x].type = selector;
                }
            }
        })

        rect(x * cellSize, y * cellSize, cellSize, cellSize)
        pop()

        gizmoSelector(selector);
    }
}

// choosing the value of the selector
function keyPressed() {
    if (settingUp) {
        updatePreview();
        switch (keyCode) {
            case 49:
                selector = 1;
                break;
            case 50:
                selector = 2;
                break;
            case 51:
                selector = 3;
                break;
            case 52:
                selector = 4;
                break;
        }
        gizmoSelector(selector);
    }
}

function keyTyped() {
    if ((key === "r" || key == "R") && settingUp) {
        resetGrid();
    }
    // STARTING THE ALGO
    if (key === " ") initialize();
}

function resetGrid() {
    for (y = 0; y < cols; y++) {
        for (x = 0; x < rows; x++) {
            grid[y][x].type = 1;
        }
    }
    updatePreview()
    push()
    textSize(w / 10)
    text("GRID RESET", w / 2 - w / 4, h / 2)
    pop()
}


function updatePreview() {
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


// -----ALGORITHM -----------------------------------------

let openSet = [];
let closedSet = [];

let path = [];

function removeFromArray(elt, arr) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristicD(a, b) {
    // Calculate an euclidian distance in a 2D space :
    let d = sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2));
    return d;
}

function initialize() {
    openSet.push(pointA);
    settingUp = false;
    // Add neigh
    for (y = 0; y < cols; y++) {
        for (x = 0; x < rows; x++) {
            grid[y][x].addNeighbours(grid);
        }
    }

    loop()
}

function draw() {
    if (!settingUp) {
        if (openSet.length > 0) {
            let best = 0; // index of the best cell to go 

            for (i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[best].f) {
                    best = i;
                }
            }

            let current = openSet[best];

            if (current == pointB) {
                // We made it to the goal
                console.log("DONE!");
                noLoop();
            }

            removeFromArray(current, openSet);
            closedSet.push(current);

            for (i = 0; i < current.neighbours.length; i++) {
                let neigh = current.neighbours[i];

                if (!closedSet.includes(neigh) && neigh.type != 2) {
                    let tentG = current.g + 1; // simulating a tentative g cost if we had to go there
                    if (openSet.includes(neigh)) {
                        if (tentG < neigh.g) {
                            neigh.g = tentG;
                        }
                    } else { // we discoverd a new cell
                        neigh.g = tentG;
                        openSet.push(neigh);
                    }
                    neigh.h = heuristicD(neigh, pointB); // guessed distance
                    neigh.f = neigh.g + neigh.h; // updating the f cost
                    neigh.cameFrom = current;
                }


            }

            path = [pointA];
            let t = current;
            path.push(t);
            while(t.cameFrom){
                path.push(t),
                t = t.cameFrom;
            }

        }else{
            console.log("NO PATH FOUND!")
            noLoop();
        }

        // Drawing the grid :
        for (y = 0; y < cols; y++) {
            for (x = 0; x < rows; x++) {
                grid[y][x].show(whichColor(grid[y][x].type));
            }
        }
        for (i = 0; i < closedSet.length; i++) {
            closedSet[i].show(color(255, 0, 0));
        }
        for (i = 0; i < openSet.length; i++) {
            openSet[i].show(color(0, 255, 0));
        }
        for (i = 0; i < path.length; i++) {
            path[i].show(color(0, 255, 255));
        }
    }
}