const pieces = new Map()
pieces.set('red', {
  position: {
    x: 0,
    y: 0,
  },
  coords: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  fill: '#DE453D'
})
pieces.set('green', {
  position: {
    x: 1,
    y: 0,
  },
  coords: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 0 },
  ],
  fill: '#B8F570'
})
pieces.set('yellow', {
  position: {
    x: 3,
    y: 0,
  },
    coords: [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
  ],
  fill: 'yellow'
})
pieces.set('orange', {
  position: {
    x: 0,
    y: 3,
  },
  coords: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  fill: 'orange'
})
pieces.set('blue', {
  position: {
    x: 1,
    y: 3,
  },
  coords: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  fill: 'blue'
})
pieces.set('pink', {
  position: {
    x: 2,
    y: 2,
  },
  coords: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
  ],
  fill: 'pink'
})

export default pieces