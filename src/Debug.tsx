import { Text } from 'react-konva'
import { PiecePositions } from './types'

interface DebugProps {
  positions: PiecePositions
}

function Debug({ positions }: DebugProps): JSX.Element {
  const lines = []
  for (let [piece, { x, y, r }] of positions) {
    lines.push(`${piece} @ ${x}, ${y} (${r})`)
  }

  return (
    <>
      <Text fontFamily='Courier' text={lines.join("\n")} />
    </>
  )
}

export default Debug