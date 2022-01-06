import { useParams, useNavigate, generatePath } from "react-router-dom"
import Game from './Game'
import allPieces from './data/pieces'
import allBoards from './data/boards'
import { BoardData, BoardName, GameName, PieceData, PieceName } from "./types"
import { useEffect } from "react"
import useSelectionReducer, { SelectionActionType, SelectionDispatch, SelectionState } from "./useSelectionReducer"
import Selector from "./Selector"

function useBoardAndGame(): [BoardName | null, GameName | null] {
  let { board, game } = useParams()

  console.log({ board, game })

  if (board === undefined) {
    return [null, null]
  }

  if (game === undefined) {
    return [board, null]
  }

  return [board, game]
}

function useSelection(pieces: Map<PieceName, PieceData>, boards: Map<BoardName, BoardData>): [SelectionState, SelectionDispatch] {
  const navigate = useNavigate()

  const [boardParam, layoutParam] = useBoardAndGame()

  const [state, dispatch] = useSelectionReducer(pieces, boards, boardParam, layoutParam)

  useEffect(() => {
    if (state.currentBoard === null) {
      navigate("/")
    } else if (state.currentLayout === null) {
      navigate(generatePath("/:board", { board: state.currentBoard }))
    } else {
      navigate(generatePath("/:board/:game", { board: state.currentBoard, game: state.currentLayout }))
    }
  }, [navigate, state.currentBoard, state.currentLayout])

  console.log(JSON.stringify(state))

  return [state, dispatch]
}

function SelectedGame(): JSX.Element {
  const [state, dispatch] = useSelection(allPieces, allBoards)

  return (
    <>
      {state.boardOptions && <Selector current={state.currentBoard} options={state.boardOptions} actionType={SelectionActionType.selectBoard} dispatch={dispatch} />}
      {state.layoutOptions && <Selector current={state.currentLayout} options={state.layoutOptions} actionType={SelectionActionType.selectLayout} dispatch={dispatch} />}
      {state.game && <Game key={state.game.layout} tiles={state.game.tiles} initialPieces={state.game.pieces} initialPositions={state.game.positions} />}
    </>
  )
}

export default SelectedGame