const pressure = document.querySelector('#pressure input')
const cells = document.querySelector('#cells input')
const bacteria = document.querySelector('#bacteria input')
const virus = document.querySelector('#virus input')
const health = document.querySelector('#health span')
const ttl = document.querySelector('#time span')
const canvasPressure = document.querySelector('#pressure-cv')
const ctxPressure = canvasPressure.getContext('2d')
ctxPressure.width = canvasPressure.width = 500
ctxPressure.height = canvasPressure.height = 300
const canvasCells = document.querySelector('#cells-cv')
const ctxCells = canvasCells.getContext('2d')
ctxCells.width = canvasCells.width = 500
ctxCells.height = canvasCells.height = 300
const canvasBacteria = document.querySelector('#bacteria-cv')
const ctxBacteria = canvasBacteria.getContext('2d')
ctxBacteria.width = canvasBacteria.width = 500
ctxBacteria.height = canvasBacteria.height = 300
const canvasVirus = document.querySelector('#virus-cv')
const ctxVirus = canvasVirus.getContext('2d')
ctxVirus.width = canvasVirus.width = 1000
ctxVirus.height = canvasVirus.height = 500
let btn = document.querySelector('button')

let pressureVal = 0.6
let cellsVal = 0.9
let bacteriaVal = 0.0001
let virusVal = 0.0001
let healthVal = 100
let ttlVal = 0

pressure.value = pressureVal
cells.value = cellsVal
bacteria.value = bacteriaVal
virus.value = virusVal

const PRESSURE_MIN = 0.3
const PRESSURE_MAX = 0.99
const CELL_MIN = 0.2
const CELL_MAX = 0.999
const BACTERIA_LOW = 0.02
const BACTERIA_HIGH = 0.6
const VIRUS_LOW = 0.002
const VIRUS_HIGH = 0.5

let alive = true

function draw(ctx, fill) {
  ctx.beginPath()
  ctx.fillStyle = fill
  ctx.arc(Math.random() * ctx.width, Math.random() * ctx.height, pressureVal * 70, 0, 2 * Math.PI)
  ctx.arc(Math.random() * ctx.width, Math.random() * ctx.height, cellsVal * 50, 0, 2 * Math.PI)
  ctx.arc(Math.random() * ctx.width, Math.random() * ctx.height, bacteriaVal * 10, 0, 2 * Math.PI)
  ctx.arc(Math.random() * ctx.width, Math.random() * ctx.height, virusVal * 10, 0, 2 * Math.PI)
  ctx.fill()
}

function render() {
  pressureVal = Math.sin(pressureVal * (cellsVal / pressureVal))
  let cellsRandom = Math.random() * cellsVal
  cellsVal = Math.cos((pressureVal - (bacteriaVal * virusVal)) * cellsVal)
  
  const bacteriaRandom = Math.random()
  if (bacteriaRandom > BACTERIA_LOW && bacteriaRandom < BACTERIA_HIGH) {
    bacteriaVal = Math.sin(bacteriaVal + (cellsVal / (bacteriaRandom * 2500)))
    cellsVal -= bacteriaVal * cellsVal 
  } else if (bacteriaRandom >= BACTERIA_HIGH)  {
    bacteriaVal = Math.sin(bacteriaVal + (cellsVal / (bacteriaRandom * 1000)))
    cellsVal -= bacteriaVal * cellsVal
    
    if (virusVal >= VIRUS_HIGH) {
      cellsVal -= virusVal * cellsVal
    }
  }
  
  const virusRandom = Math.random()
  if (bacteriaRandom >= BACTERIA_HIGH) {
    virusVal = Math.sin(virusVal + (bacteriaVal * (virusRandom * 1000)))
    healthVal --
  } else if (bacteriaRandom > BACTERIA_LOW) {
    virusVal = Math.sin(virusVal - (bacteriaVal * (virusRandom * 1000)))
  } else {
    virusVal = Math.sin(virusVal + (bacteriaVal * (virusRandom * 1000)))
  }
  
  if (pressureVal < 0.0 || isNaN(pressureVal)) {
    pressureVal = 0.0
    alive = false
  }
  
  if (cellsVal < 0.000001 || isNaN(cellsVal)) {
    cellsVal = 0.0
    alive = false
  }
  
  if (bacteriaVal < 0.000001 || isNaN(bacteriaVal)) {
    bacteriaVal = 0.000001
  }
  
  if (virusVal < 0.000001 || isNaN(virusVal)) {
    virusVal = 0.000001
  }
  
  pressure.value = pressureVal.toFixed(7)
  cells.value = cellsVal.toFixed(7)
  bacteria.value = bacteriaVal.toFixed(7)
  virus.value = virusVal.toFixed(7)
  
  draw(ctxPressure, `rgba(230, 40, 210, ${pressureVal * 0.01})`)
  draw(ctxCells, `rgba(220, 110, 10, ${cellsVal * 0.01})`)
  draw(ctxBacteria, `rgba(20, 200, 120, ${bacteriaVal * 0.01})`)
  draw(ctxVirus, `rgba(20, 200, 230, ${virusVal * 0.005})`)
  
  if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
      (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
    if (cellsVal < CELL_MIN) {
      cells.classList.add('critical')
      healthVal = healthVal - (pressureVal / 1500 / cellsVal)
    }
    
    if (pressureVal >= PRESSURE_MAX) {
      pressure.classList.add('critical')
      healthVal = healthVal - (pressureVal / 10000 / cellsVal)
    }
    
    if (virusVal >= VIRUS_HIGH) {
      virus.classList.add('critical')
      healthVal = healthVal - (pressureVal / 10000 / virusVal)
    }
    
    if (pressureVal < 0.0001) {
      pressure.classList.add('critical')
      cells.classList.add('critical')
      healthVal = 0
      alive = false
    }
  }
  
  if (virusVal < VIRUS_HIGH) {
    virus.classList.remove('critical')
  }
  
  if (bacteriaVal < BACTERIA_HIGH) {
    bacteria.classList.remove('critical')
  }
  
  if ((pressureVal >= PRESSURE_MIN && pressureVal < PRESSURE_MAX) &&
      (cellsVal > CELL_MIN && cellsVal < CELL_MAX)) {
    pressure.classList.remove('critical')
    cells.classList.remove('critical')
    healthVal = healthVal + ((pressureVal * cellsVal) / (bacteriaVal / virusVal))
  }
  
  health.textContent = healthVal.toFixed(2)
  ttlVal++
  
  if (healthVal < 1 || !alive) {
    ctxPressure.clearRect(0, 0, ctxPressure.width, ctxPressure.height)
    ctxPressure.fillStyle = 'black'
    ctxPressure.fill()
    ctxCells.clearRect(0, 0, ctxCells.width, ctxCells.height)
    ctxCells.fillStyle = 'white'
    ctxCells.fill()
    health.textContent = 'DEAD.'
    ttl.textContent = ttlVal
    btn.disabled = ''

    let avgs = JSON.parse(localStorage.getItem('levvvels-avg-arr')) || []
    avgs.push(ttlVal)
    if (avgs.length > 50) {
      avgs = avgs.slice(0)
    }
    const total = avgs.reduce((a, b) => a + b, 0)
    localStorage.setItem('levvvels-avg-curr', total / avgs.length)
    localStorage.setItem('levvvels-avg-arr', JSON.stringify(avgs))
    
  } else {
    ttl.textContent = ttlVal
    requestAnimationFrame(render)
    if (ttlVal % Math.round(pressureVal * 100) === 0) {
      ctxPressure.clearRect(0, 0, ctxPressure.width, ctxPressure.height)
    }
    
    if (ttlVal % Math.round(pressureVal * 1200) === 0) {
      ctxCells.clearRect(0, 0, ctxCells.width, ctxCells.height)
    }
    
    if (ttlVal % Math.round(pressureVal * 1700) === 0) {
      ctxBacteria.clearRect(0, 0, ctxBacteria.width, ctxBacteria.height)
      ctxVirus.clearRect(0, 0, ctxVirus.width, ctxVirus.height)
    }
  }
}

btn.onclick = function () {
  pressureVal = pressure.value
  cellsVal = cells.value
  bacteriaVal = bacteria.value
  virusVal = virus.value
  btn.disabled = 'disabled'
  render()
}