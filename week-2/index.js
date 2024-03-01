// TODO: Maybe can rotate tiles with css and add animation to it

const colors = {
    bg: "#0F0F0F",
    graph: "#232D3F",
    white: "#F7F7F7",
    green: "#00BF00",
    red: "#DF1C34"
}

const configs = {
    tileWidth: 56,
    tileHeight: 56,
    numOfStyles: 7,
    numOfGraphs: 49,
    tilesHorizontal: 7,
    isStopped: false,
    minIntervalTime: 500,
    maxIntervalTime: 1500
}

var inputAccent;
var inputBackground;
const tiles = [];
var tilesContainer;
const baseTiles = [];
const baseTilesCanvas = [];

const stocksPerformance = []

const performance = {}

function setup(){
    document.getElementById("step").onclick = draw;
    document.getElementById("stop").onclick = playOrPause;

    inputAccent = document.getElementById("accent")
    inputAccent.addEventListener("input", switchBaseTilesColor)
    inputAccent.addEventListener("change", switchTilesColor)
    inputBackground = document.getElementById("background")
    inputBackground.addEventListener("input", switchBaseTilesColor)
    inputBackground.addEventListener("change", switchTilesColor)

    tilesContainer = document.getElementById("other-graphs");
    tilesContainer.style.width = `${configs.tileWidth * configs.tilesHorizontal}px`

    setupCanvases()

    // configs.interval = window.setInterval(() => draw(), configs.intervalTime)
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

function setupCanvases() {
    for (let i = 0; i < configs.numOfStyles; i++) {
        baseTilesCanvas.push(document.getElementById(`base-tile-${i}`));
        console.info(`i: ${i}; baseTilesCanvas[${i}]: ${baseTilesCanvas[i]}`)
        baseTiles.push(new Tile(baseTilesCanvas[i], configs.tileWidth, configs.tileWidth, i))
    }

    for (let i = 0; i < configs.numOfGraphs; i++) {
        tiles.push(new Tile())
    }
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

function switchTilesStyle(style) {
    for (const tile of tiles){
        tile.setStyle(style)
    }
}

function switchBaseTilesColor() {
    for (const tile of baseTiles){
        tile.refresh()
    }
}

function switchTilesColor() {
    for (const tile of tiles){
        tile.refresh()
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

class Tile {
    constructor (canvas, width, height, style = 0, rotation = 0){
        this.style = style;
        this.rotation = rotation;

        if (canvas === undefined){
            this.createCloneBaseCanvas();
            tilesContainer.appendChild(this.canvas)

            this.canvas.addEventListener("click", () => this.rotateClockwise())
            this.canvas.addEventListener("contextmenu", e => {e.preventDefault(); this.rotateCounterClockwise()})
        } else {
            this.setupTile(canvas, width, height)

            this.canvas.addEventListener("click", () => switchTilesStyle(this.style))
        }
    }

    setupTile(canvas, width, height) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.setCanvasSize(width, height)

        this.drawStyle()
    }

    createCanvas(width, height) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setCanvasSize(width, height)
    }

    createCloneBaseCanvas() {
        this.createCanvas(configs.tileWidth, configs.tileWidth)
        this.cloneCanvas(baseTilesCanvas[this.style])
    }

    cloneCanvas(canvas) {
        this.ctx.drawImage(canvas, 0, 0);
    }

    rotateClockwise() {
        this.rotation = (this.rotation + 1) % 4
        this.rotate()
    }

    rotateCounterClockwise() {
        this.rotation = this.rotation !== 0 ? this.rotation - 1 : 3
        this.rotate()
    }

    rotate(){
        this.ctx.save();
        
        this.ctx.translate(this.ctx.canvas.width >> 1, this.ctx.canvas.height >> 1);
        this.ctx.rotate(Math.PI / 2 * this.rotation);
        this.ctx.drawImage(baseTilesCanvas[this.style], -(this.ctx.canvas.width >> 1), -(this.ctx.canvas.height >> 1));

        this.ctx.restore();
    }

    refresh() {
        this.drawStyle()
    }

    setStyle(style) {
        this.style = style;
        this.cloneCanvas(baseTilesCanvas[style])
    }

    drawStyle() {
        this.setBackgroundColor(inputBackground.value)

        switch (this.style) {
            case 1:
                this.drawStyle1()
                break;
            case 2:
                this.drawStyle2()
                break;
            case 3:
                this.drawStyle3()
                break;
            case 4:
                this.drawStyle4()
                break;
            case 5:
                this.drawStyle5()
                break;
            case 6:
                this.drawStyle6()
                break;
            default:
                this.drawStyle0()
                break;
        }
    }

    drawStyle6() {
        this.ctx.fillStyle = this.ctx.strokeStyle = inputAccent.value;
        this.ctx.lineWidth = 15;
        
        this.ctx.beginPath();
        this.ctx.arc(this.width >> 1, 0, this.width >> 3, 0, Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.width >> 1, this.height, this.width >> 3, Math.PI, 0);
        this.ctx.fill();
    
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height >> 1);
        this.ctx.lineTo(this.width, this.height >> 1);
        this.ctx.stroke();
    }

    drawStyle5() {
        this.ctx.fillStyle = this.ctx.strokeStyle = inputAccent.value;
        this.ctx.lineWidth = 15;
        
        this.ctx.beginPath();
        this.ctx.arc(this.width >> 1, 0, this.width >> 3, 0, Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.width, this.height >> 1, this.width >> 3, 0, Math.PI * 2);
        this.ctx.fill();
    
        this.ctx.beginPath();
        this.ctx.arc(0, this.height, (this.width >> 1), 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    drawStyle4() {
        this.ctx.strokeStyle = inputAccent.value;
        this.ctx.lineWidth = 15;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.width >> 1, 0);
        this.ctx.lineTo(this.width >> 1, this.height);
        this.ctx.stroke();
    
        this.ctx.beginPath();
        this.ctx.arc(0, this.height, this.width >> 1, 0, Math.PI, true);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.width, this.height, this.width >> 1, 0, Math.PI, true);
        this.ctx.stroke();
    }

    drawStyle3() {
        this.ctx.strokeStyle = inputAccent.value;
        this.ctx.lineWidth = 15;

        this.ctx.beginPath();
        this.ctx.moveTo(this.width >> 1, 0);
        this.ctx.lineTo(this.width >> 1, this.height >> 1);
        this.ctx.lineTo(this.width, this.height >> 1);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, this.height, this.width >> 1, 0, Math.PI, true);
        this.ctx.stroke();
    }

    drawStyle2() {
        this.ctx.fillStyle = inputAccent.value;

        this.ctx.fillRect(0, 0, this.width >> 1, this.height >> 1)
        this.ctx.fillRect(this.width >> 1, this.height >> 1, this.width, this.height)

        this.ctx.fillStyle = inputBackground.value;
        this.ctx.fillRect(0, 0, this.width >> 2, this.height >> 2)
        this.ctx.fillRect((this.width >> 2)*3, (this.height >> 2)*3, this.width, this.height)
    }

    drawStyle1() {
        this.ctx.strokeStyle = inputAccent.value;
        this.ctx.lineWidth = 15;
        
        this.ctx.beginPath();
        this.ctx.arc(this.width, 0, this.width >> 1, 0, Math.PI);
        this.ctx.stroke();
    
        this.ctx.beginPath();
        this.ctx.arc(0, this.height, this.width >> 1, 0, Math.PI, true);
        this.ctx.stroke();
    }

    drawStyle0() {
        this.ctx.fillStyle = inputAccent.value;
        
        this.ctx.beginPath();
        this.ctx.arc(this.width >> 1, 0, this.width >> 3, 0, Math.PI);
        this.ctx.fill();
    
        this.ctx.fillRect(0, (this.height>>3)*3, this.width, (this.height>>3)*6);
    
        this.ctx.fillStyle = inputBackground.value;
    
        this.ctx.beginPath();
        this.ctx.arc(this.width, this.height, (this.width >> 3) * 3, 0, 2 * Math.PI, true);
        this.ctx.fill();
    
        this.ctx.beginPath();
        this.ctx.arc(0, this.height, (this.width >> 3) * 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    setBackgroundColor(color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    

    setCanvasSize(baseWidth, baseHeigth, percentageWidth = 1, percentageHeight = 1){
        this.width = this.ctx.canvas.width = Math.floor(baseWidth * percentageWidth);
        this.height = this.ctx.canvas.height = Math.floor(baseHeigth * percentageHeight);
    }

    toogleAutoRotate(){
        if (!this.interval){
            this.interval = window.setInterval(() => this.rotateClockwise(), getRandomInt(configs.maxIntervalTime) + configs.minIntervalTime)
        } else {
            window.clearInterval(this.interval)
            this.interval = null
        }
    }
}

window.addEventListener("load", setup);