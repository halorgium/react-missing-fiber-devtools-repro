import { useEffect, useState, useCallback } from 'react'

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

function detectHits(tiles, pieces) {
  const hits = tiles.mapValues((x, y) => [])

  const lines = []
  for (let [k, piece] of pieces) {
    const { rotation, position } = piece
    lines.push(`>>> ${k} @ ${position.x}, ${position.y} (${rotation})`)

    const tiles = rotate(piece.tiles, rotation)
    for (let tile of tiles) {
      const ax = position.x + tile.x
      const ay = position.y + tile.y
      const h = hits.get(ax, ay)
      if (h !== null && h !== undefined) {
        h.push(k)
      }
    }
  }

  return [hits, lines]
}

const useBoardState = (tiles, initialPieces, initialPositions) => {
  const [boardHits, setBoardHits] = useState(() => tiles.mapValues((x, y) => []))
  const [statusReport, setStatusReport] = useState([])

  const [index, setIndex] = useState(0)
  const [pieces, setPieces] = useState(() => {
    const map = new Map()
    for (let [k, p] of initialPieces.entries()) {
      const position = initialPositions.get(k)

      if (position === null || position === undefined) {
        continue
      }

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

  useEffect(() => {
    const [hits, lines] = detectHits(tiles, pieces)

    setBoardHits(hits)
    setStatusReport(lines.join("\n"))
  }, [tiles, pieces])

  const orderedPieces = [...pieces.entries()].sort(([ka, pa], [kb, pb]) => pa.index - pb.index).map(([key, piece]) => {
    const tiles = rotate(piece.tiles, piece.rotation)
    return {
      ...piece,
      key,
      tiles,
    }
  })

  return {
    pieces: orderedPieces,
    hits: boardHits,
    statusReport,
    moveToFront,
    reportRotation,
    reportPosition,
  }
}

export default useBoardState