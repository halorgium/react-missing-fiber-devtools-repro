
import { Stage, Layer, Group } from 'react-konva'

import Piece from './Piece'
import Board from './Board'
import Debug from './Debug'
import useBoardState from './useBoardState'
import { GridStore } from './GridMap'
import { PieceData, PieceName, Positions } from './types'

interface GameProps {
  tiles: GridStore
  initialPieces:  Map<PieceName, PieceData>
  initialPositions: Positions
}

function Game({ tiles, initialPieces, initialPositions }: GameProps): JSX.Element {
  const size = 30
  const margin = 15

  const board = useBoardState(tiles, initialPieces, initialPositions)

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Group x={130} y={130}>
          <Board tiles={tiles} size={size} margin={margin} hits={undefined} border={0}>
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
          <Debug positions={board.positions} />
          <Group y={250}>
            <Board tiles={tiles} size={20} margin={5} border={1} hits={board.hits} />
          </Group>
        </Group>
      </Layer>
    </Stage>
  )
}

export default Game