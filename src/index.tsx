import React from 'react';
import ReactDOM from 'react-dom'

import { Stage, Layer, Text } from 'react-konva'

function Component3(): JSX.Element {
  return (
    <>
      <Text fontFamily='Courier' text='foo' />
    </>
  )
}

function Component2(): JSX.Element {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Component3 />
      </Layer>
    </Stage>
  )
}

function Component1(): JSX.Element {
  return (
    <Component2 />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Component1 />
  </React.StrictMode>,
  document.getElementById('root')
)