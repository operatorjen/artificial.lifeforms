const pressure = document.querySelector('#pressure span')
const cells = document.querySelector('#cells span')
const bacteria = document.querySelector('#bacteria span')
const virus = document.querySelector('#virus span')
const health = document.querySelector('#health')
const ttl = document.querySelector('time')
const canvasPressure = document.querySelector('#pressure-cv')
const ctxPressure = canvasPressure.getContext('2d')
ctxPressure.width = canvasPressure.width = 500
ctxPressure.height = canvasPressure.height = 300

let pressureVal = 0.9 
let cellsVal = 0.5
let bacteriaVal = 0.001
let virusVal = 0.01
let healthVal = 1
let ttlVal = 0

const PRESSURE_MIN = 0.3
const PRESSURE_MAX = 0.99
const CELL_MIN = 0.2
const CELL_MAX = 0.999
const BACTERIA_LOW = 0.002
const BACTERIA_HIGH = 0.09
const VIRUS_LOW = 0.002
const VIRUS_HIGH = 0.05

function render() {
  pressureVal = Math.sin(pressureVal * (cellsVal / pressureVal))
  let cellsRandom = Math.random() * cellsVal
  cellsVal = Math.cos((pressureVal - (bacteriaVal * virusVal)) * cellsVal)
  
  const bacteriaRandom = Math.random()
  if (bacteriaRandom > BACTERIA_LOW && bacteriaRandom < BACTERIA_HIGH) {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 2500)))
  } else if (bacteriaRandom >= BACTERIA_HIGH)  {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 1000)))
  }
  
  const virusRandom = Math.random()
  if (bacteriaRandom >= BACTERIA_HIGH) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 2000)))
  } else if (bacteriaRandom > BACTERIA_LOW) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 1500)))
  } else {
    virusVal = Math.sin(virusVal - (virusVal / (bacteriaRandom * cellsVal * 1000)))
  }
  
  if (pressureVal < 0.0 || isNaN(pressureVal)) {
    pressureVal = 0.0
  }
  
  if (cellsVal < 0.000001 || isNaN(cellsVal)) {
    cellsVal = 0.000001
  }
  
  if (bacteriaVal < 0.000001 || isNaN(bacteriaVal)) {
    bacteriaVal = 0.000001
  }
  
  if (virusVal < 0.000001 || isNaN(virusVal)) {
    virusVal = 0.000001
  }
  
  pressure.textContent = pressureVal
  cells.textContent = cellsVal
  bacteria.textContent = bacteriaVal
  virus.textContent = virusVal
  
  ctx.beginPath()
  ctx.fillStyle = 'rgba(220, 101, 100, 0.05)'
  ctx.arc(Math.random() * 60 + 20, Math.random() * 75 + 50, pressureVal * 50, 0, 2 * Math.PI)
  ctx.arc(Math.random() * 80 + 40, Math.random() * 85 + 50, cellsVal * 50, 0, 2 * Math.PI)
  ctx.arc(Math.random() * 280 + 40, Math.random() * 85 + 50, bacteriaVal * 1000, 0, 2 * Math.PI)
  ctx.arc(Math.random() * 290 + 30, Math.random() * 85 + 50, virusVal * 1000, 0, 2 * Math.PI)
  ctx.fill()
  
  if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
      (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
    if (cellsVal < CELL_MIN) {
      healthVal -= .3 * cellsVal
    }
    
    if (pressureVal >= PRESSURE_MAX) {
      healthVal -= .6 * cellsVal
    }
    
    if (pressureVal < 0.0) {
      healthVal = 0
    } else {
      healthVal--
    }
  } 
  
  if ((pressureVal >= PRESSURE_MIN && pressureVal < PRESSURE_MAX) &&
      (cellsVal > CELL_MIN && cellsVal < CELL_MAX)) {
    healthVal++
  }
  
  health.textContent = healthVal
  ttlVal++
  
  if (healthVal < 1) {
    health.textContent = 'DEAD.'
  } else {
    ttl.textContent = ttlVal
    requestAnimationFrame(render)
    //ctx.clearRect(0, 0, ctx.width, ctx.height)
  }

}

render()