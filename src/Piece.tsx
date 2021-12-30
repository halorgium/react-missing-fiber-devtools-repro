import Konva from 'konva'
import { useState, useCallback, useRef } from 'react'
import { Group } from 'react-konva'

import Tile from './Tile'
import { PieceState } from './types'

export interface PieceProps extends PieceState {
  size?: number
  margin: number
}

function Piece({ tiles, x: initialX, y: initialY, size = 50, margin, fill, moveable, moveToFront, reportRotation, reportPosition }: PieceProps) {
  const grid = size + margin

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragging, setDragging] = useState<boolean>(false)
  const [x, setX] = useState<number>(initialX * grid)
  const [y, setY] = useState<number>(initialY * grid)

  const group = useRef<Konva.Group>(null)
  const click = useCallback<() => void>(() => {
    if (moveable) {
      reportRotation()
      moveToFront()
    }
  }, [moveable, reportRotation, moveToFront])

  const dragStart = useCallback<() => void>(() => {
    moveToFront()
    setDragging(true)
  }, [moveToFront])

  const dragMove = useCallback<() => void>(() => {
    if (group.current === null) {
      return
    }

    const position = group.current.position()
    setX(position.x)
    setY(position.y)
  }, [])

  const dragEnd = useCallback<() => void>(() => {
    if (group.current === null) {
      return
    }

    const position = group.current.position()
    const x = Math.round(position.x / grid)
    const y = Math.round(position.y / grid)
    setX(x * grid)
    setY(y * grid)
    reportPosition({ x, y })
    setDragging(false)
  }, [reportPosition, grid])

  return (
    <Group ref={group} x={x} y={y} onClick={click} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd} draggable={moveable}>
      {tiles.toCoords().map(coord => <Tile key={`x${coord.x}y${coord.y}`} x={coord.x * grid} y={coord.y * grid} size={size} fill={fill} />)}
    </Group>
  )
}

export default Piece