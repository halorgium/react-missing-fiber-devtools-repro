import React from 'react';
import ReactDOM from 'react-dom'

import { Stage, Layer, Text } from 'react-konva'

function Debug(): JSX.Element {
  return (
    <>
      <Text fontFamily='Courier' text='foo' />
    </>
  )
}

function Game(): JSX.Element {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Debug />
      </Layer>
    </Stage>
  )
}

function App(): JSX.Element {
  return (
    <Game />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)