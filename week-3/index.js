
const colors = {
    bg: "#0F0F0F",
    graph: "#232D3F",
    white: "#F7F7F7",
    green: "#00BF00",
    red: "#DF1C34"
}

const configs = {
}

const sudokuValues = []
const shiftPlusNumber = ['!','@','#','$','%','^','&','*','(',')']

const solverPerformance = []
const performance = {}
const selectedCell = {element: null, row: null, col: null}

function setup(){
    // document.getElementById("step").onclick = draw;
    // document.getElementById("stop").onclick = playOrPause;

    // tilesContainer.style.width = `${configs.tileWidth * configs.tilesHorizontal}px`

    setupSudoku()

    window.addEventListener(
        "keydown",
        (event) => {
            if (event.defaultPrevented) {
                return; // Do nothing if event already handled
            }
            console.log(event.key)
            if(selectedCell.row === null || selectedCell.col === null) return

            if(!isNaN(event.key)){
                const answer = document.getElementById(`answer-${selectedCell.row}-${selectedCell.col}`)
                answer.innerText = event.key
                answer.classList.remove('hidden')

                const notes = document.getElementById(`notes-${selectedCell.row}-${selectedCell.col}`)
                notes.classList.add('hidden')
            }
            else if(shiftPlusNumber.includes(event.key)){
                const notes = document.getElementById(`notes-${selectedCell.row}-${selectedCell.col}`)
                notes.classList.remove('hidden')

                const note = document.getElementById(`note#${shiftPlusNumber.findIndex(e => e === event.key)}-${selectedCell.row}-${selectedCell.col}`)
                note.classList.toggle('hidden')
            } else if (event.key === 'Backspace') {
                const answer = document.getElementById(`answer-${selectedCell.row}-${selectedCell.col}`)
                answer.innerText = ''
                answer.classList.add('hidden')

                const notes = document.getElementById(`notes-${selectedCell.row}-${selectedCell.col}`)
                notes.classList.remove('hidden')
            }
        },
        true,
    );
}

function draw(){
    performance.drawStart = window.performance.now()
    for (let i = 0; i < configs.numOfGraphs; i++) {
        setBackgroundColor(ctxs[i], colors.bg)
        drawGraph(ctxs[i], graphs[i])
    }
    performance.drawStop = window.performance.now()

    // nextStep()
}

function setupSudoku() {
    const sudoku = document.getElementById("sudoku")
    const blocks = new Array(3);

    
    for (let j = 0; j < blocks.length; j++) {
        blocks[j] = new Array(3);
        for (let i = 0; i < blocks.length; i++) {
            blocks[j][i] = document.createElement('div');
            blocks[j][i].setAttribute('id',`cell-block-${j}-${i}`)
            blocks[j][i].setAttribute('class','cell-block')
            sudoku.appendChild(blocks[j][i])
        }
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const notes = createNotesDiv(row, col);
            const answer = document.createElement('div');
            answer.setAttribute('id',`answer-${row}-${col}`);
            answer.classList.add("answer");

            const cell = document.createElement('div');
            cell.setAttribute('id',`cell-${row}-${col}`)
            cell.setAttribute('class',`cell`)
            cell.appendChild(notes)
            cell.appendChild(answer)
            cell.addEventListener("click", () => selectCell(row, col))

            const blockRow = Math.floor(row/3)
            const blockCol = Math.floor(col/3)
            blocks[blockCol][blockRow].appendChild(cell)
            // sudoku.appendChild(cell)

            // baseTilesCanvas.push(document.getElementById(`base-tile-${i}`));
            // console.info(`i: ${i}; baseTilesCanvas[${i}]: ${baseTilesCanvas[i]}`)
            // baseTiles.push(new Tile(baseTilesCanvas[i], configs.tileWidth, configs.tileWidth, i))
        }
    }
}

function createNotesDiv(row, col) {
    const notes = document.createElement('div');
    notes.setAttribute('id',`notes-${row}-${col}`);
    notes.classList.add("notes");
    notes.classList.add("hidden");

    for (let i = 0; i < 9; i++) {
        const num = document.createElement('div');
        num.setAttribute('id',`note#${i}-${row}-${col}`)
        num.classList.add("hidden");
        num.innerText = i + 1;

        notes.appendChild(num)
    }
    return notes
}

function selectCell(row, col) {
    if(row === selectedCell.row && col === selectedCell.col){
        selectedCell.element.classList.toggle('selected');
        selectedCell.element = null;
        selectedCell.row = null;
        selectedCell.col = null;
        return
    }

    const cell = document.getElementById(`cell-${row}-${col}`)
    if(selectedCell.element) selectedCell.element.classList.toggle('selected');
    cell.classList.toggle('selected');
    selectedCell.element = cell;
    selectedCell.row = row;
    selectedCell.col = col;
}

function playOrPause(){
    configs.isStopped = !configs.isStopped
    // stopButton.innerHTML = isStopped ? "Play":"Pause"
    if(configs.isStopped){
        for (const tile of tiles){
            tile.toogleAutoRotate()
        }
        
        console.info(`Intervals - Cleared`)
    }
    else{
        for (const tile of tiles){
            tile.toogleAutoRotate()
        }

        console.info(`Continue`)
    }
}

// General Function Methods

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getNextSmoothRandomInt(prev, max){
    let next;
    do{
        next = prev + getRandomInt(max) - (max >> 1)
    }while(next < 0)
    return next
}

function clamp(value, min, max = Infinity){
    return Math.min(Math.max(value, min), max);
}

// Classes
class Sudoku{

}

window.addEventListener("load", setup);