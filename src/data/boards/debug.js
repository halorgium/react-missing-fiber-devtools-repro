import GridMap from '../../GridMap'

const unsolved = new Map()
unsolved.set('red1', {
  x: 2,
  y: -1,
  r: 0,
})
unsolved.set('green1', {
  x: -1,
  y: -1,
  r: 0,
})
unsolved.set('yellow1', {
  x: 2,
  y: 2,
  r: 0,
})
unsolved.set('blue1', {
  x: -1,
  y: 2,
  r: 0,
})

const positions = new Map([
  ['unsolved', unsolved],
])

const width = 2
const height = 2
const tiles = new GridMap()
for (let x = 0; x < width; ++x) {
  for (let y = 0; y < height; ++y) {
    tiles.set(x, y, null)
  }
}

const board = { tiles, positions }

export default board