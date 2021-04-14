let w = 700;
let h = 700;

let grid = []

let cellSize = 50;

let selector = 1;
// 1 = white 
// 2 = black 
// 3 = point A
// 4 = point B 

function setup() {
    cnv = createCanvas(w, h);
    cnv.mouseMoved(changeCell);
    background(80);

    for (x = 0; x < w / cellSize; x += 1) {
        ln = []
        for (y = 0; y < h / cellSize; y += 1) {
            let cell = {
                // cell = new Cell()....
                type: random([1, 2])
            }
            ln.push(cell)
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        grid.push(ln)
    }
    noLoop()
}

function keyPressed() {
    redraw()
    switch (keyCode) {
        case 49:
            selector = 1;
            selectorState("walkable", 255)

            break;
        case 50:
            selector = 2;
            selectorState("obstacle", 0)
            break
        case 51:
            selector = 3;
            selectorState("Point A", "blue")
            break
        case 52:
            selector = 4;
            selectorState("Point B", "red")
            break

    }
}

function selectorState(str, c) {
    // Top 
    stroke(2);
    fill(c);
    rect(10, 10, 15, 15);

    stroke(5);
    fill(255)
    textSize(15);
    text(str, 30, 25);

    let m = {
        x: mouseX,
        y: mouseY
    }

    //mouse 
    stroke(2);
    fill(c);
    rect(m.x+2, m.y-17, 15, 15);

    stroke(5);
    fill(255)
    textSize(15);
    text(str, m.x+20, m.y-5);
}

function changeCell() {
    // mouse click => change cell state

    // gizmos :
    let m = {
        x: mouseX,
        y: mouseY
    }

    redraw()

    push()
    fill(255, 0, 0)

    let x = floor(map(m.x, 0, w, 0, grid[0].length));
    let y = floor(map(m.y, 0, h, 0, grid.length));
    // TODO : add constrain

    console.log("x : ", x, "y : ", y);
    console.log(grid[x][y].type);
    cnv.mouseClicked(() => {
        grid[x][y].type = selector;
    })

    rect(x * cellSize, y * cellSize, cellSize, cellSize)
    pop()

}

function draw() {
    for (x = 0; x < grid[0].length; x += 1) {
        for (y = 0; y < grid.length; y += 1) {
            let cell = grid[x][y];
            push()

            if (cell.type == 1) c = 255;
            else if (cell.type == 2) c = 0;
            else if (cell.type == 3) c = "blue";
            else if (cell.type == 4) c = "red";

            fill(c)
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            pop()

        }
    }
}

