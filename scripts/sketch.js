// TODO :
// - Add a maze generate button 
// BUGS FIX : 
// - fix the point A and B over obstacle bug

let cols = 25;
let rows = 50;
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
    w = rows * cellSize;
    h = cols * cellSize;

    cnv = createCanvas(w, h);

    cnv.mouseMoved(cellBrush);
    cnv.mouseWheel(wheelSelector);
    cnv.mouseOut(() => {
        if (settingUp) updatePreview();
    })

    // Creating the grid :
    for (y = 0; y < cols; y++) {
        grid[y] = new Array(rows);
    }

    // Filling & showing the grid 
    background(255);
    for (x = 0; x < rows; x++) {
        for (y = 0; y < cols; y++) {
            grid[y][x] = new Cell(x, y);
            grid[y][x].show(255);
        }
    }

    noLoop();
}


// Draw the selector state 
function drawSelectorState(type, c) {
    if (settingUp) {
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
        let m = {
            x: mouseX,
            y: mouseY
        }
        // Mapping the mouse position to the grid coordinates
        let x = floor(map(m.x, 0, (rows - 1) * cellSize, 0, rows - 1, true));
        let y = floor(map(m.y, 0, (cols - 1) * cellSize, 0, cols - 1, true));

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
                    if (grid[y][x] == pointA) { // If drawing on point A
                        pointA = new Cell()
                    }
                    if (grid[y][x] == pointB) { // If drawing on point A
                        pointB = new Cell()
                    }
                    grid[y][x].type = selector;
                }
            }
        })

        // Click and drag brush drawing :
        if (mouseIsPressed && (selector == 1 || selector == 2)) {
            if (grid[y][x].type != selector) {
                grid[y][x].type = selector;
            }
        }

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

function wheelSelector(e) {
    if (settingUp) {
        updatePreview();
        console.log(e.deltaY)
        if (e.deltaY < 0) { // scrolling up
            if (selector < 4) selector++;
            else selector = 1

        } else { // Scrolling down
            if (selector > 1) selector--;
            else selector = 4;
        }
        gizmoSelector(selector);
    }
}

let paused = false;
function keyTyped() {
    // RESET
    if ((key === "r" || key == "R") && settingUp) {
        resetGrid();
    }
    // PAUSE
    if ((key == "p" || key == "¨P") && !settingUp) {
        if (!paused) {
            noLoop()
            paused = true;
        } else {
            loop();
            paused = false;
        }

    }
    // STARTING THE ALGO
    if (key === " ") {
        if (pointA.x == undefined || pointA.y == undefined) { // A was not set up
            push()
            textSize(w / 25)
            text("NO POINT A FOUND", w / 2 - w / 4, h / 2)
            pop()
        }
        else if (pointB.x == undefined || pointB.y == undefined) { // B was not set up
            push()
            textSize(w / 25)
            text("NO POINT B FOUND", w / 2 - w / 4, h / 2)
            pop()
        }
        else if ((pointA.x != undefined && pointA.y != undefined) && (pointB.x != undefined && pointB.y != undefined)) {
            initialize();
        }
    }
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
let pathFound = false;

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
                pathFound = true;
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
            while (t.cameFrom) {
                path.push(t),
                    t = t.cameFrom;
            }

        } else {
            pathFound = false;
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

        pointA.show(whichColor(pointA.type));
        pointB.show(whichColor(pointB.type));

        if (!pathFound && openSet.length == 0) {
            push()
            textSize(w / 20)
            text("NO PATH FOUND", w / 2 - w / 4, h / 2)
            pop()
        }
    }
}

// Generate a random grid with obstacles
function generateRandom() {
    if (settingUp) {
        // Resetting the grid :
        for (y = 0; y < cols; y++) {
            for (x = 0; x < rows; x++) {
                if (grid[y][x].type != 3 && grid[y][x].type != 4) {
                    grid[y][x].type = 1
                }
            }
        }

        for (y = 0; y < cols; y++) {
            for (x = 0; x < rows; x++) {
                if (random() < 0.2 && grid[y][x].type != 3 && grid[y][x].type != 4) {
                    grid[y][x].type = 2
                }
            }
        }
        updatePreview();
    }
}