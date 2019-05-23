let pressure = document.querySelector('#pressure input')
let cells = document.querySelector('#cells input')
let bacteria = document.querySelector('#bacteria input')
let virus = document.querySelector('#virus input')
const health = document.querySelector('#health span')
const ttl = document.querySelector('#time span')
const avgInfo = document.querySelector('#avg span')
const canvasPressure = document.querySelector('#pressure-cv')
const ctxPressure = canvasPressure.getContext('2d')
ctxPressure.width = canvasPressure.width = 500
ctxPressure.height = canvasPressure.height = 300

let btn = document.querySelector('button')
const rebirths = document.querySelector('#rebirths span')

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

rebirths.textContent = localStorage.getItem('levvvels-avg-arr') && 
  JSON.parse(localStorage.getItem('levvvels-avg-arr')).length || 0

const PRESSURE_MIN = 0.3
const PRESSURE_MAX = 0.99
const CELL_MIN = 0.2
const CELL_MAX = 0.999
const BACTERIA_LOW = 0.02
const BACTERIA_HIGH = 0.6
const VIRUS_LOW = 0.002
const VIRUS_HIGH = 0.5

const GRAVITY_X = 0.0
const GRAVITY_Y = 0.0
const GROUPS = [100, 100, 150]
let metaCtx
let interactorHealth = 1.0
let interactorInput = 0.0
let interactorOutput = 0.0
let pressureSpeed = 0.05
let pressureViscosity = 2.5
const MAX_INTERACTOR_INPUT = 0.09
const MAX_INTERACTOR_OUTPUT = 1.05
let canvas = canvasPressure
let alive = true
let complete = false

let height = window.innerHeight / 2
let width = window.innerWidth / 2

const fluid = function () {  
  let numX, numY, particles, 
      grid, textures, numParticles

  const threshold = 100
  const spacing = 5
  const radius = 10
  const limit = radius 

  const run = function () {
    metaCtx.clearRect(0, 0, width, height)
    
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
      pressure.classList.add('critical')
      pressureVal = 0.0
      alive = false
    }

    if (cellsVal < 0.000001 || isNaN(cellsVal)) {
      cells.classList.add('critical')
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

    if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
        (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
      if (cellsVal < CELL_MIN) {
        cells.classList.add('critical')
        healthVal = healthVal - (pressureVal / 100 / cellsVal)
      }

      if (pressureVal >= PRESSURE_MAX) {
        pressure.classList.add('critical')
        healthVal = healthVal - (pressureVal / 500 / cellsVal)
      }

      if (virusVal >= VIRUS_HIGH) {
        virus.classList.add('critical')
        healthVal = healthVal - (pressureVal / 100 / virusVal)
      }

      if (pressureVal < 0.0001) {
        pressure.classList.add('critical')
        healthVal = 0
        alive = false
      }
    }

    if (virusVal < VIRUS_HIGH) {
      virus.classList.remove('critical')
    } else {
      virus.classList.add('critical')
    }

    if (bacteriaVal < BACTERIA_HIGH) {
      bacteria.classList.remove('critical')
    } else {
      bacteria.classList.add('critical')
    }

    if ((pressureVal >= PRESSURE_MIN && pressureVal < PRESSURE_MAX) &&
        (cellsVal > CELL_MIN && cellsVal < CELL_MAX)) {
      pressure.classList.remove('critical')
      cells.classList.remove('critical')
      healthVal = healthVal + ((pressureVal * cellsVal) / (bacteriaVal / virusVal))
    }

    if (healthVal >= 1 && alive) {
      ttl.textContent = ttlVal
      ttlVal++
    }

    for (let i = 0, l = numX * numY; i < l; i++) {
      grid[i].length = 0
    }

    let i = numParticles

    while (i--) {
      particles[i].first_process()
    }

    i = numParticles

    while (i--) {
      particles[i].second_process()
    }

    i = numParticles

    while (i--) {
      particles[i].first_process()
    }

    const imageData = metaCtx.getImageData(0, 0, width, height)

    for (let i = 0, n = imageData.data.length; i < n; i += 2) {
      (imageData.data[i + 4] < threshold) && (imageData.data[i + 2] /= 2)
    }

    ctxPressure.putImageData(imageData, 0, 0)
    
    if (!alive) {
      cellsVal = 0.0
      pressureVal = 0.0
      
      if (!complete) {
        health.textContent = 'no'
        ttl.textContent = ttlVal
        btn.disabled = ''
        
        let avgs = JSON.parse(localStorage.getItem('levvvels-avg-arr')) || []
        avgs.push(ttlVal)
        const total = avgs.reduce((a, b) => a + b, 0)
        localStorage.setItem('levvvels-avg-curr', total / avgs.length)
        localStorage.setItem('levvvels-avg-arr', JSON.stringify(avgs))
        avgInfo.textContent = (total / avgs.length).toFixed(5)
        complete = true
      }
    }
    
    requestAnimationFrame(run)
  };

  const Particle = function (type, x, y) {
    this.type = type
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
  };

  Particle.prototype.first_process = function () {
    const g = grid[Math.round(this.y / spacing) * numX + Math.round(this.x / spacing)]
    if (g) {
      g.close[g.length++] = this
    }

    this.vx = this.x - this.px
    this.vy = this.y - this.py

    const distX = this.x * window.innerWidth
    const distY = this.y * window.innerHeight
    const dist = Math.sqrt(distX * distX + distY * distY)

    if (dist < radius) {
        const cos = distX / dist
        const sin = distY / dist

        this.vx += -cos
        this.vy += -sin
    }

    this.vx += GRAVITY_X
    this.vy += GRAVITY_Y
    this.px = this.x
    this.py = this.y
    this.x += this.vx
    this.y += this.vy
  };

  Particle.prototype.second_process = function () {
    let forceA = 0
    let forceB = 0
    let cellX = Math.round(this.x / spacing)
    let cellY = Math.round(this.y / spacing)
    let close = []

    for (let xOff = -1; xOff < 3; xOff++) {
      for (let yOff = -1; yOff < 3; yOff++) {
        const cell = grid[(cellY + yOff) * numX + (cellX + xOff)]

        if (cell && cell.length) {
          for (let a = 0; a < cell.length; a++) {
            let particle = cell.close[a]

            if (particle !== this) {
              const dfx = particle.x - this.x
              const dfy = particle.y - this.y
              const distance = Math.sqrt(dfx * dfx + dfy * dfy)

              if (distance < spacing) {
                const m = 1 - (distance / spacing)
                forceA += Math.pow(m, 3)
                forceB += Math.pow(m, 3) / 2
                particle.m = m
                particle.dfx = (dfx / distance) * m
                particle.dfy = (dfy / distance) * m
                particle.input = particle.dfx // / particle.dfy
                particle.output = particle.dfy // / particle.dfx
                //console.log(particle.input, particle.output)
                close.push(particle)
              }
            }
          }
        }
      }
    }

    forceA = (forceA - 2) * 0.6

    for (let i = 0; i < close.length; i++) {
      const neighbor = close[i]
      let press = forceA + forceB * neighbor.m

      if (this.type !== neighbor.type) {
        press *= 0.6
      }

      const dx = neighbor.dfx * press
      const dy = neighbor.dfy * press

      neighbor.x += dx
      neighbor.y += dy
      this.x -= dx
      this.y -= dy
    }

    if (this.x < limit) {
      this.x = limit
    } else if (this.x > width - limit) {
      this.x = width - limit
    }

    if (this.y < limit) {
      this.y = limit
    } else if (this.y > height - limit) {
      this.y = height - limit
    }

    this.draw()
  };

  Particle.prototype.draw = function () {
    const size = radius * cellsVal * 300

    metaCtx.drawImage(
      textures[this.type],
      this.x - radius,
      this.y - radius,
      size, size)
  }

  return {
    init: function () {
      particles = []
      grid = []
      close = []
      textures = []

      canvas.height = height = window.innerHeight / 2
      canvas.width = width = window.innerWidth / 2

      const metaCanvas = document.createElement('canvas')
      metaCanvas.width = width
      metaCanvas.height = height
      metaCtx = metaCanvas.getContext('2d')

      for (let i = 0; i < GROUPS.length; i++) {
        let color = 'hsla(331, 100%, 64%';
        let color2 = 'hsla(57, 75%, 64%';
        
        if (virusVal >= VIRUS_HIGH) {
          color2 = 'hsla(157, 75%, 64%';
        } else if (bacteriaVal >= BACTERIA_HIGH) {
          color2 = 'hsla(84, 86%, 42%';
        } else if (cellsVal > CELL_MIN) {
          color = 'hsla(338, 100%, 55%';
        } else if (cellsVal < CELL_MAX) {
          color = 'hsla(157, 100%, 44%';
        }

        textures[i] = document.createElement('canvas')
        textures[i].width = textures[i].height = radius * 50

        const nctx = textures[i].getContext('2d')

        const grad = nctx.createRadialGradient(
          radius, radius, 1,
          radius, radius, radius)
        grad.addColorStop(0, color + ', 0.8)')
        grad.addColorStop(1, color2 + ', 0)')
        nctx.fillStyle = grad
        nctx.beginPath()
        nctx.arc(radius, radius, radius, 0, Math.PI * 2, true)
        nctx.closePath()
        nctx.fill()
      }

      numX = Math.round(width / spacing) + 5
      numY = Math.round(height / spacing) + 1

      for (let i = 0; i < numX * numY; i++) {
        grid[i] = {
          length: 0,
          close: []
        }
      }

      for (let i = 0; i < GROUPS.length; i++) {
        for (let k = 0; k < GROUPS[i]; k++) {
          particles.push(
            new Particle(
              i,
              radius + Math.random() * (width - radius * 3),
              radius + Math.random() * (height - radius * 3)))
        }
      }

      numParticles = particles.length
      run()
    }
  } 
}()

fluid.init()

btn.onclick = function () {
  document.location.reload()
}