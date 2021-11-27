import { useEffect, useState, useRef, useCallback } from 'react'
import { Stage, Layer, Group, Rect, Text } from 'react-konva'

import Tile from './Tile'
import Board from './Board'

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

  return coords.map(coord => {
    return {
      key: coord.key,
      ...coord,
      x: coord.x - minX,
      y: coord.y - minY,
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

    return {
      key,
      ...coord,
      x,
      y
    }
  }))
}

function Piece({ tiles, size = 50, fill, position, moveToFront, reportRotation, reportPosition }) {
  const group = useRef(null)
  const click = useCallback(() => {
    reportRotation()
    moveToFront()
  }, [reportRotation, moveToFront])

  const dragStart = useCallback(() => {
    moveToFront()
  }, [moveToFront])

  const dragMove = useCallback((e) => {
    // console.log({dragMove: group.current.position()})
    reportPosition(group.current.position())
  }, [reportPosition])

  const dragEnd = useCallback(() => {

  }, [])

  return (
    <Group ref={group} x={position.x} y={position.y} onClick={click} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd} draggable>
      {tiles.map(({ key, x, y }) => <Tile key={key} x={x} y={y} size={size} fill={fill} />)}
    </Group>
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

function detectHits({ width, height, size, margin, pieces }) {
  const accuracy = 0.1
  const hits = buildBoardHits({ width, height })

  const lines = []
  lines.push(`size = ${size}, margin = ${margin}`)
  const grid = size + margin
  for (let [k, piece] of pieces) {
    lines.push(`>>> ${k}`)
    const { rotation, position } = piece
    // lines.push(`r = ${rotation}`)
    // lines.push(`x = ${position.x}, y = ${position.y}`)
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
      lines.push(`fully aligned @ ${x}, ${y} (${rotation})`)
      const tiles = rotate(piece.tiles, rotation)
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


function App({ initialPieces, initialPositions }) {
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
    for (let k of initialPieces.keys()) {
      map.set(i++, k)
    }
    return map
  })

  const [pieces, setPieces] = useState(() => {
    const map = new Map()
    for (let [k, p] of initialPieces.entries()) {
      const position = initialPositions.get(k)
      map.set(k, {
        fill: p.fill,
        tiles: p.tiles,
        position: {
          x: position.x * (size + margin),
          y: position.y * (size + margin),
        },
        rotation: 0,
      })
    }
    return map
  })

  const moveToFront = useCallback(n => {
    console.log({ moveToFront: n })
    setPieceOrder(m => {
      let j = 0
      for (let k of m.values()) {
        if (k !== n) m.set(j++, k)
      }
      m.set(j++, n)
      return m
    })
  }, [])

  const reportRotation = useCallback((n) => {
    setPieces(old => {
      const map = new Map(old)
      const current = map.get(n)
      const piece = {
        ...current,
        rotation: (current.rotation + 1) % 4,
      }
      map.set(n, piece)
      return map
    })
  }, [])

  const reportPosition = useCallback((n, position) => {
    const current = pieces.get(n)
    if (current.position.x !== position.x || current.position.y !== position.y) {
      setPieces(old => {
        const map = new Map(old)
        const current = old.get(n)
        const piece = {
          ...current,
          position: position,
        }
        map.set(n, piece)
        return map
      })
    }
  }, [pieces])

  const [statusReport, setStatusReport] = useState([])

  useEffect(() => {
    const [hits, lines] = detectHits({ width, height, size, margin, pieces })

    setBoardHits(hits)
    // console.log({ hits })
    setStatusReport(lines.join("\n"))
  }, [counter, pieces])

  const orderedPieces = [...pieceOrder.entries()].sort(([ai, _a], [bi, _b]) => ai - bi)
  // console.log({ orderedPieces })

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
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
              const tiles = rotate(piece.tiles, piece.rotation).map(coord => scale(coord, { size, margin }))
              return <Piece
                key={k}
                size={size}
                tiles={tiles}
                fill={piece.fill}
                position={piece.position}
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
    </Stage>
  )
}

export default App