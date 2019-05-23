const SKILLS = {
  0: [1, 5, 8], // speaking
  1: [0, 2, 6, 7, 9], // moving
  2: [1, 4, 5], // thinking
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
  9: 'climbing'
}

let experiences = localStorage.getItem('levvvels-experiences') && JSON.parse(localStorage.getItem('levvvels-experiences')) || []

const setStatus = function () {
  const skill = Math.floor(Math.random() * Object.keys(SKILLS).length + 1)
  console.log('skill', skill)
  const status = OPPORTUNITIES[SKILLS[Math.floor(Math.random() * SKILLS[this.skill].length) + 1]]
  console.log('status', status)
  experiences.push(status)
  localStorage.setItem('levvvels-experiences', JSON.stringify(experiences))
}