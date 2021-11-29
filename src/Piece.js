import { useState, useCallback, useRef } from 'react'
import { Group } from 'react-konva'

import Tile from './Tile'

function Piece({ tiles, size = 50, margin, fill, position, moveable, moveToFront, reportRotation, reportPosition }) {
  const grid = size + margin

  const [dragging, setDragging] = useState(false)
  const [x, setX] = useState(position.x * grid)
  const [y, setY] = useState(position.y * grid)

  const group = useRef(null)
  const click = useCallback(() => {
    if (moveable) {
      reportRotation()
      moveToFront()
    }
  }, [reportRotation, moveToFront])

  const dragStart = useCallback(() => {
    moveToFront()
    setDragging(true)
  }, [moveToFront])

  const dragMove = useCallback(() => {
    const position = group.current.position()
    setX(position.x)
    setY(position.y)
  })

  const dragEnd = useCallback(() => {
    const position = group.current.position()
    const x = Math.round(position.x / grid)
    const y = Math.round(position.y / grid)
    console.log({x, y})
    setX(x * grid)
    setY(y * grid)
    reportPosition({x, y})
    setDragging(false)
  }, [reportPosition, grid])

  return (
    <Group ref={group} x={x} y={y} onClick={click} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd} draggable={moveable}>
      {tiles.map(({ key, x, y }) => <Tile key={key} x={x * grid} y={y * grid} size={size} fill={fill} />)}
    </Group>
  )
}

export default Piece