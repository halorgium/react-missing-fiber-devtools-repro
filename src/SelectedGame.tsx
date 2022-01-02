import { useParams, useNavigate, generatePath } from "react-router-dom"
import Game from './Game'
import pieces from './data/pieces'
import boards from './data/boards'
import { BoardData, BoardName, GameName, Positions, WindowEvent } from "./types"
import { useCallback } from "react"

interface SelectorProps {
  selected: string
  options: string[]
  pathGenerator: (input: string) => string
}

function Selector({ selected, options, pathGenerator }: SelectorProps): JSX.Element {
  const navigate = useNavigate()

  const onSelect = useCallback<(event: WindowEvent) => void>((event: WindowEvent) => {
    const path = pathGenerator(event.target.value)

    navigate(path)
  }, [pathGenerator, navigate])

  return (
    <select value={selected} onChange={onSelect}>
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

function SelectedGame(): JSX.Element {
  const [board, game] = useBoardAndGame()

  const pathToBoard = useCallback<(board: string) => string>((board: string) => {
    if (board === "") {
      return "/"
    }

    return generatePath("/:board", { board })
  }, [])

  const pathToGame = useCallback<(game: string) => string>((game: string) => {
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

  return (
    <>
      <Selector selected={board} options={Array.from(boards.keys())} pathGenerator={pathToBoard} />
      {boardData && <Selector selected={game} options={Array.from(boardData.positions.keys())} pathGenerator={pathToGame} />}
      {boardData && positions && <Game key={game} tiles={boardData.tiles} initialPieces={pieces} initialPositions={positions} />}
    </>
  )
}

export default SelectedGame