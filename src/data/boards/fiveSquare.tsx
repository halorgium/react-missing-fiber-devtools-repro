import { GridStore } from '../../GridMap'
import { BoardData, GameName, PieceName, Position, Positions } from '../../types'
import { parsePositions } from './parsePositions'

const dec30 = parsePositions(`
red    @ 0, 0 (3)
green  @ 0, 3 (2)
yellow @ 3, 1 (0)
orange @ 3, 3 (0)
blue   @ 0, 1 (3)
pink   @ 2, 0 (1)
`)

const dec30b = parsePositions(`
red    @ 2, 3 (1)
green  @ 2, 0 (0)
yellow @ 0, 1 (2)
orange @ 0, 0 (2)
blue   @ 3, 1 (1)
pink   @ 0, 2 (3)
`)

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
  ['2021-12-30', dec30],
  ['2021-12-30b', dec30b],
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