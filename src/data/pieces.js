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

// 1x1
pieces.set('red1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: '#DE453D'
})
pieces.set('green1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: '#B8F570'
})
pieces.set('yellow1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: 'yellow'
})
pieces.set('orange1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: 'orange'
})
pieces.set('blue1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: 'blue'
})
pieces.set('pink1', {
  tiles: [
    { x: 0, y: 0 },
  ],
  fill: 'pink'
})

export default pieces