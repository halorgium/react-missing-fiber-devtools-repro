
import { useState, useCallback } from 'react'
import { Stage, Layer, Group } from 'react-konva'

import Piece from './Piece'
import Board from './Board'
import Debug from './Debug'
import useBoardState from './useBoardState'

function Game({ tiles, initialPieces, initialPositions }) {
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
          <Board tiles={tiles} size={size} margin={margin}>
            <Group>
              {board.pieces.map(piece => {
                return <Piece
                  key={piece.key}
                  size={size}
                  margin={margin}
                  tiles={piece.tiles}
                  fill={piece.fill}
                  position={piece.position}
                  moveable={piece.moveable}
                  moveToFront={() => board.moveToFront(piece.key)}
                  reportRotation={() => board.reportRotation(piece.key)}
                  reportPosition={coord => board.reportPosition(piece.key, coord)}
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