import { Stage, Layer, Group, Text } from 'react-konva'
import { PieceName, Position, Positions } from './types'

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

interface GameProps {
  // tiles: GridStore
  // initialPieces:  Map<PieceName, PieceData>
  // initialPositions: Positions
  // dispatch: SelectionDispatch
}

interface DebugProps {
  positions: Positions
}

export function buildLayoutText(positions: Positions): string {
  const lines = []
  for (let [piece, { x, y, r }] of positions) {
    lines.push(`${piece} @ ${x}, ${y} (${r})`)
  }
  return lines.join("\n")
}

function Debug(): JSX.Element {
  const layoutText = buildLayoutText(unsolved)

  return (
    <>
      <Text fontFamily='Courier' text={layoutText} />
    </>
  )
}

function Game(): JSX.Element {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Debug />
      </Layer>
    </Stage>
  )
}

function App(): JSX.Element {
  return (
    <Game />
  )
}

export default App