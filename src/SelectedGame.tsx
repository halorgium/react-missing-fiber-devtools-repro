import { useParams, useNavigate, generatePath } from "react-router-dom"
import Game from './Game'
import allPieces from './data/pieces'
import allBoards from './data/boards'
import { BoardData, BoardName, GameName, PieceData, PieceName, Positions, WindowEvent } from "./types"
import { Reducer, useCallback, useReducer } from "react"
import { GridStore } from "./GridMap"

type PathGenerator = (input: string) => string

interface SelectorProps {
  current: string | null
  options: string[]
  actionType: SelectionActionType
  dispatch: React.Dispatch<SelectionAction>
}

function Selector({ current, options, actionType, dispatch }: SelectorProps): JSX.Element {
  const onSelect = useCallback<(event: WindowEvent) => void>((event: WindowEvent) => {
    dispatch({
      type: actionType,
      choice: event.target.value === "" ? null : event.target.value,
    })
  }, [actionType, dispatch])

  return (
    <select value={current === null ? "" : current} onChange={onSelect}>
      <option value=''>-- choose --</option>
      {options.map(k => <option key={k} value={k}>{k}</option>)}
    </select>
  )
}

function useBoardAndGame(): [BoardName, GameName] {
  let { board, game } = useParams()

  console.log({ board, game })

  if (board === undefined) {
    return ["", ""]
  }

  if (game === undefined) {
    return [board, ""]
  }

  return [board, game]
}

type SelectionReducer = Reducer<SelectionState, SelectionAction>

enum SelectionActionType {
  selectBoard,
  selectLayout,
}

interface SelectionAction {
  type: SelectionActionType
  choice: string | null
}

interface SelectionState extends SelectionInit {
  currentBoard: string | null
  boardOptions: string[]
  currentLayout: string | null
  layoutOptions: string[] | null
  game: GameState | null
}

interface GameState {
  layout: GameName
  tiles: GridStore
  pieces: Map<PieceName, PieceData>
  positions: Positions
}

function reducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case SelectionActionType.selectBoard:
      if (state.currentBoard === action.choice) {
        return state
      }

      if (action.choice === null) {
        return {
          ...state,
          currentBoard: null,
          currentLayout: null,
          layoutOptions: null,
          game: null,
        }
      }

      const newBoardData = state.boards.get(action.choice)

      if (newBoardData === undefined) {
        throw new Error("unknown board")
      }

      return {
        ...state,
        currentBoard: action.choice,
        currentLayout: null,
        layoutOptions: Array.from(newBoardData.positions.keys()),
        game: null,
      }
    case SelectionActionType.selectLayout:
      if (state.currentLayout === action.choice) {
        return state
      }

      if (action.choice === null) {
        return {
          ...state,
          currentLayout: null,
          game: null,
        }
      }

      if (state.currentBoard === null) {
        throw new Error("board not selected")
      }

      const currentBoardData = state.boards.get(state.currentBoard)

      if (currentBoardData === undefined) {
        throw new Error("board is missing")
      }

      // TODO: rename to layout
      const positions = currentBoardData.positions.get(action.choice)

      if (positions === undefined) {
        throw new Error("unknown layout")
      }

      return {
        ...state,
        currentLayout: action.choice,
        game: {
          layout: action.choice,
          // TODO: show a board without pieces
          tiles: currentBoardData.tiles,
          pieces: state.pieces,
          positions: positions,
        },
      }
    default:
      throw new Error('unknown action');
  }
}

function init({ pieces, boards }: SelectionInit): SelectionState {
  return {
    pieces,
    boards,
    currentBoard: null,
    boardOptions: Array.from(boards.keys()),
    currentLayout: null,
    layoutOptions: null,
    game: null,
  }
}

interface SelectionInit {
  pieces: Map<PieceName, PieceData>
  boards: Map<BoardName, BoardData>
}

function useSelection(pieces: Map<PieceName, PieceData>, boards: Map<BoardName, BoardData>): [SelectionState, React.Dispatch<SelectionAction>] {
  // const navigate = useNavigate()

  const [state, dispatch] = useReducer<SelectionReducer, SelectionInit>(
    reducer,
    { pieces, boards },
    init
  )

  console.log(JSON.stringify(state))

  /*
  const [board, layout] = useBoardAndGame()

  const pathToBoard = useCallback<PathGenerator>((board: string) => {
    if (board === "") {
      return "/"
    }

    return generatePath("/:board", { board })
  }, [])

  const pathToGame = useCallback<PathGenerator>((game: string) => {
    if (game === "") {
      return pathToBoard(board)
    }

    return generatePath("/:board/:game", { board, game })
  }, [board, pathToBoard])

  let boardData: BoardData | undefined
  let positions: Positions | undefined

  if (board !== undefined) {
    boardData = boards.get(board)

    if (boardData !== undefined && game !== undefined) {
      positions = boardData.positions.get(game)
    }
  }

  // selected={board.current} options={Array.from(boards.keys())} pathGenerator={pathToBoard} 
  // selected={game} options={Array.from(boardData.positions.keys())} pathGenerator={pathToGame}

  */

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