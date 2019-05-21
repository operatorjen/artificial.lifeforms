const pressure = document.querySelector('#pressure span')
const cells = document.querySelector('#cells span')
const bacteria = document.querySelector('#bacteria span')
const virus = document.querySelector('#virus span')
const health = document.querySelector('#health')

let pressureVal = 0.5 
let cellsVal = 0.90
let bacteriaVal = 0.001
let virusVal = 0.001
let healthVal = 0.0

const PRESSURE_MIN = 0.3
const PRESSURE_MAX = 0.99
const CELL_MIN = 0.20
const CELL_MAX = 1.00
const BACTERIA_LOW = 0.2
const BACTERIA_HIGH = 0.6
const VIRUS_LOW = 0.2
const VIRUS_HIGH = 0.5

function render() {
  pressureVal = Math.sin(pressureVal + (cellsVal / pressureVal))
  let cellsRandom = Math.random() * cellsVal
  cellsVal = Math.cos(cellsVal * (bacteriaVal / virusVal))
  
  const bacteriaRandom = Math.random()
  if (bacteriaRandom > BACTERIA_LOW && bacteriaRandom < BACTERIA_HIGH) {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 2000)))
  } else if (bacteriaRandom >= BACTERIA_HIGH)  {
    bacteriaVal = Math.sin(bacteriaVal + (bacteriaVal / (1 * bacteriaRandom * 1500)))
  }
  
  const virusRandom = Math.random()
  if (bacteriaRandom >= BACTERIA_HIGH) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 1000)))
  } else if (bacteriaRandom > BACTERIA_LOW) {
    virusVal = Math.sin(virusVal + (virusVal / (bacteriaRandom * cellsVal * 1500)))
  } else {
    virusVal = Math.sin(virusVal - (virusVal / (bacteriaRandom * cellsVal * 2500)))
  }
  
  pressure.textContent = pressureVal
  cells.textContent = cellsVal
  bacteria.textContent = bacteriaVal
  virus.textContent = virusVal
  
  if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
      (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
    healthVal--
  } 
  
  if ((pressureVal >= PRESSURE_MIN && pressureVal < PRESSURE_MAX) &&
      (cellsVal > CELL_MIN && cellsVal < CELL_MAX)) {
    healthVal++
  }
  
  health.textContent = healthVal
  
  requestAnimationFrame(render)
}

render()