import { BrowserRouter, useSearchParams, useNavigate } from "react-router-dom"

import Game from './Game'
import pieces, { positions } from './pieces'

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

  return (
    <>
      <select value={game} onChange={onGameSelect}>
        {Array.from(positions.keys()).map(k => <option value={k}>{k}</option>)}
      </select>
      <Game key={game} initialPieces={pieces} initialPositions={positions.get(game)} />
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