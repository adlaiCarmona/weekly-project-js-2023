const colors = {
    bg: "#3B3B3B",
    white: "#F7F7F7",
    green: "#00BF00",
    red: "#DF1C34"
}

const numOfGraphs = 4

const canvases = []
const ctxs = []

const graphs = Array.apply(null, Array(numOfGraphs)).map(() => [])
// const intervals = Array.apply(null, Array(numOfGraphs)).map(() => undefined)
var intervals = []

var isStopped = false
var step = 0
var interval
const intervalTime = 250

const performance = {}

function setup(){
    console.error("-- Setup --")
    const stepButton = document.getElementById("step");
    stepButton.onclick = draw

    const stopButton = document.getElementById("stop");
    stopButton.onclick = playOrPause

    for (let i = 0; i < numOfGraphs; i++) {
        canvases[i] = document.getElementById(`graph-${i}`);
        ctxs[i] = canvases[i].getContext ? canvases[i].getContext("2d") : null;

        // ctxs[i].canvas.width = Math.floor(window.innerWidth * .8)
        // ctxs[i].canvas.height = Math.floor(window.innerHeight * .8)

        console.log(ctxs[i])

        // setBackgroundColor(ctxs[i], colors.bg)

        fillRandomNumbersInArray(graphs[i], 30)
    }

    console.log(graphs)

    interval = window.setInterval(() => draw(), intervalTime)
}

function draw(){
    performance.drawStart = window.performance.now()
    for (let i = 0; i < numOfGraphs; i++) {
        setBackgroundColor(ctxs[i], colors.bg)
        drawGraph(ctxs[i], graphs[i])
    }
    performance.drawStop = window.performance.now()

    nextStep()
}

function nextStep(){
    performance.stepStart = window.performance.now()
    for (let i = 0; i < numOfGraphs; i++) {
        graphs[i].shift()
        const next = getNextSmoothRandomInt(graphs[i].slice(-1)[0], 10)
        graphs[i].push(next)
    }
    performance.stepStop = window.performance.now()

    performance.draw = performance.drawStop - performance.drawStart
    performance.step = performance.stepStop - performance.stepStart
    // console.table(performance)
}

function drawGraph(ctx, values){
    const min = clamp(Math.min(...values) - 10, 0)
    const max = Math.max(...values) + 10

    const barWidth = Math.floor(ctx.canvas.width * .8 / (values.length + 1))
    const gap = Math.floor(ctx.canvas.width * .1 / (values.length + 1))
    const barHeight = Math.floor(ctx.canvas.height / ((max) * 1.5))

    // console.info(`Math.floor(${ctx.canvas.height} / (${(max - min) * 1.05}))`)

    // console.table([
    //     ["barWidth",barWidth],
    //     ["barHeight",barHeight],
    //     ["gap",gap],
    //     ["Canvas Width", ctx.canvas.width],
    //     ["Canvas Heigth", ctx.canvas.height],
    //     ["Values", values],
    //     ["Min", min],
    //     ["Max", max]
    // ])

    for (let index = 1; index < values.length; index++) {
        const color = getStatusColor(values[index], values[index - 1])
        ctx.fillStyle = color;

        const x = (barWidth + gap) * (index - 1) + gap
        const y = ctx.canvas.height - (barHeight * Math.max(values[index], values[index - 1]))
        const width = barWidth
        const diff = Math.abs(values[index] - values[index - 1])
        const height = values[index] !== values[index - 1] ? barHeight * diff : 1
        // console.log(`ctx.fillRect(${x}, ${y}, ${width}, ${height}); ${color}`)
        ctx.fillRect(x, y, width, height);
    }
}

function fillRandomNumbersInArray(array, many = 1){
    for (let index = 0; index < many; index++) {
        let random
        if(index === 0)
            random = getRandomInt(100) + 100
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
    isStopped = !isStopped
    // stopButton.innerHTML = isStopped ? "Play":"Pause"
    if(isStopped){
        clearInterval(interval)
        console.info(`Interval (${interval}) - Cleared`)
    }
    else{
        interval = window.setInterval(() => draw(), intervalTime)
        console.info(`Continue`)
    }
}

// function handleIntervals(){
//     interval = window.setTimeout(() => draw(), 1000)
//     intervals.push(interval)
//     console.warn(`Interval %c#${intervals.length} with Id: ${intervals.slice(-1)[0]} %c Created on step: ${step}; ${window.performance.now()}`,
//      'background: #222; color: #bada55', 'background: #222; color: #3333aa')
//     console.log(intervals)
// }

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