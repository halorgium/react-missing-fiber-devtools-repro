import { Component, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import './App.css';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';
import Konva from 'konva';

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

function scale(coord, { size, margin }) {
return {
    ...coord,
    x: coord.x * (size + margin),
    y: coord.y * (size + margin),
  }
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

function Piece({ tiles, size = 50, fill, position, moveToFront, reportRotation, reportPosition }) {
  const group = useRef(null)
  const click = useCallback(() => {
    reportRotation()
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

  return (
    <Group ref={group} x={position.x} y={position.y} onClick={click} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd} draggable>
      {tiles.map(({ key, x, y }) => <Tile key={key} x={x} y={y} size={size} fill={fill} />)}
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

function detectHits({ width, height, size, margin, pieces, pieceRotations, piecePositions }) {
  const accuracy = 0.1
  const hits = buildBoardHits({ width, height })

  const lines = []
  lines.push(`size = ${size}, margin = ${margin}`)
  const grid = size + margin
  for (let [k, piece] of pieces) {
    lines.push(`>>> ${k}`)
    const rotation = pieceRotations.get(k)
    lines.push(`r = ${rotation}`)
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
      const tiles = rotate(piece.coords, rotation)
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
        <Tile key={key} size={size} fill={fill} />
        {hit && <Text text={hit.count} />}
      </Group>
    )
  })
}

function App({ pieces }) {
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

  const [pieceRotations, setPieceRotations] = useState(() => {
    const map = new Map()
    map.set('initial', true)
    map.set('debug', 0)
    for (let [k, p] of pieces.entries()) {
      console.log(`initial rotation for ${k}`)
      map.set(k, 0)
    }
    console.log(`initial rotations = ${JSON.stringify(Array.from(map))}`)
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

  const reportRotation = useCallback((n) => {
    setPieceRotations(old => {
      const map = new Map(old)
      map.set('debug', map.get('debug') + 1)
      map.set(n, (map.get(n) + 1) % 4)
      console.log(`interim rotations = ${JSON.stringify(Array.from(map))}`)
      return map
    })
  }, [pieceRotations])

  const reportPosition = useCallback((n, coord) => {
    const current = piecePositions.get(n)
    if (current.x !== coord.x || current.y !== coord.y) {
      setPiecePositions(old => {
        const map = new Map(old)
        map.set(n, coord)
        return map
      })
    }
  }, [])

  const [statusReport, setStatusReport] = useState([])

  useEffect(() => {
    const [hits, lines] = detectHits({ width, height, size, margin, pieces, pieceRotations, piecePositions })

    setBoardHits(hits)
    // console.log({ hits })
    setStatusReport(lines.join("\n"))
  }, [counter, piecePositions, pieceRotations])

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
                const rotation = pieceRotations.get(k)
                const position = scale(piece.position, { size, margin })
                const tiles = rotate(piece.coords, rotation).map(coord => scale(coord, { size, margin }))
                return <Piece
                  key={k} size={size}
                  tiles={tiles} fill={piece.fill}
                  position={position}
                  rotation={rotation}
                  moveToFront={() => moveToFront(k)}
                  reportRotation={() => reportRotation(k)}
                  reportPosition={coord => reportPosition(k, coord)}
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

export default App;
