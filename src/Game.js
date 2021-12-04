
import { useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Group } from 'react-konva'

import Piece from './Piece'
import Board from './Board'
import Debug from './Debug'

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

function detectHits({ width, height, pieces }) {
  const hits = buildBoardHits({ width, height })

  const lines = []
  for (let [k, piece] of pieces) {
    const { rotation, position } = piece
    lines.push(`>>> ${k} @ ${position.x}, ${position.y} (${rotation})`)

    const tiles = rotate(piece.tiles, rotation)
    for (let tile of tiles) {
      const ax = position.x + tile.x
      const ay = position.y + tile.y
      if (hits.has(ax)) {
        if (hits.get(ax).has(ay)) {
          const h = hits.get(ax).get(ay)
          h.push(k)
        }
      }
    }
  }

  return [hits, lines]
}


function Game({ initialPieces, initialPositions }) {
  const size = 30
  const margin = 15
  const width = 5
  const height = 5

  const [counter, setCounter] = useState(0)
  const increment = useCallback(() => {
    setCounter(i => i + 1)
  }, [])

  const [boardHits, setBoardHits] = useState(() => buildBoardHits({ width, height }))

  const [index, setIndex] = useState(0)
  const [pieces, setPieces] = useState(() => {
    const map = new Map()
    for (let [k, p] of initialPieces.entries()) {
      const position = initialPositions.get(k)
      map.set(k, {
        fill: p.fill,
        tiles: p.tiles,
        position: position,
        rotation: position.r,
        moveable: position.moveable != null ? position.moveable : true,
        index: -1,
      })
    }
    return map
  })

  const moveToFront = useCallback(n => {
    console.log({ moveToFront: n })

    if (pieces.get(n).index !== index) {
      setIndex(i => {
        const newIndex = i + 1
        setPieces(old => {
          const map = new Map(old)
          const current = map.get(n)
          const piece = {
            ...current,
            index: newIndex,
          }
          map.set(n, piece)
          return map
        })
        return newIndex
      })
    }
  }, [index, pieces])

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

  const orderedPieces = [...pieces.entries()].sort(([ka, pa], [kb, pb]) => pa.index - pb.index)
  // console.log({ orderedPieces })

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Group x={130} y={130}>
          <Board width={width} height={height} size={size} margin={margin}>
            <Group>
              {orderedPieces.map(([k, p]) => {
                const piece = pieces.get(k)
                const tiles = rotate(piece.tiles, piece.rotation)
                return <Piece
                  key={k}
                  size={size}
                  margin={margin}
                  tiles={tiles}
                  fill={piece.fill}
                  position={piece.position}
                  moveable={piece.moveable}
                  moveToFront={() => moveToFront(k)}
                  reportRotation={() => reportRotation(k)}
                  reportPosition={coord => reportPosition(k, coord)}
                />
              })}
            </Group>
          </Board>
        </Group>
        <Group x={500} y={40}>
          <Debug increment={increment} counter={counter} statusReport={statusReport} />
          <Group y={250}>
            <Board width={width} height={height} size={20} margin={5} border={1} hits={boardHits} />
          </Group>
        </Group>
      </Layer>
    </Stage>
  )
}

export default Game