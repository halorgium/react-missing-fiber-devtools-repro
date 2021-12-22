import { BrowserRouter, Routes, Route, Link, Navigate, useParams, useNavigate, generatePath } from "react-router-dom"

import Game from './Game'
import pieces from './data/pieces'
import debug from './data/boards/debug'
import fiveSquare from './data/boards/fiveSquare'

const boardLookup = {
  debug,
  fiveSquare,
}

function Home () {
  return (
    <ul>
      <li><Link to="/fiveSquare/unsolved">Five by Five Square</Link></li>
      <li><Link to="/debug/unsolved">Debug</Link></li>
    </ul>
  )
}

function SelectedGame() {
  const navigate = useNavigate()

  let { board, game } = useParams()
  console.log({ board, game})
  if (game === null) {
    game = "unsolved"
  }

  const onGameSelect = function (event) {
    const path = generatePath("/:board/:game", {
      board: board,
      game: event.target.value,
    })

    navigate(path)
  }

  const tiles = boardLookup[board].tiles
  const positions = boardLookup[board].positions.get(game)

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
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/fiveSquare/unsolved" replace={true} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App