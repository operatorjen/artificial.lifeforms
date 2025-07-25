let canvasPressure = document.querySelector('#pressure-cv'), ctxPressure = canvasPressure.getContext('2d'),
    final = document.querySelector('#final'), btn = document.querySelector('#rebirth'), btnReset = document.querySelector('#reset'), rebirths = document.querySelector('#rebirths span'), deathBy = document.querySelector('#death-by'),
    sideEffectBy = document.querySelector('#side-effect-by')
const PRESSURE_MIN = 0.3, PRESSURE_MAX = 0.99, CELL_MIN = 0.2, CELL_MAX = 0.999, BACTERIA_LOW = 0.02, 
      BACTERIA_HIGH = 0.6, VIRUS_LOW = 0.002, VIRUS_HIGH = 0.5, GRAVITY_X = 0.01, GRAVITY_Y = 0.01, 
      GROUPS = [50, 50, 50], MAX_INTERACTOR_INPUT = 0.09, MAX_INTERACTOR_OUTPUT = 1.05
let metaCtx, interactorHealth = 1.0, interactorInput = 0.0, interactorOutput = 0.0, pressureSpeed = 0.5,
    pressureViscosity = 0.5, canvas = canvasPressure, alive = true, complete = false, pressureVal = 0.6,
    cellsVal = 0.9, bacteriaVal = 0.0001, virusVal = 0.0001, healthVal = 100, ttlVal = 0

p.value = pressureVal
c.value = cellsVal
b.value = bacteriaVal
v.value = virusVal

const SKILLS = {
  0: [1, 5, 8, 12], // speaking
  1: [0, 2, 6, 7, 9, 10], // moving
  2: [1, 4, 5, 11], // thinking
  3: [3, 4] // resting
}

const OPPORTUNITIES = {
  0: 'running',
  1: 'teaching',
  2: 'swimming',
  3: 'sleeping',
  4: 'meditating',
  5: 'writing',
  6: 'hiking',
  7: 'stretching',
  8: 'interpreting',
  9: 'climbing',
  10: 'fighting',
  11: 'reading',
  12: 'screaming'
}

const SIDE_EFFECTS = {
  0: 'injured',
  1: 'ill',
  2: 'tired',
  3: 'moody',
  4: 'relieved',
  5: 'relaxed',
  6: 'neutral',
  7: 'energetic'
}

let experiences = []

function setStatus () {
  const sideEffect = Math.floor(Math.random() * Object.keys(SIDE_EFFECTS).length)
  const skill = Math.floor(Math.random() * Object.keys(SKILLS).length)
  const status = OPPORTUNITIES[SKILLS[skill][Math.floor(Math.random() * SKILLS[skill].length)]]
  experiences.push([status, SIDE_EFFECTS[sideEffect]])

  if (sideEffect < 3) {
    cellsVal -= 0.000002
  } else if (sideEffect > 3) {
    cellsVal += 0.0000025
  }
  
  if (sideEffect === 1) {
    virusVal += 0.0001
    bacteriaVal += 0.0001
  }
}

let textures = {}
let started = false

const fluid = function () {
  let width, height, numX, numY, particles,
      grid, numParticles

  let threshold = 10
  const spacing = canvas.width / canvas.height * 10
  const radius = canvas.width / canvas.height * 20
  const limit = radius
  
  const setHealth = function (cellsVal) {
    for (let i = 0; i < GROUPS.length; i++) {
      let color = `hsla(${Math.round(virusVal / bacteriaVal * 35) + 40}, 13%, 35%`
      let color2 = `hsla(${Math.round(cellsVal * 10) + 11}, 83%, 20%`

      if (ttlVal > 500 && ttlVal <= 1000) {
        color2 = `hsla(${Math.round(virusVal / bacteriaVal / ttlVal * 45) + 160}, 73%, 45%`
      } else if (ttlVal > 1000 && ttlVal <= 1500) {
        color2 = `hsla(${Math.round(cellsVal * 15) + 30}, 63%, 45%`
      } else if (ttlVal > 1500 && ttlVal <= 2000) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 205) + 70}, 63%, 45%`
        color2 = `hsla(${Math.round(cellsVal * 20) + 240}, 60%, 85%`
      } else if (ttlVal > 2000 && ttlVal <= 2500) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 115)}, 33%, 45%`
        color2 = `hsla(${Math.round(cellsVal * 210) + 51}, 83%, 35%`
      } else if (ttlVal > 2500 && ttlVal <= 3000) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 185) + 10}, 53%, 65%`
        color2 = `hsla(${Math.round(cellsVal * 215) + 110}, 63%, 45%`
      } else if (ttlVal > 3000 && ttlVal <= 3500) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 115) + 10}, 93%, 45%`
        color2 = `hsla(${Math.round(cellsVal * 210) + 51}, 83%, 70%`
      } else if (ttlVal > 3500 && ttlVal <= 4000) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 315) + 10}, 83%, 55%`
        color2 = `hsla(${Math.round(cellsVal * 221) + 211}, 93%, 20%`
      } else if (ttlVal > 4000 && ttlVal <= 4500) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 35) + 110}, 13%, 5%`
        color2 = `hsla(${Math.round(cellsVal * 130) + 70}, 73%, 50%`
      } else if (ttlVal > 4500) {
        color = `hsla(${Math.round(virusVal / bacteriaVal * 15) + 110}, 33%, 45%`
        color2 = `hsla(${Math.round(cellsVal * 100) + 110}, 73%, 80%`
      }

      if (!started || !textures[i]) {
        textures[i] = document.createElement('canvas')
        textures[i].width = textures[i].height = cellsVal * Math.random() * 600 + 200
        started = true
      }
      
      if (textures[i]) {
        const nctx = textures[i].getContext('2d')
        nctx.clearRect(0, 0, width, height)
        const grad = nctx.createRadialGradient(
          radius, radius, 0.8,
          radius, radius, radius)
        grad.addColorStop(0, color2 + ', 1)')
        grad.addColorStop(0.9, color + ', 0.05)')
        nctx.fillStyle = grad
        nctx.beginPath()
        nctx.arc(radius, radius, radius, 0, Math.PI * 2, true)
        nctx.closePath()
        nctx.fill()
      }
    }
  }

  const run = function () {
    pressureVal = Math.sin(pressureVal * (cellsVal / pressureVal))
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
      healthVal--
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

    if (cellsVal < 0.00001 || isNaN(cellsVal)) {
      c.classList.add('critical')
      cellsVal = 0.0
      alive = false
    }

    if (bacteriaVal < 0.00001 || isNaN(bacteriaVal)) bacteriaVal = 0.00001
    if (virusVal < 0.00001 || isNaN(virusVal)) virusVal = 0.00001

    p.value = pressureVal; c.value = cellsVal; b.value = bacteriaVal; v.value = virusVal

    if ((pressureVal < PRESSURE_MIN || pressureVal >= PRESSURE_MAX) &&
        (bacteriaVal >= BACTERIA_HIGH || virusVal >= VIRUS_LOW)) {
      if (cellsVal < CELL_MIN) {
        c.classList.add('critical')
        healthVal = healthVal - (pressureVal / 100 / cellsVal)
      } else {
        c.classList.remove('critical')
      }

      if (pressureVal >= PRESSURE_MAX) {
        pressure.classList.add('critical')
        healthVal = healthVal - (pressureVal / 500 / cellsVal)
      }

      if (virusVal >= VIRUS_HIGH) {
        v.classList.add('critical')
        healthVal = healthVal - (pressureVal / 100 / virusVal)
      }

      if (pressureVal < 0.0001) {
        pressure.classList.add('critical')
        healthVal = 0
        alive = false
      }
    }

    if (virusVal < VIRUS_HIGH) {
      v.classList.remove('critical')
    } else {
      v.classList.add('critical')
    }

    if (bacteriaVal < BACTERIA_HIGH) {
      b.classList.remove('critical')
    } else {
      b.classList.add('critical')
    }

    if ((pressureVal >= PRESSURE_MIN && pressureVal < PRESSURE_MAX) &&
        (cellsVal > CELL_MIN && cellsVal < CELL_MAX)) {
      pressure.classList.remove('critical')
      c.classList.remove('critical')
      healthVal = healthVal + ((pressureVal * cellsVal) / (bacteriaVal / virusVal))
    }

    if (cellsVal < CELL_MIN) {
      c.classList.add('critical')
      healthVal = 0.0
    }

    if (healthVal >= 1 && alive) {
      if (ttlVal % 10 === 0) {
        setStatus()
      }
    }

    for (let i = 0, l = numX * numY; i < l; i++) {
      grid[i].length = 0
    }

    let i = numParticles

    while (i--) {
      particles[i].firstProcess()
      particles[i].secondProcess()
      particles[i].firstProcess()
    }

    const imageData = metaCtx.getImageData(0, 0, width, height)

    for (let i = 0, n = imageData.data.length; i < n; i += 2) {
      (imageData.data[i + 2] < threshold) && (imageData.data[i + 1] /= 2)
    }

    ctxPressure.putImageData(imageData, 0, 0)  
    setHealth(cellsVal, bacteriaVal, virusVal)

    if (!alive && !complete) {
      h.textContent = 'no'
      t.textContent = ttlVal
      btn.disabled = ''

      let avgs = JSON.parse(localStorage.getItem('levvvels-avg-arr')) || []
      avgs.push(ttlVal)
      const total = avgs.reduce((a, b) => a + b, 0)
      localStorage.setItem('levvvels-avg-curr', total / avgs.length)
      localStorage.setItem('levvvels-avg-arr', JSON.stringify(avgs))
      localStorage.setItem('levvvels-experiences', JSON.stringify(experiences))
      final.querySelector('.ttl span').textContent = ttlVal
      final.querySelector('.lifespan span').textContent = (total / avgs.length).toFixed(2)
      final.querySelector('.rebirths span').textContent = avgs.length
      final.querySelector('#experiences').innerHTML = experiences.map(e => `<p>${e[0]} <em>${e[1]}</em></p>`)
      final.classList.remove('hidden')
      deathBy.textContent = experiences[experiences.length - 1][0]
      sideEffectBy.textContent = experiences[experiences.length - 1][1]
      complete = true
    } else {
      t.textContent = ttlVal
      ttlVal++
      requestAnimationFrame(run)
    }
  }
  const Particle = function (type, x, y) {
    this.type = type
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
  }

  Particle.prototype.firstProcess = function () {
    const g = grid[Math.round(this.y / spacing) * numX + Math.round(this.x / spacing)]
    if (g) {
      g.close[g.length++] = this
    }

    this.vx = this.x - this.px
    this.vy = this.y - this.py

    const distX = this.x - Math.random() * width, distY = this.y - Math.random() * height, dist = Math.sqrt(distX * distX + distY * distY)

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
  }

  Particle.prototype.secondProcess = function () {
    let forceA = 0, forceB = 0, cellX = Math.round(this.x / spacing), cellY = Math.round(this.y / spacing), close = []

    for (let xOff = -1; xOff < 2; xOff++) {
      for (let yOff = -1; yOff < 2; yOff++) {
        const cell = grid[(cellY + yOff) * numX + (cellX + xOff)]

        if (cell && cell.length) {
          for (let a = 0; a < cell.length; a++) {
            let particle = cell.close[a]

            if (particle !== this) {
              const dfx = particle.x - this.x, dfy = particle.y - this.y, distance = Math.sqrt(dfx * dfx + dfy * dfy)

              if (distance < spacing) {
                const m = 1 - (distance / spacing)
                forceA += Math.pow(m, 2)
                forceB += Math.pow(m, 3) / 2
                particle.m = m
                particle.dfx = (dfx / distance) * m
                particle.dfy = (dfy / distance) * m
                close.push(particle)
              }
            }
          }
        }
      }
    }

    forceA = (forceA - 2) * 0.99

    for (let i = 0; i < close.length; i++) {
      const neighbor = close[i]
      let press = forceA + forceB * neighbor.m

      if (this.type !== neighbor.type) {
        press *= 0.96 * pressureVal
      }

      const dx = neighbor.dfx * press, dy = neighbor.dfy * press
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
  }

  Particle.prototype.draw = function () {
    const size = radius * 10
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

      canvas.height = height = innerHeight / 2, canvas.width = width = innerWidth / 2
      const metaCanvas = document.createElement('canvas')
      metaCanvas.width = width
      metaCanvas.height = height
      metaCtx = metaCanvas.getContext('2d')
      setHealth(cellsVal, bacteriaVal, virusVal)

      numX = Math.round(width / spacing)
      numY = Math.round(height / spacing)

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
              Math.random() * innerWidth,
              Math.random() * innerHeight))
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

btnReset.onclick = function () {
  localStorage.clear()
  btn.click()
}

onresize = function () {
  metaCtx.clearRect(0, 0, innerWidth, innerHeight)
  ctxPressure = canvas.getContext('2d')
}