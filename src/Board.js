import { Group, Text } from 'react-konva'

import Tile from './Tile'

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

export default Board