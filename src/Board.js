import { Group, Text } from 'react-konva'

import Tile from './Tile'

function Board({ children = null, hits = null, position, tiles, size, margin, border = 5 }) {
  const board = tiles.mapValues((x, y, value) => {
    let fill = 'grey'
    let hit = null
    if (hits !== null) {
      fill = 'orange'
      const h = hits.get(x, y)
      if (h.length === 1) {
        fill = 'green'
      }
      else if (h.length > 0) {
        fill = 'red'
      }
      hit = { count: h.length }
    }

    return {
      fill,
      hit,
    }
  })

  const scale = (size + margin) - border

  return (
    <>
      {board.mapValues((x, y, { fill, hit }) => {
        const key = `x${x}y${y}`
        return (
          <Group key={key} x={x * scale} y={y * scale}>
            <Tile key={key} size={size + border * 2} fill={fill} />
            {hit && <Text text={hit.count} />}
          </Group>
        )
      }).values()}
      {children}
    </>
  )
}

export default Board