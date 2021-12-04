import { BrowserRouter } from "react-router-dom"

import Game from './Game'
import pieces, { positions } from './pieces'

function App() {
  return (
    <BrowserRouter>
      <Game initialPieces={pieces} initialPositions={positions.partialHack} />
    </BrowserRouter>
  )
}

export default App