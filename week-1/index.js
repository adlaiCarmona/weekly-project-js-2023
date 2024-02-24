const colors = {
    bg: "#0F0F0F",
    graph: "#232D3F",
    white: "#F7F7F7",
    green: "#00BF00",
    red: "#DF1C34"
}

const configs = {
    numOfGraphs: 4,
    isStopped: false,
    selectedGraph: 0,
    interval: undefined,
    intervalTime: 250
}

const graphContainers = {}
const canvases = []
const ctxs = []
const graphs = Array.apply(null, Array(configs.numOfGraphs)).map(() => [])

const performance = {}

function setup(){
    document.getElementById("step").onclick = draw;
    document.getElementById("stop").onclick = playOrPause;

    graphContainers.selected = document.getElementById("selected-graph");
    graphContainers.others = document.getElementById("other-graphs");

    for (let i = 0; i < configs.numOfGraphs; i++) {
        canvases[i] = document.getElementById(`graph-${i}`);
        canvases[i].addEventListener("click", () => handleGraphSelection(i))
        ctxs[i] = canvases[i].getContext ? canvases[i].getContext("2d") : null;

        if(i === 0)
            setCanvasSize(i, graphContainers.selected.offsetWidth, graphContainers.selected.offsetWidth, .7, .7)
        else
            setCanvasSize(i, 200, 200, 1, 1)

        fillRandomNumbersInArray(graphs[i], 50)
    }
    console.log(graphs)

    configs.interval = window.setInterval(() => draw(), configs.intervalTime)
}

function draw(){
    performance.drawStart = window.performance.now()
    for (let i = 0; i < configs.numOfGraphs; i++) {
        setBackgroundColor(ctxs[i], colors.bg)
        drawGraph(ctxs[i], graphs[i])
    }
    performance.drawStop = window.performance.now()

    nextStep()
}

function nextStep(){
    performance.stepStart = window.performance.now()
    for (let i = 0; i < configs.numOfGraphs; i++) {
        graphs[i].shift()
        const next = getNextSmoothRandomInt(graphs[i].slice(-1)[0], 50)
        graphs[i].push(next)
    }
    performance.stepStop = window.performance.now()

    performance.draw = performance.drawStop - performance.drawStart
    performance.step = performance.stepStop - performance.stepStart
    // console.table(performance)
}

function drawGraph(ctx, values){
    const barWidth = Math.floor(ctx.canvas.width * .8 / (values.length + 1))
    const gap = Math.floor(ctx.canvas.width * .1 / (values.length + 1))
    const barHeight = ctx.canvas.height / (Math.max(...values) * 1.2)

    for (let index = 1; index < values.length; index++) {
        const color = getStatusColor(values[index], values[index - 1])
        ctx.fillStyle = color;

        const x = (barWidth + gap) * (index - 1) + gap
        const y = clamp(Math.floor(barHeight * Math.min(values[index], values[index - 1])), 1)
        const width = barWidth
        const diff = Math.abs(values[index] - values[index - 1])
        const height = clamp(Math.floor(barHeight * diff), 1)

        ctx.fillRect(x, y, width, height);
    }
}

function fillRandomNumbersInArray(array, many = 1){
    for (let index = 0; index < many; index++) {
        let random
        if(index === 0)
            random = getRandomInt(500) + 150
        else {
            const prev = array.slice(-1)[0]
            random = getNextSmoothRandomInt(prev, Math.floor(prev * .20))
        }
            
        array.push(random)
    }
}

function getStatusColor(prev, curr){
    let color;

    if(curr === prev)
        color = colors.white
    else if(curr > prev)
        color = colors.green
    else
        color = colors.red
    return color
}

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

function setBackgroundColor(ctx, color){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clamp(value, min, max = Infinity){
    return Math.min(Math.max(value, min), max);
}

function playOrPause(){
    configs.isStopped = !configs.isStopped
    // stopButton.innerHTML = isStopped ? "Play":"Pause"
    if(configs.isStopped){
        clearInterval(configs.interval)
        console.info(`Interval (${configs.interval}) - Cleared`)
    }
    else{
        configs.interval = window.setInterval(() => draw(), configs.intervalTime)
        console.info(`Continue`)
    }
}

function setCanvasSize(graphIndex, baseWidth, baseHeigth, percentageWidth, percentageHeight){
    ctxs[graphIndex].canvas.width = Math.floor(baseWidth * percentageWidth)
    ctxs[graphIndex].canvas.height = Math.floor(baseHeigth * percentageHeight)
}

function handleGraphSelection(newSelection){
    if(configs.selectedGraph === newSelection) return

    graphContainers.selected.appendChild(canvases[newSelection])
    graphContainers.others.appendChild(canvases[configs.selectedGraph])

    setCanvasSize(newSelection, graphContainers.selected.offsetWidth, graphContainers.selected.offsetWidth, .7, .7)
    setCanvasSize(configs.selectedGraph, 200, 200, 1, 1)

    configs.selectedGraph = newSelection
}

// function transformHexcodeToRGB(hexcode){
//     let r = "";
//     let g = "";
//     let b = "";

//     for(const char of hexcode.split('')){
//         if(char === "#") continue;

//         if(r.length < 2) r.concat(char);
//         else if(g.length < 2) g.concat(char);
//         else if(b.length < 2) b.concat(char);

//         if(b.length === 2)
//             break
//     }
    
//     return `rgb(${r} ${g} ${b})`
// }

// class RGBColor {
//     constructor(red, green, blue){
//         this.red = red;
//         this.green = green;
//         this.blue = blue;
//     }

//     constructor(hexcode){
//         this.red = hexcode.red;
//         this.green = hexcode.green;
//         this.blue = hexcode.blue;
//     }

//     getRGBObject() {
//         return {red: this.red, green: this.green, blue: this.blue}
//     }

//     getRGBString() {
//         return `rgb(${this.red} ${this.green} ${this.blue})`
//     }

// }

window.addEventListener("load", setup);
// window.addEventListener("load", () => document.getElementById("setup").onclick = setup);