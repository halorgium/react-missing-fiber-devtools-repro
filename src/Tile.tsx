import { Rect } from 'react-konva'

interface TileProps {
  x?: number
  y?: number
  size: number
  fill: string
}

function Tile({ x = 0, y = 0, size, fill }: TileProps): JSX.Element {
  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill={fill}
      shadowBlur={4}
      cornerRadius={1}
    />
  )
}

export default Tile