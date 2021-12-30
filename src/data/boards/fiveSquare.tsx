import { GridStore } from '../../GridMap'
import { BoardData, GameName, PieceName, Position, Positions } from '../../types'

const unsolved = new Map<PieceName, Position>()
unsolved.set('red', {
  x: -2,
  y: 0,
  r: 0,
})
unsolved.set('green', {
  x: -2,
  y: -2,
  r: 0,
})
unsolved.set('yellow', {
  x: 4,
  y: 5,
  r: 0,
})
unsolved.set('orange', {
  x: 5,
  y: 2,
  r: 0,
})
unsolved.set('blue', {
  x: -2,
  y: 5,
  r: 0,
})
unsolved.set('pink', {
  x: 4,
  y: -2,
  r: 0,
})

const online = new Map<PieceName, Position>()
online.set('red', {
  x: 0,
  y: 0,
  r: 0,
})
online.set('green', {
  x: 1,
  y: 0,
  r: 0,
})
online.set('yellow', {
  x: 3,
  y: 0,
  r: 0,
})
online.set('orange', {
  x: 0,
  y: 3,
  r: 0,
})
online.set('blue', {
  x: 1,
  y: 3,
  r: 0,
})
online.set('pink', {
  x: 2,
  y: 2,
  r: 0,
})

const hack = new Map<PieceName, Position>()
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

const partialHack = new Map<PieceName, Position>(unsolved)
// partialHack.set('green', {
//   moveable: false,
//   ...hack.get('green'),
// })
// partialHack.set('orange', {
//   moveable: false,
//   ...hack.get('orange'),
// })

const positions = new Map<GameName, Positions>([
  ['online', online],
  ['hack', hack],
  ['partialHack', partialHack],
  ['unsolved', unsolved],
])

const width = 5
const height = 5
const tiles = new GridStore()
for (let x = 0; x < width; ++x) {
  for (let y = 0; y < height; ++y) {
    tiles.set(x, y)
  }
}

const board: BoardData = { tiles, positions }

export default board