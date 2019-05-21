const pressure = document.querySelector('#pressure span')
const cells = document.querySelector('#cells span')
const bacteria = document.querySelector('#bacteria span')
const virus = document.querySelector('#virus span')
const health = document.querySelector('#health')
const ttl = document.querySelector('time')

let pressureVal = 0.9 
let cellsVal = 0.9
let bacteriaVal = 0.01
let virusVal = 0.001
let healthVal = 10
let ttlVal = 0

const PRESSURE_MIN = 0.3
const PRESSURE_MAX = 0.99
const CELL_MIN = 0.20
const CELL_MAX = 1.00
const BACTERIA_LOW = 0.2
const BACTERIA_HIGH = 0.6
const VIRUS_LOW = 0.002
const VIRUS_HIGH = 0.05

function render() {
  pressureVal = Math.cos(pressureVal * (cellsVal / pressureVal))
  let cellsRandom = Math.random() * cellsVal
  cellsVal = Math.cos(cellsVal - (bacteriaVal / virusVal) * cellsVal * pressureVal)
  
  const bacteriaRandom = Math.random()
  if (bacteriaRandom > BACTERIA_LOW && bacteriaRandom < BACTERIA_HIGH) {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 1500)))
  } else if (bacteriaRandom >= BACTERIA_HIGH)  {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 1000)))
  }
  
  const virusRandom = Math.random()
  if (bacteriaRandom >= BACTERIA_HIGH) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 1000)))
  } else if (bacteriaRandom > BACTERIA_LOW) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 1500)))
  } else {
    virusVal = Math.sin(virusVal - (virusVal / (bacteriaRandom * cellsVal * 2500)))
  }
  
  if (pressureVal < 0.0 || isNaN(pressureVal)) {
    pressureVal = 0.0
  }
  
  if (cellsVal < 0.0 || isNaN(cellsVal)) {
    cellsVal = 0.0
  }
  
  if (bacteriaVal < 0.0 || isNaN(bacteriaVal)) {
    bacteriaVal = 0.0
  }
  
  if (virusVal < 0.0 || isNaN(virusVal)) {
    virusVal = 0.0
  }
  
  pressure.textContent = pressureVal
  cells.textContent = cellsVal
  bacteria.textContent = bacteriaVal
  virus.textContent = virusVal
  
  if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
      (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
    if (cellsVal < CELL_MIN) {
      healthVal -= .2 * cellsVal
    }
    
    if (pressureVal >= PRESSURE_MAX) {
      healthVal -= .3 * cellsVal
    }
    
    healthVal--
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
  }

}

render()