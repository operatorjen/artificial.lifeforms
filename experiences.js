const skills = {
  speaking: [1, 5, 8],
  moving: [0, 2, 6, 7, 9],
  thinking: [1, 4, 5],
  resting: [3, 4]
}

const opportunities = {
  0: 'running',
  1: 'teaching',
  2: 'swimming',
  3: 'sleeping',
  4: 'meditating',
  5: 'writing',
  6: 'hiking',
  7: 'stretching',
  8: 'interpreting',
  9: 'climbing'
}

const updateStatus = function () {

  if (!this.status) {
    // start journey
    this.status = Math.floor(Math.random() * 10)
    console.log(this.status)
  } else {
    
  }
}