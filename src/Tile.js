import { Rect } from 'react-konva'

function Tile({ x, y, size, fill }) {
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