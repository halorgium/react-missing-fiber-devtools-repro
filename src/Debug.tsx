import { Text } from 'react-konva'
import { Positions } from './types'

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

function Debug({ positions }: DebugProps): JSX.Element {
  const layoutText = buildLayoutText(positions)

  return (
    <>
      <Text fontFamily='Courier' text={layoutText} />
    </>
  )
}

export default Debug