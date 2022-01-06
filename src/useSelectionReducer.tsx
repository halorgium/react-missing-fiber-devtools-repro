import { Dispatch, Reducer, useReducer } from "react"
import { GridStore } from "./GridMap"
import { BoardData, BoardName, GameName, PieceData, PieceName, Positions } from "./types"

export type SelectionReducer = Reducer<SelectionState, SelectionAction>
export type SelectionDispatch = Dispatch<SelectionAction>

export enum SelectionActionType {
  selectBoard,
  selectLayout,
  savePositions,
}

interface SelectionAction {
  type: SelectionActionType
  choice?: string | null
  positions?: Positions
}

interface SelectionBase {
  pieces: Map<PieceName, PieceData>
  boards: Map<BoardName, BoardData>
}

interface SelectionInit extends SelectionBase {
  initialBoard: BoardName | null
  initialLayout: GameName | null
}

export interface SelectionState extends SelectionBase {
  currentBoard: BoardName | null
  boardOptions: BoardName[]
  currentLayout: GameName | null
  layoutOptions: GameName[] | null
  game: GameState | null
  positions: Positions | null
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
      if (action.choice === undefined) {
        throw new Error("expected choice")
      }

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
      if (action.choice === undefined) {
        throw new Error("expected choice")
      }

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
    case SelectionActionType.savePositions:
      if (action.positions === undefined) {
        throw new Error("expected positions")
      }

      console.log(action.positions)

      return {
        ...state,
        positions: action.positions,
      }
    default:
      throw new Error('unknown action');
  }
}

function init({ pieces, boards, initialBoard, initialLayout }: SelectionInit): SelectionState {
  const initialState = {
    pieces,
    boards,
    currentBoard: null,
    boardOptions: Array.from(boards.keys()),
    currentLayout: null,
    layoutOptions: null,
    game: null,
    positions: null,
  }

  const selectBoardState = reducer(initialState, { type: SelectionActionType.selectBoard, choice: initialBoard })
  return reducer(selectBoardState, { type: SelectionActionType.selectLayout, choice: initialLayout })
}

function useSelectionReducer(pieces: Map<string, PieceData>, boards: Map<string, BoardData>, initialBoard: BoardName | null, initialLayout: GameName | null): [SelectionState, SelectionDispatch] {
  return useReducer<SelectionReducer, SelectionInit>(
    reducer,
    { pieces, boards, initialBoard, initialLayout },
    init
  )
}

export default useSelectionReducer