import { GameName, PieceName, Position, Positions } from '../../types'

const unsolved = new Map<PieceName, Position>()
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

export default unsolved