const pieces = new Map()
pieces.set('red', {
  tiles: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  fill: '#DE453D'
})
pieces.set('green', {
  tiles: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 0 },
  ],
  fill: '#B8F570'
})
pieces.set('yellow', {
  tiles: [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
  ],
  fill: 'yellow'
})
pieces.set('orange', {
  tiles: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  fill: 'orange'
})
pieces.set('blue', {
  tiles: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  fill: 'blue'
})
pieces.set('pink', {
  tiles: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
  ],
  fill: 'pink'
})

const online = new Map()
online.set('red', {
  x: 0,
  y: 0,
})
online.set('green', {
  x: 1,
  y: 0,
})
online.set('yellow', {
  x: 3,
  y: 0,
})
online.set('orange', {
  x: 0,
  y: 3,
})
online.set('blue', {
  x: 1,
  y: 3,
})
online.set('pink', {
  x: 2,
  y: 2,
})

const positions = {
  online
}

export { positions }
export default pieces