
import { useState, useCallback } from 'react'
import { Stage, Layer, Group } from 'react-konva'

import Piece from './Piece'
import Board from './Board'
import Debug from './Debug'
import useBoardState from './useBoardState'

interface GameProps {
  tiles: any
  initialPieces: any
  initialPositions: any
}

function Game({ tiles, initialPieces, initialPositions }: GameProps) {
  const size = 30
  const margin = 15

  // <Debug />
  const [counter, setCounter] = useState(0)
  const increment = useCallback(() => {
    setCounter(i => i + 1)
  }, [])
  // </Debug>

  const board = useBoardState(tiles, initialPieces, initialPositions)

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Group x={130} y={130}>
          <Board tiles={tiles} size={size} margin={margin} hits={null} border={0}>
            <Group>
              {board.pieces.map(piece => {
                return <Piece
                  key={piece.key}
                  size={size}
                  margin={margin}
                  tiles={piece.tiles}
                  fill={piece.fill}
                  x={piece.x}
                  y={piece.y}
                  moveable={piece.moveable}
                  moveToFront={piece.moveToFront}
                  reportRotation={piece.reportRotation}
                  reportPosition={piece.reportPosition}
                />
              })}
            </Group>
          </Board>
        </Group>
        <Group x={500} y={40}>
          <Debug increment={increment} counter={counter} statusReport={board.statusReport} />
          <Group y={250}>
            <Board tiles={tiles} size={20} margin={5} border={1} hits={board.hits} />
          </Group>
        </Group>
      </Layer>
    </Stage>
  )
}

export default Game