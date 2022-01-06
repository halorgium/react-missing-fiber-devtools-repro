import { Rect, Text } from 'react-konva'
import { PieceName, PiecePositions, Position, Positions } from './types'
import { SelectionActionType, SelectionDispatch } from './useSelectionReducer'

interface DebugProps {
  positions: PiecePositions
  dispatch: SelectionDispatch
}

export function buildLayoutText(positions: Positions): string {
  const lines = []
  for (let [piece, { x, y, r }] of positions) {
    lines.push(`${piece} @ ${x}, ${y} (${r})`)
  }
  return lines.join("\n")
}

function Debug({ positions, dispatch }: DebugProps): JSX.Element {
  const map = new Map<PieceName, Position>();

  for (let [piece, { x, y, r }] of positions) {
    map.set(piece, { x, y, r })
  }

  const layoutText = buildLayoutText(map)

  function savePositions() {
    console.log("yup")
    dispatch({
      type: SelectionActionType.savePositions,
      positions: map,
    })
  }

  return (
    <>
      <Rect width={70} height={30} fill='red' onClick={savePositions} />
      <Text y={30} fontFamily='Courier' text={layoutText} />
    </>
  )
}

export default Debug