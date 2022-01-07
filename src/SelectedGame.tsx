import { useParams, useNavigate, generatePath } from "react-router-dom"
import Game from './Game'
import allPieces from './data/pieces'
import allBoards from './data/boards'
import { BoardData, BoardName, GameName, PieceData, PieceName, Positions } from "./types"
import { useEffect, useState } from "react"
import useSelectionReducer, { SelectionActionType, SelectionDispatch, SelectionState } from "./useSelectionReducer"
import Selector from "./Selector"
import { buildLayoutText } from "./Debug"
import CopyToClipboard from "react-copy-to-clipboard"

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

  if (state.positions === null) {
    console.log(`positions: null`)
  } else {
    console.log(`positions: ${JSON.stringify(Array.from(state.positions.entries()))}`)
  }

  return [state, dispatch]
}

interface CopyLayoutProps {
  positions: Positions
}

function CopyLayout({ positions }: CopyLayoutProps): JSX.Element {
  const layoutText = buildLayoutText(positions)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  return (
    <CopyToClipboard text={layoutText} onCopy={() => setCopied(true)}>
      {copied ? <button disabled={true}>Copied Layout</button> : <button>Copy Layout</button>}
    </CopyToClipboard>
  )
}

function SelectedGame(): JSX.Element {
  const [state, dispatch] = useSelection(allPieces, allBoards)

  return (
    <>
      {state.boardOptions && <Selector current={state.currentBoard} options={state.boardOptions} actionType={SelectionActionType.selectBoard} dispatch={dispatch} />}
      {state.layoutOptions && <Selector current={state.currentLayout} options={state.layoutOptions} actionType={SelectionActionType.selectLayout} dispatch={dispatch} />}
      {state.positions && <CopyLayout positions={state.positions} />}
      {/* {state.game && <Game key={state.game.layout} tiles={state.game.tiles} initialPieces={state.game.pieces} initialPositions={state.game.positions} dispatch={dispatch} />} */}
    </>
  )
}

export default SelectedGame