const pressure = document.querySelector('#pressure span')
const cells = document.querySelector('#cells span')
const bacteria = document.querySelector('#bacteria span')
const virus = document.querySelector('#virus span')

let pressureVal = 0.4 
let cellsVal = 0.90
let bacteriaVal = 0.001
let virusVal = 0.001

const PRESSURE_MIN = 0.011
const PRESSURE_MAX = 0.999
const CELL_MIN = 0.30
const CELL_MAX = 1.00
const BACTERIA_LOW = 0.2
const BACTERIA_HIGH = 0.6
const VIRUS_LOW = 0.1
const VIRUS_HIGH = 0.5

function render() {
  pressureVal = (cellsVal / pressureVal) * pressureVal
  let cellsRandom = Math.random() * cellsRandom
  cellsVal = cellsVal + (cellsRandom * (bacteriaVal / virusVal))
  
  const bacteriaRandom = Math.random()
  if (bacteriaRandom > BACTERIA_LOW && bacteriaRandom < BACTERIA_HIGH) {
    bacteriaVal = bacteriaVal + (bacteriaVal / (1 / bacteriaRandom * 100))
  } else if (bacteriaRandom >= BACTERIA_HIGH)  {
    bacteriaVal = bacteriaVal + (bacteriaVal / (1 / bacteriaRandom * 50))
  }
  
  const virusRandom = Math.random()
  if (bacteriaRandom >= BACTERIA_HIGH) {
    
  } else {
    virusVal = virusVal + (virusVal / (bacteriaRandom * cellsVal))
  }
  
  pressure.textContent = pressureVal
  cells.textContent = cellsVal
  bacteria.textContent = bacteriaVal
  virus.textContent = virusVal
  
  
  
  requestAnimationFrame(render)
}

render()