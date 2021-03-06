// TO DO : 
// - Set the text box as an overlay

// ROWS VALUE
let rowsRange = document.getElementById("rows_range");
let rowstext = document.getElementById("txt_rows_range");

rowsRange.value = rows;
rowstext.textContent = rowsRange.value;
rowsRange.addEventListener('mousemove', () => {
    rowstext.textContent = rowsRange.value;
});

function setRows() {
    rowstext.textContent = rowsRange.value;
    rows = rowsRange.value;
    restart();
}

// COLUMNS VALUE :
let colsRange = document.getElementById("cols_range");
let colstext = document.getElementById("txt_cols_range");

colsRange.value = cols;
colstext.textContent = colsRange.value;
colsRange.addEventListener('mousemove', () => {
    colstext.textContent = colsRange.value;
});

function setCols() {
    colstext.textContent = colsRange.value;
    cols = colsRange.value;
    restart();
}

// CELL SIZE :
let cellSizeRange = document.getElementById("cellSize_range");
let cellSizetext = document.getElementById("txt_cellSize_range");

cellSizeRange.value = cellSize;
cellSizetext.textContent = cellSizeRange.value;
cellSizeRange.addEventListener('mousemove', () => {
    cellSizetext.textContent = cellSizeRange.value;
});

function setCellSize() {
    cellSizetext.textContent = cellSizeRange.value;
    cellSize = cellSizeRange.value;
    restart();
}


function restart() {
    paused = true;
    settingUp = true;
    closedSet = [];
    openSet = [];
    setup();
}

const controlPanel = document.getElementById("controlpanel");
const showPanelBtn = document.getElementById("show_panel");
showPanelBtn.style.display = "none";

let infoHidden = false

document.addEventListener('keypress', (e) => {
    // Display the menu :
    if (e.key == "M" || e.key == "m") {
        if (!infoHidden) {
            infoHidden = true;
            controlPanel.style.display = "none";
            showPanelBtn.style.display = "";
        } else {
            infoHidden = false;
            controlPanel.style.display = "";
            showPanelBtn.style.display = "none";
        }
    }
})

showPanelBtn.addEventListener("mousedown", () => {
    infoHidden = false;
    controlPanel.style.display = "";
    showPanelBtn.style.display = "none";
})

document.addEventListener('wheel',(e) =>{
    e.preventDefault();
}, {passive:false})