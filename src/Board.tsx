import { Group, Text } from 'react-konva'
import { GridStore } from './GridMap'

import Tile from './Tile'
import { BoardHits } from './types'

interface BoardProps {
  children?: JSX.Element
  hits?: BoardHits
  tiles: GridStore
  size: number
  margin: number
  border: number
}

function Board({ children, hits, tiles, size, margin, border }: BoardProps): JSX.Element {
  const board = tiles.mapValues((x, y) => {
    let fill = 'grey'
    let hit = undefined
    if (hits !== undefined) {
      fill = 'orange'
      const h = hits.get(x, y)
      if (h !== undefined) {
        if (h.length === 1) {
          fill = 'green'
        }
        else if (h.length > 0) {
          fill = 'red'
        }
        hit = { count: h.length }
      }
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
            {hit && <Text text={hit.count.toString()} />}
          </Group>
        )
      }).values()}
      {children}
    </>
  )
}

export default Board