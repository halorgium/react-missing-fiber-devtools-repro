import { BrowserRouter, useSearchParams, useNavigate } from "react-router-dom"

import Game from './Game'
import pieces from './data/pieces'
import fiveSquare from './data/boards/fiveSquare'

function SelectedGame() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  let game = params.get("game")
  if (game === null) {
    game = "unsolved"
  }

  const onGameSelect = function (event) {
    navigate(`./?game=${event.target.value}`)
  }

  const tiles = fiveSquare.tiles
  const positions = fiveSquare.positions.get(game)

  return (
    <>
      <select value={game} onChange={onGameSelect}>
        {/* <option key='simple' value='simple'>Simple</option> */}
        {Array.from(positions.keys()).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      <Game key={game} tiles={tiles} initialPieces={pieces} initialPositions={positions} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SelectedGame />
    </BrowserRouter>
  )
}

export default App