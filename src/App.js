import { Component, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import './App.css';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';
import Konva from 'konva';

import pieces from './pieces'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}


const swapMatrix = [
  false,
  true,
  false,
  true
]

const scaleMatrix = [
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
]

function normalize(coords) {
  let minX = 0
  let minY = 0

  coords.forEach(({ x, y }) => {
    if (x < minX) minX = x
    if (y < minY) minY = y
  })

  return coords.map(({ key, x, y }) => {
    return {
      key,
      x: x - minX,
      y: y - minY,
    }
  })
}

function rotate(coords, rotation) {
  const swap = swapMatrix[rotation]
  const [scaleX, scaleY] = scaleMatrix[rotation]

  const transform = ({ x, y }) => {
    if (swap) {
      return [y * scaleY, x * scaleX]
    }

    return [x * scaleX, y * scaleY]
  }

  return normalize(coords.map((coord) => {
    const key = `x${coord.x}y${coord.y}`

    const [x, y] = transform(coord)

    return { key, x, y }
  }))
}

function Piece({ coords, size = 50, margin = 10, fill, position, moveToFront, reportPosition, reportTiles }) {
  const group = useRef(null)
  const [rotation, setRotation] = useState(0)
  const [tiles, setTiles] = useState(rotate(coords, rotation))
  const click = useCallback(() => {
    setRotation(r => (r + 1) % 4)
    moveToFront()
  }, [])

  const dragStart = useCallback(() => {
    moveToFront()
  }, [])

  const dragMove = useCallback((e) => {
    // console.log({dragMove: group.current.position()})
    reportPosition(group.current.position())
  }, [])

  const dragEnd = useCallback(() => {

  }, [])

  useEffect(() => {
    const newTiles = rotate(coords, rotation)
    setTiles(newTiles)
    reportTiles(newTiles)
  }, [rotation, reportTiles])

  return (
    <Group ref={group} x={position.x * (size + margin)} y={position.y * (size + margin)} onClick={click} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd} draggable>
      {tiles.map(({ key, x, y }) => <Tile key={key} x={x * (size + margin)} y={y * (size + margin)} size={size} fill={fill} />)}
    </Group>
  )
}

function Tile({ x, y, size, fill }) {
  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill={fill}
      shadowBlur={4}
      cornerRadius={1}
    />
  )
}

function buildBoardHits({ width, height }) {
  const xMap = new Map()
  for (let x = 0; x < width; ++x) {
    const yMap = new Map()
    xMap.set(x, yMap)
    for (let y = 0; y < height; ++y) {
      yMap.set(y, [])
    }
  }
  return xMap
}

function detectHits({ width, height, size, margin, piecePositions, pieceTiles }) {
  const accuracy = 0.1
  const hits = buildBoardHits({ width, height })

  const lines = []
  lines.push(`size = ${size}, margin = ${margin}`)
  const grid = size + margin
  for (let [k, piece] of pieces) {
    lines.push(`>>> ${k}`)
    const position = piecePositions.get(k)
    lines.push(`x = ${position.x}, y = ${position.y}`)
    const gx = position.x / grid
    const gy = position.y / grid
    // lines.push(`gx = ${gx}, gy = ${gy}`)

    const dx = ((gx % 1) + 1) % 1
    const closeX = dx < accuracy || dx > (1 - accuracy)
    const x = Math.round(gx)
    if (closeX) {
      // lines.push(`x is close to ${x}`)
    }
    const dy = ((gy % 1) + 1) % 1
    const y = Math.round(gy)
    const closeY = dy < accuracy || dy > (1 - accuracy)
    if (closeY) {
      // lines.push(`y is close to ${y}`)
    }

    if (closeX && closeY) {
      lines.push("fully aligned")
      const tiles = pieceTiles.get(k)
      for (let tile of tiles) {
        const ax = x + tile.x
        const ay = y + tile.y
        // lines.push(`${ax}, ${ay}`)
        if (hits.has(ax)) {
          if (hits.get(ax).has(ay)) {
            const h = hits.get(ax).get(ay)
            h.push(k)
          }
        }
      }
    }
  }

  return [hits, lines]
}


function Board({ hits = null, width, height, size, margin, border = 5 }) {
  const board = []
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const key = `x${x}y${y}`
      let fill = 'grey'
      let hit = null
      if (hits !== null) {
        fill = 'orange'
        const h = hits.get(x).get(y)
        if (h.length === 1) {
          fill = 'green'
        }
        else if (h.length > 0) {
          fill = 'red'
        }
        hit = { count: h.length }
      }

      board.push({
        key,
        x: x * (size + margin) - border,
        y: y * (size + margin) - border,
        size: size + border * 2,
        fill,
        hit,
      })
    }
  }

  return board.map(({ key, x, y, size, fill, hit }) => {
    return (
      <Group key={key} x={x} y={y}>
        <Tile size={size} fill={fill} />
        {hit && <Text text={hit.count} />}
      </Group>
    )
  })
}

function App() {
  const size = 30
  const margin = 15
  const width = 5
  const height = 5

  const [counter, setCounter] = useState(0)
  const increment = useCallback(() => {
    setCounter(i => i + 1)
  }, [])

  const [boardHits, setBoardHits] = useState(() => buildBoardHits({ width, height }))

  const [pieceOrder, setPieceOrder] = useState(() => {
    const map = new Map()
    let i = 0
    for (let k of pieces.keys()) {
      map.set(i++, k)
    }
    return map
  })

  const [piecePositions, setPiecePositions] = useState(() => {
    console.log("recomputing positions")
    const map = new Map()
    for (let [k, p] of pieces.entries()) {
      map.set(k, {
        x: p.position.x * (size + margin),
        y: p.position.y * (size + margin),
      })
    }
    return map
  })

  const [pieceTiles, setPieceTiles] = useState(() => {
    const map = new Map()
    for (let [k, p] of pieces.entries()) {
      map.set(k, p.coords)
    }
    return map
  })

  const moveToFront = useCallback(n => {
    console.log({ moveToFront: n })
    setPieceOrder(m => {
      let j = 0
      for (let [i, k] of m.entries()) {
        if (k !== n) m.set(j++, k)
      }
      m.set(j++, n)
      console.log({ pieceOrder: m })
      return m
    })
  }, [])

  const reportPosition = useCallback((n, coord) => {
    const current = piecePositions.get(n)
    if (current.x !== coord.x || current.y !== coord.y) {
      const map = new Map()
      for (let [k, c] of piecePositions.entries()) {
        if (k === n) {
          if (k === "red") console.log("updating red pos")
          map.set(k, coord)
        }
        else {
          if (k === "red") console.log(`maintaining red pos: ${JSON.stringify(c)}`)
          map.set(k, c)
        }
      }
      setPiecePositions(map)
    }
  }, [])

  const reportTiles = useCallback((n, tiles) => {
    const map = new Map()
    for (let [k, t] of pieceTiles.entries()) {
      if (k === n) {
        map.set(k, tiles)
      }
      else {
        map.set(k, t)
      }
    }
    setPieceTiles(map)
  }, [])

  const [statusReport, setStatusReport] = useState([])

  useEffect(() => {
    const [hits, lines] = detectHits({ width, height, size, margin, pieces, piecePositions, pieceTiles })

    setBoardHits(hits)
    // console.log({ hits })
    setStatusReport(lines.join("\n"))
  }, [counter, piecePositions, pieceTiles])

  const orderedPieces = [...pieceOrder.entries()].sort(([ai, _a], [bi, _b]) => ai - bi)
  // console.log({ orderedPieces })

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <ErrorBoundary>
        <Layer>
          <Group x={300} y={40}>
            <Rect width={100} height={40} fill='grey' onClick={increment} />
            <Text text={counter} />
          </Group>
          <Group x={40} y={40}>
            <Board width={width} height={height} size={size} margin={margin} />
            <Group>
              {orderedPieces.map(([i, k]) => {
                const piece = pieces.get(k)
                return <Piece
                  key={k} size={size} margin={margin} {...piece}
                  moveToFront={() => moveToFront(k)}
                  reportPosition={coord => reportPosition(k, coord)}
                  reportTiles={tiles => reportTiles(k, tiles)}
                />
              })}
            </Group>
          </Group>
          <Group x={500} y={40}>
            <Text fontFamily='Courier' text={statusReport} />
          </Group>
          <Group x={40} y={350}>
            <Board width={width} height={height} size={20} margin={5} border={1} hits={boardHits} />
          </Group>
        </Layer>
      </ErrorBoundary>
    </Stage>
  )
}

function App2() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Group x={300} y={40}>
          <Rect width={100} height={40} fill='grey' />
          <Text text='foo' />
        </Group>
      </Layer>
    </Stage>
  )
}

export default App;
