import { useEffect, useState, useCallback } from 'react'
import GridMap, { GridStore } from './GridMap'
import { BoardHits, Coord, PieceData, PieceName, PiecePosition, PiecePositions, PieceState, Positions, Rotation } from './types'

export interface BoardState {
  pieces: PieceState[]
  positions: PiecePositions
  hits: BoardHits
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

function normalize(coords: GridStore): GridStore {
  let minX = 0
  let minY = 0

  for (let [x, y] of coords) {
    if (x < minX) minX = x
    if (y < minY) minY = y
  }

  return coords.map((x, y) => [x - minX, y - minY])
}

function rotate(coords: GridStore, rotation: Rotation): GridStore {
  const swap = swapMatrix[rotation]
  const [scaleX, scaleY] = scaleMatrix[rotation]

  function transform(x: number, y: number): [number, number] {
    if (swap) {
      return [y * scaleY, x * scaleX]
    }

    return [x * scaleX, y * scaleY]
  }

  return normalize(coords.map(transform))
}

function detectHits(tiles: GridStore, pieces: PiecePositions): GridMap<PieceName[]> {
  const hits: BoardHits = tiles.mapValues((x, y) => [])

  for (let [k, piece] of pieces) {
    const { r, x, y } = piece

    const tiles = rotate(piece.tiles, r)
    for (let [tileX, tileY] of tiles) {
      const ax = x + tileX
      const ay = y + tileY
      const h = hits.get(ax, ay)
      if (h !== undefined) {
        h.push(k)
      }
    }
  }

  return hits
}

function useBoardState(tiles: GridStore, initialPieces: Map<PieceName, PieceData>, initialPositions: Positions): BoardState {
  const [boardHits, setBoardHits] = useState<BoardHits>(() => tiles.mapValues((x, y) => []))

  const [index, setIndex] = useState<number>(0)
  const [pieces, setPieces] = useState<PiecePositions>(() => {
    const map = new Map<PieceName, PiecePosition>()
    for (let [k, p] of initialPieces.entries()) {
      const position = initialPositions.get(k)

      if (position === undefined) {
        continue
      }

      map.set(k, {
        fill: p.fill,
        tiles: p.tiles,
        x: position.x,
        y: position.y,
        r: position.r,
        moveable: position.moveable,
        index: -1,
      })
    }
    return map
  })

  const moveToFront = useCallback<(n: PieceName) => void>(n => {
    const current = pieces.get(n)

    if (current === undefined) {
      throw new Error('piece missing')
    }

    if (current.index !== index) {
      setIndex(i => {
        const newIndex = i + 1
        setPieces(old => {
          const map = new Map<PieceName, PiecePosition>(old)
          const current = map.get(n)

          if (current === undefined) {
            throw new Error('piece missing')
          }    

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

  const reportRotation = useCallback<(n: PieceName) => void>((n) => {
    setPieces(old => {
      const map = new Map(old)
      const current = map.get(n)

      if (current === undefined) {
        throw new Error('piece missing')
      }

      const piece = {
        ...current,
        r: (current.r + 1) % 4,
      }
      map.set(n, piece)
      return map
    })
  }, [])

  const reportPosition = useCallback<(n: PieceName, position: Coord) => void>((n, position) => {
    const current = pieces.get(n)

    if (current === undefined) {
      throw new Error('piece missing')
    }

    if (current.x !== position.x || current.y !== position.y) {
      setPieces(old => {
        const map = new Map(old)
        const current = old.get(n)

        if (current === undefined) {
          throw new Error('piece missing')
        }

        const piece: PiecePosition = {
          ...current,
          x: position.x,
          y: position.y,
        }
        map.set(n, piece)
        return map
      })
    }
  }, [pieces])

  useEffect(() => {
    const hits = detectHits(tiles, pieces)

    setBoardHits(hits)
  }, [tiles, pieces])

  const orderedPieces = [...pieces.entries()].sort(([ka, pa], [kb, pb]) => pa.index - pb.index).map(([key, piece]) => {
    const tiles = rotate(piece.tiles, piece.r)
    return {
      ...piece,
      moveable: piece.moveable === undefined ? true : piece.moveable,
      key,
      tiles,
      moveToFront: () => moveToFront(key),
      reportRotation: () => reportRotation(key),
      reportPosition: (coord: Coord) => reportPosition(key, coord),
    }
  })

  return {
    pieces: orderedPieces,
    positions: pieces,
    hits: boardHits,
  }
}

export default useBoardState