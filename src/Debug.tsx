import { Rect, Text } from 'react-konva'
import { PiecePositions } from './types'

interface DebugProps {
  increment: () => void
  counter: number
  positions: PiecePositions
}

function Debug({ increment, counter, positions }: DebugProps): JSX.Element {
  const lines = []
  for (let [piece, { x, y, r }] of positions) {
    lines.push(`${piece} @ ${x}, ${y} (${r})`)
  }

  return (
    <>
      <Rect width={100} height={40} fill='grey' onClick={increment} />
      <Text x={10} y={10} text={counter.toString()} />
      <Text y={50} fontFamily='Courier' text={lines.join("\n")} />
    </>
  )
}

export default Debug