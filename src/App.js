import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, generatePath } from "react-router-dom"

import Game from './Game'
import pieces from './data/pieces'
import fiveSquare from './data/boards/fiveSquare'

function SelectedGame() {
  const navigate = useNavigate()

  let { board, game } = useParams()
  console.log({ board, game})
  if (game === null) {
    game = "unsolved"
  }

  const onGameSelect = function (event) {
    const path = generatePath("/:board/:game", {
      board: 'fiveSquare',
      game: event.target.value,
    })

    navigate(path)
  }

  const tiles = fiveSquare.tiles
  const positions = fiveSquare.positions.get(game)

  return (
    <>
      <select value={game} onChange={onGameSelect}>
        {/* <option key='simple' value='simple'>Simple</option> */}
        {Array.from(fiveSquare.positions.keys()).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      <Game key={game} tiles={tiles} initialPieces={pieces} initialPositions={positions} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:board/:game" element={<SelectedGame />} />
        <Route path="*" element={<Navigate to="/fiveSquare/unsolved" replace={true} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App