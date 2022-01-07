import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import SelectedGame from "./SelectedGame"

import { Stage, Layer, Group, Text } from 'react-konva'

import Piece from './Piece'
import Board from './Board'
import useBoardState from './useBoardState'
import { GridStore } from './GridMap'
import { PieceData, PieceName, Positions } from './types'
import { SelectionActionType, SelectionDispatch } from './useSelectionReducer'
import { useEffect } from 'react'

import debug from './data/boards/debug'

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

function Debug({ positions }: DebugProps): JSX.Element {
  const layoutText = buildLayoutText(positions)

  return (
    <>
      <Text fontFamily='Courier' text={layoutText} />
    </>
  )
}

function Game(): JSX.Element {
  // const size = 30
  // const margin = 15

  // const board = useBoardState(tiles, initialPieces, initialPositions)

  // useEffect(() => {
  //   dispatch({
  //     type: SelectionActionType.savePositions,
  //     positions: board.positions,
  //   })
  // }, [dispatch, board.positions])

  const positions = debug.positions.get('unsolved')

  if (positions === undefined) {
    throw new Error("nope")
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* <Group x={130} y={130}>
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
        </Group> */}
        <Group x={500} y={40}>
          <Debug positions={positions} />
          {/* <Group y={250}>
            <Board tiles={tiles} size={20} margin={5} border={1} hits={board.hits} />
          </Group> */}
        </Group>
      </Layer>
    </Stage>
  )
}

function App(): JSX.Element {
  return (
    <Game />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/:board/:game" element={<SelectedGame />} />
    //     <Route path="/:board" element={<SelectedGame />} />
    //     <Route path="/" element={<SelectedGame />} />
    //     <Route path="*" element={<Navigate to="/" replace={true} />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

export default App