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
    cnv.mousePressed(changeCell);
    background(80);
    
    for (x = 0; x < w / cellSize; x += 1) {
        for (y = 0; y < h / cellSize; y += 1) {
            rect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
    }
    noLoop()
}

function keyPressed(){
    console.log(`Keycode : ${keyCode} \n key : ${key}`)
    redraw()
    switch(keyCode){
        case 49:
            selector=1;
            selectorState("walkable", 255)

            break;
        case 50:
            selector=2;
            selectorState("obstacle", 0)
            break
        case 51:
            selector=3;
            selectorState("Point A", "blue")
            break
        case 52:
            selector=4;
            selectorState("Point B", "red")
            break
        
    }
}

function selectorState(str, c){
    stroke(2);
    fill(c);
    rect(10, 10, 15, 15);
    
    stroke(5);
    fill(255)
    textSize(15);
    text(str, 30, 25);
}

function changeCell(){
    // mouse click => change cell state

    // gizmos :
    let m ={
        x:mouseX,
        y:mouseY
    } 
    redraw()
    push()
    fill(255,0,0)
    rect(m.x,m.y,5,5)
    pop()

    console.log("lalala",m)
}

function draw() {
    for (x = 0; x < w / cellSize; x += 1) {
        for (y = 0; y < h / cellSize; y += 1) {
            rect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
    }
}

