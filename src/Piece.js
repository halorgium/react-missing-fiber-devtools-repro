import { useCallback, useRef } from 'react'
import { Group } from 'react-konva'

import Tile from './Tile'

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

export default Piece