import React from 'react';
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(undefined)
