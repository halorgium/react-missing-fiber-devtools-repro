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

const unsolved = new Map()
unsolved.set('red', {
  x: -2,
  y: 0,
})
unsolved.set('green', {
  x: -2,
  y: -2,
})
unsolved.set('yellow', {
  x: 4,
  y: 5,
})
unsolved.set('orange', {
  x: 5,
  y: 2,
})
unsolved.set('blue', {
  x: -2,
  y: 5,
})
unsolved.set('pink', {
  x: 4,
  y: -2,
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

const hack = new Map()
hack.set('red', {
  x: 0,
  y: 3,
  r: 1,
})
hack.set('green', {
  x: 0,
  y: 1,
  r: 1,
})
hack.set('yellow', {
  x: 0,
  y: 0,
  r: 1,
})
hack.set('orange', {
  x: 3,
  y: 3,
  r: 1,
})
hack.set('blue', {
  x: 3,
  y: 1,
  r: 1,
})
hack.set('pink', {
  x: 2,
  y: 0,
  r: 1,
})

const positions = {
  online,
  hack,
  unsolved,
}

export { positions }
export default pieces