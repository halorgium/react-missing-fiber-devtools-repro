import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import SelectedGame from "./SelectedGame"

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:board/:game" element={<SelectedGame />} />
        <Route path="/:board" element={<SelectedGame />} />
        <Route path="/" element={<SelectedGame />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App